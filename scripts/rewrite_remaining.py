#!/usr/bin/env python3
"""
Manually rewrite the 2 remaining articles that hit rate limit
"""
import re

# Read the partially rewritten file
with open('/home/ubuntu/coffee-craft/data/learning_rewritten.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Article 10: Setting Up Your Station - Rewritten manually
setting_up_station_new = """# Setting Up Your Home Coffee Station

Let's build a coffee corner that makes you excited to brew every morning.

## Choose Your Spot

Pick a location with:
- **Counter space**: At least 2 feet wide for equipment
- **Power outlet**: For grinder and kettle
- **Natural light**: Makes the ritual more enjoyable
- **Water access**: Close to sink for easy refills

## Essential Layout

**The Workflow Triangle:**
1. **Beans & Grinder** (left)
2. **Scale & Brewer** (center)
3. **Kettle & Water** (right)

This left-to-right flow matches how you'll actually brew, reducing unnecessary movement.

## Storage Solutions

**For Beans:**
- Airtight containers away from light
- Room temperature (not fridge!)
- Label with roast date

**For Equipment:**
- Grinder stays on counter (you'll use it daily)
- Filters in a drawer or container
- Brewing devices on open shelving for easy access

## Keep It Clean

A clean station = better coffee:
- Wipe down daily after brewing
- Deep clean grinder weekly
- Descale kettle monthly
- Replace filters as needed

## Make It Yours

Add personal touches:
- Favorite mug collection on display
- Small plant or succulent
- Tasting notes journal
- Brewing recipe cards

**Pro tip**: Keep your most-used method front and center. Rotate seasonal brewers (cold brew in summer, moka pot in winter) to keep things interesting.

Your coffee station should feel inviting, not intimidating. Start simple and add equipment as your skills grow."""

# Article 11: Buying & Storing Beans - Rewritten manually  
buying_storing_new = """# Buying & Storing Coffee Beans

Fresh beans are the foundation of great coffee. Here's how to buy smart and keep them at their best.

## When to Buy

**The Freshness Window:**
- **Peak flavor**: 7-21 days after roast date
- **Still good**: 21-45 days
- **Past prime**: 45+ days

Always check the roast date, not the "best by" date. If there's no roast date on the bag, find a different roaster.

## Where to Buy

**Local Roasters (Best Option):**
- Freshest beans possible
- Can ask questions and get recommendations
- Support local business
- Often offer free tastings

**Online Specialty Roasters:**
- Wider variety of origins
- Usually ship within days of roasting
- Subscription options available
- Read roast date carefully

**Avoid:**
- Pre-ground coffee (oxidizes quickly)
- Grocery store beans without roast dates
- Beans in clear containers (light degrades quality)

## How Much to Buy

Buy only what you'll use in 2-3 weeks. For most home brewers:
- **Solo drinker**: 250g (½ lb)
- **Two people**: 500g (1 lb)
- **Daily enthusiast**: 1kg (2 lbs) max

## Proper Storage

**The Golden Rules:**
1. **Airtight container**: Prevents oxygen exposure
2. **Cool, dark place**: Room temperature, away from light
3. **Never refrigerate**: Causes condensation and absorbs odors
4. **Never freeze**: Unless storing long-term (see below)

**Container Options:**
- Original bag with clip (if it has a one-way valve)
- Airscape canister (pushes out air)
- Mason jar with tight lid (keep in cabinet)

## Long-Term Storage (Freezing)

If you must store beans for over a month:
1. Divide into weekly portions
2. Vacuum seal each portion
3. Freeze immediately
4. Thaw completely before opening (prevents condensation)
5. Use within 24 hours of thawing

**Important**: Only freeze once. Don't refreeze beans.

## Signs Your Beans Are Past Prime

- **No aroma** when you open the bag
- **Oily, greasy surface** (unless it's a dark roast)
- **Flat, cardboard taste** in the cup
- **No crema** on espresso (if beans are fresh roasted)

## The Bottom Line

Fresh beans = better coffee. It's that simple. Find a local roaster you trust, buy small batches, and store them properly. Your taste buds will thank you."""

# Replace the old content with new content
# Find and replace Article 10
old_pattern_10 = r"(id: 'setting-up-station',\s*title: 'Setting Up Your Station',\s*content: `)[^`]+(`,\s*readTime: \d+)"
new_text_10 = r"\1" + setting_up_station_new.replace('\\', '\\\\').replace('$', '\\$') + r"\2"
content = re.sub(old_pattern_10, new_text_10, content, flags=re.DOTALL)

# Find and replace Article 11
old_pattern_11 = r"(id: 'buying-storing-beans',\s*title: 'Buying & Storing Beans',\s*content: `)[^`]+(`,\s*readTime: \d+)"
new_text_11 = r"\1" + buying_storing_new.replace('\\', '\\\\').replace('$', '\\$') + r"\2"
content = re.sub(old_pattern_11, new_text_11, content, flags=re.DOTALL)

# Write back
with open('/home/ubuntu/coffee-craft/data/learning_rewritten.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Remaining 2 articles rewritten manually!")
print("All 11 articles now complete with professional barista tone.")
