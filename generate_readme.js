/**
 * Script to generate a comprehensive README.md with all Apify Actors organized by category
 */

const fs = require('fs');

// Read the JSON file
const actors = JSON.parse(fs.readFileSync('apify_actors.json', 'utf-8'));

console.log(`Processing ${actors.length} actors...`);

// Organize actors by category
const actorsByCategory = {};
const uncategorized = [];

for (const actor of actors) {
    const categories = actor.categories || [];
    if (categories.length > 0) {
        for (const category of categories) {
            if (!actorsByCategory[category]) {
                actorsByCategory[category] = [];
            }
            // Avoid duplicates - check if actor already exists in this category
            const exists = actorsByCategory[category].some(a => 
                a.name === actor.name && a.username === actor.username
            );
            if (!exists) {
                actorsByCategory[category].push(actor);
            }
        }
    } else {
        uncategorized.push(actor);
    }
}

// Sort categories alphabetically
const sortedCategories = Object.keys(actorsByCategory).sort();

// Generate README content
let content = `# API-mega-list\n\n`;
content += `This GitHub repo is a powerhouse collection of APIs you can start using immediately to build everything from simple automations to full-scale applications. One of the most valuable API lists on GitHub—period. 💪\n\n`;

content += `## 📦 Apify Actors Collection\n\n`;
content += `This repository includes a comprehensive collection of **${actors.length} Apify Actors** (APIs) - ready-to-use web scraping and automation tools from the Apify platform.\n\n`;

content += `### What are Apify Actors?\n`;
content += `Apify Actors are pre-built web scraping and automation tools that can extract data from websites, automate workflows, and integrate with AI applications. Each actor is a ready-to-use API that you can run via the Apify platform.\n\n`;

content += `### 📊 Statistics\n`;
content += `- **Total APIs**: ${actors.length}\n`;
content += `- **Categories**: ${sortedCategories.length}\n`;
content += `- **All links include affiliate tracking** (\`?fpr=p2hrc6\`)\n\n`;

content += `### 📁 Additional Files\n`;
content += `- **[APIFY_ACTORS.md](APIFY_ACTORS.md)** - Complete markdown list of all actors organized by category (~8.3 MB)\n`;
content += `- **[apify_actors.json](apify_actors.json)** - Full JSON dataset with all actor details (~11.6 MB)\n`;
content += `- **[apify_actors_simple.txt](apify_actors_simple.txt)** - Simple text format with names and URLs (~996 KB)\n\n`;

content += `---\n\n`;
content += `## 📚 Complete API List by Category\n\n`;

// Add table of contents
content += `### Table of Contents\n\n`;
for (const category of sortedCategories) {
    const count = actorsByCategory[category].length;
    const anchor = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    content += `- [${category}](#${anchor}) (${count} APIs)\n`;
}
if (uncategorized.length > 0) {
    content += `- [Uncategorized](#uncategorized) (${uncategorized.length} APIs)\n`;
}
content += `\n---\n\n`;

// Write categorized actors
for (const category of sortedCategories) {
    const categoryActors = actorsByCategory[category];
    const anchor = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    content += `## ${category} {#${anchor}}\n\n`;
    content += `*${categoryActors.length} APIs*\n\n`;
    
    // Sort actors by title
    const sortedActors = categoryActors.sort((a, b) => 
        (a.title || a.name || '').localeCompare(b.title || b.name || '')
    );
    
    for (const actor of sortedActors) {
        const title = actor.title || actor.name || 'Unknown';
        const affiliateUrl = actor.affiliate_url || actor.url || '';
        const description = actor.description || '';
        
        // Truncate long descriptions for readability
        const maxDescLength = 200;
        let shortDescription = description;
        if (description.length > maxDescLength) {
            shortDescription = description.substring(0, maxDescLength).trim() + '...';
        }
        
        if (shortDescription) {
            content += `- **[${title}](${affiliateUrl})** - ${shortDescription}\n`;
        } else {
            content += `- **[${title}](${affiliateUrl})**\n`;
        }
    }
    content += `\n`;
}

// Write uncategorized actors
if (uncategorized.length > 0) {
    content += `## Uncategorized\n\n`;
    content += `*${uncategorized.length} APIs*\n\n`;
    
    const sortedUncategorized = uncategorized.sort((a, b) => 
        (a.title || a.name || '').localeCompare(b.title || b.name || '')
    );
    
    for (const actor of sortedUncategorized) {
        const title = actor.title || actor.name || 'Unknown';
        const affiliateUrl = actor.affiliate_url || actor.url || '';
        const description = actor.description || '';
        
        const maxDescLength = 200;
        let shortDescription = description;
        if (description.length > maxDescLength) {
            shortDescription = description.substring(0, maxDescLength).trim() + '...';
        }
        
        if (shortDescription) {
            content += `- **[${title}](${affiliateUrl})** - ${shortDescription}\n`;
        } else {
            content += `- **[${title}](${affiliateUrl})**\n`;
        }
    }
    content += `\n`;
}

content += `---\n\n`;
content += `## 🚀 Usage\n\n`;
content += `All links in this collection include affiliate tracking. When you click on any actor link, you'll be taken to the Apify platform where you can:\n`;
content += `- View actor documentation\n`;
content += `- Run actors via API\n`;
content += `- Schedule automated runs\n`;
content += `- Integrate with your applications\n\n`;

content += `## 📝 Notes\n\n`;
content += `- All APIs are sorted alphabetically within their categories\n`;
content += `- Descriptions are truncated to 200 characters for readability\n`;
content += `- For full descriptions and details, visit the individual API pages\n`;
content += `- This list is automatically generated from the Apify Store API\n\n`;

content += `---\n\n`;
content += `*Last updated: ${new Date().toISOString().split('T')[0]}*\n`;
content += `*Total APIs: ${actors.length}*\n`;

// Write to README.md
fs.writeFileSync('README.md', content, 'utf-8');
console.log(`✅ README.md generated successfully!`);
console.log(`   - ${sortedCategories.length} categories`);
console.log(`   - ${actors.length} total APIs`);
console.log(`   - ${uncategorized.length} uncategorized APIs`);

