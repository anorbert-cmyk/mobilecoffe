// Perplexity API Service for Real-Time Equipment Data
// Fetches current specs, prices, and reviews for coffee equipment

import axios from 'axios';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  citations?: string[];
}

export interface EquipmentData {
  name: string;
  brand: string;
  currentPrice: number;
  priceSource: string;
  rating: number;
  reviewCount: number;
  pros: string[];
  cons: string[];
  keySpecs: Record<string, string>;
  lastUpdated: string;
  citations: string[];
}

export interface ComparisonData {
  items: EquipmentData[];
  recommendation: string;
  comparisonSummary: string;
}

class PerplexityService {
  private apiKey: string | null = null;

  constructor() {
    // API key will be loaded from environment
    if (typeof process !== 'undefined' && process.env?.SONAR_API_KEY) {
      this.apiKey = process.env.SONAR_API_KEY;
    }
  }

  private async query(messages: PerplexityMessage[]): Promise<PerplexityResponse | null> {
    if (!this.apiKey) {
      console.warn('Perplexity API key not configured');
      return null;
    }

    try {
      const response = await axios.post<PerplexityResponse>(
        PERPLEXITY_API_URL,
        {
          model: 'sonar-pro',
          messages,
          temperature: 0.2,
          max_tokens: 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Perplexity API error:', error);
      return null;
    }
  }

  async getEquipmentDetails(equipmentName: string, equipmentType: 'espresso-machine' | 'grinder'): Promise<EquipmentData | null> {
    const systemPrompt = `You are a coffee equipment expert. Provide accurate, current information about coffee equipment including prices, specs, and reviews. Always respond in valid JSON format.`;

    const userPrompt = `Get current details for the ${equipmentType === 'espresso-machine' ? 'espresso machine' : 'coffee grinder'}: "${equipmentName}"

Return a JSON object with:
{
  "name": "full product name",
  "brand": "brand name",
  "currentPrice": number (USD, current retail price),
  "priceSource": "where the price was found",
  "rating": number (out of 5, average from reviews),
  "reviewCount": number (approximate total reviews),
  "pros": ["list of 3-5 key advantages"],
  "cons": ["list of 2-3 drawbacks"],
  "keySpecs": {
    "boilerType": "for machines",
    "pumpPressure": "for machines",
    "burrType": "for grinders",
    "burrSize": "for grinders",
    "etc": "other relevant specs"
  }
}`;

    const response = await this.query([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    if (!response) return null;

    try {
      const content = response.choices[0]?.message?.content || '';
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const data = JSON.parse(jsonMatch[0]);
      return {
        ...data,
        lastUpdated: new Date().toISOString(),
        citations: response.citations || [],
      };
    } catch (error) {
      console.error('Failed to parse equipment data:', error);
      return null;
    }
  }

  async compareEquipment(items: string[], equipmentType: 'espresso-machine' | 'grinder'): Promise<ComparisonData | null> {
    const systemPrompt = `You are a coffee equipment expert. Compare coffee equipment objectively and provide helpful recommendations. Always respond in valid JSON format.`;

    const userPrompt = `Compare these ${equipmentType === 'espresso-machine' ? 'espresso machines' : 'coffee grinders'}:
${items.map((item, i) => `${i + 1}. ${item}`).join('\n')}

Return a JSON object with:
{
  "items": [
    {
      "name": "product name",
      "brand": "brand",
      "currentPrice": number,
      "priceSource": "source",
      "rating": number,
      "reviewCount": number,
      "pros": ["advantages"],
      "cons": ["drawbacks"],
      "keySpecs": {}
    }
  ],
  "recommendation": "Which one to buy and why (2-3 sentences)",
  "comparisonSummary": "Key differences between the items (2-3 sentences)"
}`;

    const response = await this.query([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    if (!response) return null;

    try {
      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const data = JSON.parse(jsonMatch[0]);
      return {
        ...data,
        items: data.items.map((item: any) => ({
          ...item,
          lastUpdated: new Date().toISOString(),
          citations: response.citations || [],
        })),
      };
    } catch (error) {
      console.error('Failed to parse comparison data:', error);
      return null;
    }
  }

  async searchEquipment(query: string, category: 'espresso-machine' | 'grinder', priceRange?: { min: number; max: number }): Promise<EquipmentData[]> {
    const systemPrompt = `You are a coffee equipment expert. Search for and recommend coffee equipment based on user criteria. Always respond in valid JSON format.`;

    let priceConstraint = '';
    if (priceRange) {
      priceConstraint = ` in the price range $${priceRange.min} - $${priceRange.max}`;
    }

    const userPrompt = `Find the top 5 ${category === 'espresso-machine' ? 'espresso machines' : 'coffee grinders'} matching: "${query}"${priceConstraint}

Return a JSON array:
[
  {
    "name": "product name",
    "brand": "brand",
    "currentPrice": number,
    "priceSource": "source",
    "rating": number,
    "reviewCount": number,
    "pros": ["advantages"],
    "cons": ["drawbacks"],
    "keySpecs": {}
  }
]`;

    const response = await this.query([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    if (!response) return [];

    try {
      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];

      const data = JSON.parse(jsonMatch[0]);
      return data.map((item: any) => ({
        ...item,
        lastUpdated: new Date().toISOString(),
        citations: response.citations || [],
      }));
    } catch (error) {
      console.error('Failed to parse search results:', error);
      return [];
    }
  }

  async searchCafes(latitude: number, longitude: number, query: string): Promise<any[]> {
    const systemPrompt = `You are a local coffee expert. Find real specialty coffee shops near the given location. Always respond in valid JSON format.`;

    const userPrompt = `Find specialty coffee shops near coordinates ${latitude}, ${longitude} matching: "${query}"

Return a JSON array of 5-10 cafes with:
[
  {
    "id": "unique-id",
    "name": "cafe name",
    "rating": number (out of 5),
    "reviewCount": number,
    "priceLevel": number (1-4),
    "address": "full address",
    "neighborhood": "area name",
    "image": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    "isOpen": true,
    "openingHours": "hours",
    "features": ["WiFi", "Card Payment"],
    "description": "brief description",
    "latitude": number,
    "longitude": number,
    "phone": "+phone",
    "website": "url",
    "specialties": ["specialty 1", "specialty 2"]
  }
]`;

    const response = await this.query([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    if (!response) return [];

    try {
      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];

      const data = JSON.parse(jsonMatch[0]);
      return data;
    } catch (error) {
      console.error('Failed to parse cafe search results:', error);
      return [];
    }
  }
}

export const perplexityService = new PerplexityService();
