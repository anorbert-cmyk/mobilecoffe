#!/usr/bin/env python3
"""
Rewrite all learning articles with professional barista tone using Gemini API
"""
import os
import re
import json
from google import genai
from google.genai import types

# Initialize Gemini client
client = genai.Client(api_key=os.environ['GEMINI_API_KEY'])

CONTENT_GUIDELINES = """You are an expert coffee educator and content creator for a mobile app focused on coffee brewing, coffee culture, and specialty coffee knowledge.

PERSONA:
- You speak like a friendly, knowledgeable barista.
- Your tone is warm, motivating, clear, and non-judgmental.
- You respect beginners while still offering value to advanced users.
- You never sound elitist, overly academic, or pretentious.
- You explain complex concepts simply but intelligently.

TARGET AUDIENCE:
- Curious beginners who just started exploring coffee.
- Enthusiastic home brewers with intermediate knowledge.
- Advanced users who appreciate nuance, detail, and technique.

CONSTRAINTS:
- Keep language clear and friendly.
- Avoid unnecessary jargon (or explain it immediately if used).
- Avoid overly long paragraphs.
- Use examples where possible.
- No generic filler phrases like "Coffee is loved worldwide..."
- Provide actionable or practical insights when relevant.
- Structure content clearly (headings, bullets, short sections).
- Content must feel premium, not blog-spam.
- MUST use Markdown format with proper headings (# ## ###)
- Keep the same structure and information, just improve the tone and clarity
"""

def extract_article_content(text, start_marker, end_marker):
    """Extract article content between markers"""
    pattern = rf"{re.escape(start_marker)}(.*?){re.escape(end_marker)}"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None

def rewrite_article(title, original_content):
    """Rewrite article content with professional barista tone"""
    prompt = f"""{CONTENT_GUIDELINES}

TASK:
Rewrite the following coffee education article. Keep the same information and structure, but improve the tone to be more engaging, friendly, and professional like a knowledgeable barista.

ORIGINAL ARTICLE:
Title: {title}

{original_content}

REWRITTEN ARTICLE (Markdown format):"""

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=2048,
            )
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error rewriting article '{title}': {e}")
        return original_content

def main():
    # Read the learning.ts file
    learning_file = '/home/ubuntu/coffee-craft/data/learning.ts'
    with open(learning_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all article blocks
    article_pattern = r"\{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*content:\s*`([^`]+)`"
    articles = re.findall(article_pattern, content, re.DOTALL)
    
    print(f"Found {len(articles)} articles to rewrite")
    
    # Rewrite each article
    new_content = content
    for i, (article_id, title, original_text) in enumerate(articles, 1):
        print(f"\n[{i}/{len(articles)}] Rewriting: {title}")
        
        # Rewrite the content
        rewritten = rewrite_article(title, original_text.strip())
        
        # Escape backticks in the rewritten content
        rewritten_escaped = rewritten.replace('`', '\\`')
        
        # Replace in the file content
        old_block = f"content: `{original_text}`"
        new_block = f"content: `{rewritten_escaped}`"
        new_content = new_content.replace(old_block, new_block, 1)
        
        print(f"✓ Completed: {title}")
    
    # Write the updated content back
    output_file = '/home/ubuntu/coffee-craft/data/learning_rewritten.ts'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"\n✅ All articles rewritten! Output saved to: {output_file}")
    print("Review the output and then replace learning.ts with learning_rewritten.ts")

if __name__ == '__main__':
    main()
