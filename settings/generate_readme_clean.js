/**
 * Script to generate a clean, organized README.md with all Apify Actors
 */

const fs = require('fs');
const path = require('path');

// Read the JSON file (look in parent directory)
const jsonPath = path.join(__dirname, '..', 'apify_actors.json');
const actors = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

console.log(`Processing ${actors.length} actors...`);
console.log(`Filtering out test/placeholder actors...`);

// Function to check if an actor should be filtered out (test/placeholder actors)
function shouldFilterActor(actor) {
    const title = (actor.title || actor.name || '').toLowerCase();
    const name = (actor.name || '').toLowerCase();
    
    // Filter patterns
    const filterPatterns = [
        /^my actor/i,           // "My Actor", "My Actor 1", "My Actor 29", etc.
        /^testactor/i,          // "testactor", "TestActor"
        /^test crawler/i,       // "test Crawler", "TEST CRAWLER"
        /^test actor/i,         // "Test Actor"
        /^my actorrr/i,         // "My Actorrr"
        /^my actor\s*\d+$/i,   // "My Actor 1", "My Actor 29", etc.
        /^test\s*$/i,          // Just "test"
        /^test\s+crawler/i,    // "test crawler", "TEST CRAWLER CMS"
    ];
    
    // Check if title matches any filter pattern
    for (const pattern of filterPatterns) {
        if (pattern.test(title) || pattern.test(name)) {
            return true;
        }
    }
    
    // Also filter if description is just "test" or very short placeholder text
    const description = (actor.description || '').toLowerCase().trim();
    if (description === 'test' || description === '') {
        // Only filter if title also looks like a placeholder
        if (title.includes('my actor') || title.includes('test')) {
            return true;
        }
    }
    
    return false;
}

// Function to convert category name to readable format and anchor
function formatCategoryName(category) {
    const acronyms = {
        'AI': 'AI',
        'MCP': 'MCP',
        'SEO': 'SEO',
        'API': 'API'
    };
    
    let readable = category
        .split('_')
        .map(word => {
            const upper = word.toUpperCase();
            if (acronyms[upper]) {
                return acronyms[upper];
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
    
    if (readable === 'Ai') readable = 'AI';
    if (readable === 'Mcp Servers') readable = 'MCP Servers';
    if (readable === 'Seo Tools') readable = 'SEO Tools';
    
    const anchor = readable.toLowerCase().replace(/\s+/g, '-');
    
    return { readable, anchor };
}

// Organize actors by category
const actorsByCategory = {};
const uncategorized = [];
let filteredCount = 0;

for (const actor of actors) {
    // Filter out test/placeholder actors
    if (shouldFilterActor(actor)) {
        filteredCount++;
        continue;
    }
    const categories = actor.categories || [];
    if (categories.length > 0) {
        for (const category of categories) {
            if (!actorsByCategory[category]) {
                actorsByCategory[category] = [];
            }
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

const sortedCategories = Object.keys(actorsByCategory).sort();
const totalActors = actors.length - filteredCount;

// Generate README content
let content = `<div align="center">\n\n`;
content += `# 🚀 API Mega List\n\n`;
content += `<img src="https://firebasestorage.googleapis.com/v0/b/facesift.firebasestorage.app/o/user_uploads%2F83EXwNWgaKe1BHmyd9ISw3HCEfi2%2F1765301877738-Generated%20Image%20December%2009%2C%202025%20-%2012_37PM.jpeg?alt=media&token=e2e9e673-ff88-4683-a0b0-9eb3aeeb9559" alt="API Mega List" style="max-width: 100%; height: auto;">\n\n`;
content += `**The most comprehensive collection of APIs on GitHub** - ${totalActors.toLocaleString()} ready-to-use APIs for building everything from simple automations to full-scale applications.\n\n`;
content += `---\n\n`;
content += `### 📊 Repository Stats\n\n`;
content += `<img src="https://img.shields.io/badge/APIs-${totalActors.toLocaleString()}-blue?style=for-the-badge&logo=api" alt="Total APIs">\n`;
content += `<img src="https://img.shields.io/badge/Categories-${sortedCategories.length}-green?style=for-the-badge&logo=tag" alt="Categories">\n`;
content += `<img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge&logo=check-circle" alt="Status">\n`;
content += `<img src="https://img.shields.io/badge/Updated-Daily-brightgreen?style=for-the-badge&logo=clock" alt="Updated">\n\n`;
content += `---\n\n`;
content += `### ⭐ Star This Repository\n\n`;
content += `**If this API list has helped you, please consider giving it a star! ⭐**\n\n`;
content += `*Your support helps others discover this valuable resource and keeps me motivated to maintain and update it regularly.*\n\n`;
content += `<a href="https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/stargazers" target="_blank"><img src="https://img.shields.io/github/stars/YOUR_USERNAME/YOUR_REPO_NAME?style=for-the-badge&logo=github&color=yellow&label=Stars" alt="GitHub Stars"></a>\n\n`;
content += `---\n\n`;
content += `### ☕ Support the Creator\n\n`;
content += `**If this repo has helped you, consider buying me a coffee! ☕**\n\n`;
content += `*Your support keeps me creating valuable repos and keeping everything up to date.*\n\n`;
content += `<a href="https://buymeacoffee.com/viralwavestudio" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>\n\n`;
content += `</div>\n\n`;

content += `---\n\n`;

// Statistics section with badges
content += `<div align="center">\n\n`;
content += `## 📊 Collection Statistics\n\n`;
content += `| Metric | Count |\n`;
content += `|--------|-------|\n`;
content += `| **Total APIs** | **${totalActors.toLocaleString()}** |\n`;
content += `| **Categories** | **${sortedCategories.length}** |\n`;
content += `| **Last Updated** | ${new Date().toISOString().split('T')[0]} |\n\n`;
content += `</div>\n\n`;

content += `---\n\n`;

// What are these APIs section
content += `## 🤔 What Can You Build?\n\n`;
content += `This collection contains **${totalActors.toLocaleString()} ready-to-use APIs** that you can integrate directly into your applications. Whether you're building web scrapers, automating workflows, processing data, or creating AI-powered tools, these APIs provide the building blocks you need.\n\n`;
content += `**The possibilities are endless:**\n\n`;
content += `- 🔍 **Data Collection** - Extract information from websites, social media, e-commerce platforms, and more\n`;
content += `- 🤖 **Automation** - Automate repetitive tasks, workflows, and business processes\n`;
content += `- 📊 **Analytics & Insights** - Gather market intelligence, competitor data, and business metrics\n`;
content += `- 🎯 **Lead Generation** - Find contacts, emails, and business opportunities\n`;
content += `- 🛒 **E-commerce Tools** - Monitor prices, track products, analyze market trends\n`;
content += `- 📱 **Social Media** - Scrape posts, analyze engagement, track trends\n`;
content += `- 🏠 **Real Estate** - Extract property listings, market data, and investment opportunities\n`;
content += `- 💼 **Job Market** - Aggregate job listings, analyze salaries, track opportunities\n`;
content += `- 🚀 **AI Integration** - Connect with AI models, process content, generate insights\n\n`;
content += `**Each API is production-ready** - simply integrate it into your application and start building. No need to build scrapers from scratch or maintain complex infrastructure. Focus on what matters: creating amazing applications that solve real problems.\n\n`;

content += `---\n\n`;

// Table of Contents - simple list format
content += `## 📚 Table of Contents\n\n`;

for (const category of sortedCategories) {
    const count = actorsByCategory[category].length;
    const { readable } = formatCategoryName(category);
    const folderName = `${readable.toLowerCase().replace(/\s+/g, '-')}-apis-${count}`;
    content += `- [${readable}](./${folderName}/) - ${count.toLocaleString()} APIs\n`;
}

if (uncategorized.length > 0) {
    content += `- [Uncategorized](#uncategorized) - ${uncategorized.length.toLocaleString()} APIs\n`;
}

content += `\n`;

content += `---\n\n`;

// Helper function to generate category README content
function generateCategoryReadme(categoryName, categoryActors, anchor) {
    let categoryContent = `# ${categoryName}\n\n`;
    categoryContent += `<p align="right"><a href="../README.md#-table-of-contents">← Back to main list</a></p>\n\n`;
    categoryContent += `**Organized APIs by Category**\n\n`;
    categoryContent += `**${categoryActors.length.toLocaleString()} APIs in this category**\n\n`;
    
    // Sort actors by title
    const sortedActors = categoryActors.sort((a, b) => 
        (a.title || a.name || '').localeCompare(b.title || b.name || '')
    );
    
    // Create table header
    categoryContent += `| API Name | Description |\n`;
    categoryContent += `|----------|-------------|\n`;
    
    // Add each actor as a table row
    for (const actor of sortedActors) {
        const title = actor.title || actor.name || 'Unknown';
        const affiliateUrl = actor.affiliate_url || actor.url || '';
        const description = actor.description || '';
        
        // Truncate descriptions at word boundaries
        const maxDescLength = 200;
        let shortDescription = description;
        if (description.length > maxDescLength) {
            let cutPoint = maxDescLength;
            const lastSpace = description.lastIndexOf(' ', maxDescLength);
            if (lastSpace > maxDescLength * 0.8) {
                cutPoint = lastSpace;
            }
            shortDescription = description.substring(0, cutPoint).trim() + '...';
        }
        
        // Clean up title - remove extra brackets if present
        let cleanTitle = title;
        if (cleanTitle.startsWith('[') && cleanTitle.includes(']')) {
            cleanTitle = cleanTitle.replace(/^\[([^\]]+)\]\s*/, '$1 ');
        }
        
        // Escape pipe characters and newlines for table format
        cleanTitle = cleanTitle.replace(/\|/g, '&#124;').replace(/\n/g, ' ');
        const safeDescription = (shortDescription || '').replace(/\|/g, '&#124;').replace(/\n/g, ' ');
        
        if (safeDescription) {
            categoryContent += `| [${cleanTitle}](${affiliateUrl}) | ${safeDescription} |\n`;
        } else {
            categoryContent += `| [${cleanTitle}](${affiliateUrl}) | - |\n`;
        }
    }
    
    categoryContent += `\n---\n\n`;
    categoryContent += `<p align="center"><a href="../README.md">← Back to main API list</a></p>\n`;
    
    return categoryContent;
}

// Write categorized actors with better formatting
for (const category of sortedCategories) {
    const categoryActors = actorsByCategory[category];
    const { readable, anchor } = formatCategoryName(category);
    
    // Create category folder name: category-apis-{count}
    const folderName = `${readable.toLowerCase().replace(/\s+/g, '-')}-apis-${categoryActors.length}`;
    const categoryDir = path.join(process.cwd(), folderName);
    
    // Create category folder if it doesn't exist
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
        console.log(`Created folder: ${folderName}/`);
    }
    
    // Generate and write category README
    const categoryReadme = generateCategoryReadme(readable, categoryActors, anchor);
    const categoryReadmePath = path.join(categoryDir, 'README.md');
    fs.writeFileSync(categoryReadmePath, categoryReadme, 'utf-8');
    console.log(`Created ${folderName}/README.md`);
    
    // Add to main README with link to category folder
    content += `<a id="${anchor}"></a>\n\n`;
    content += `## ${readable}\n\n`;
    content += `<p align="right"><a href="#-table-of-contents">↑ Back to top</a></p>\n\n`;
    content += `**${categoryActors.length.toLocaleString()} APIs in this category** | [View all →](./${folderName}/)\n\n`;
    
    // Create table header
    content += `| API Name | Description |\n`;
    content += `|----------|-------------|\n`;
    
    // Add each actor as a table row
    for (const actor of categoryActors.sort((a, b) => 
        (a.title || a.name || '').localeCompare(b.title || b.name || '')
    )) {
        const title = actor.title || actor.name || 'Unknown';
        const affiliateUrl = actor.affiliate_url || actor.url || '';
        const description = actor.description || '';
        
        // Truncate descriptions at word boundaries
        const maxDescLength = 200;
        let shortDescription = description;
        if (description.length > maxDescLength) {
            let cutPoint = maxDescLength;
            const lastSpace = description.lastIndexOf(' ', maxDescLength);
            if (lastSpace > maxDescLength * 0.8) {
                cutPoint = lastSpace;
            }
            shortDescription = description.substring(0, cutPoint).trim() + '...';
        }
        
        // Clean up title - remove extra brackets if present
        let cleanTitle = title;
        if (cleanTitle.startsWith('[') && cleanTitle.includes(']')) {
            cleanTitle = cleanTitle.replace(/^\[([^\]]+)\]\s*/, '$1 ');
        }
        
        // Escape pipe characters and newlines for table format
        cleanTitle = cleanTitle.replace(/\|/g, '&#124;').replace(/\n/g, ' ');
        const safeDescription = (shortDescription || '').replace(/\|/g, '&#124;').replace(/\n/g, ' ');
        
        if (safeDescription) {
            content += `| [${cleanTitle}](${affiliateUrl}) | ${safeDescription} |\n`;
        } else {
            content += `| [${cleanTitle}](${affiliateUrl}) | - |\n`;
        }
    }
    
    content += `\n`;
}

// Write uncategorized actors
if (uncategorized.length > 0) {
    content += `<a id="uncategorized"></a>\n\n`;
    content += `## Uncategorized\n\n`;
    content += `<p align="right"><a href="#-table-of-contents">↑ Back to top</a></p>\n\n`;
    content += `**${uncategorized.length.toLocaleString()} APIs in this category**\n\n`;
    
    const sortedUncategorized = uncategorized.sort((a, b) => 
        (a.title || a.name || '').localeCompare(b.title || b.name || '')
    );
    
    // Create table header
    content += `| API Name | Description |\n`;
    content += `|----------|-------------|\n`;
    
    for (const actor of sortedUncategorized) {
        const title = actor.title || actor.name || 'Unknown';
        const affiliateUrl = actor.affiliate_url || actor.url || '';
        const description = actor.description || '';
        
        const maxDescLength = 200;
        let shortDescription = description;
        if (description.length > maxDescLength) {
            let cutPoint = maxDescLength;
            const lastSpace = description.lastIndexOf(' ', maxDescLength);
            if (lastSpace > maxDescLength * 0.8) {
                cutPoint = lastSpace;
            }
            shortDescription = description.substring(0, cutPoint).trim() + '...';
        }
        
        let cleanTitle = title;
        if (cleanTitle.startsWith('[') && cleanTitle.includes(']')) {
            cleanTitle = cleanTitle.replace(/^\[([^\]]+)\]\s*/, '$1 ');
        }
        
        // Escape pipe characters and newlines for table format
        cleanTitle = cleanTitle.replace(/\|/g, '&#124;').replace(/\n/g, ' ');
        const safeDescription = (shortDescription || '').replace(/\|/g, '&#124;').replace(/\n/g, ' ');
        
        if (safeDescription) {
            content += `| [${cleanTitle}](${affiliateUrl}) | ${safeDescription} |\n`;
        } else {
            content += `| [${cleanTitle}](${affiliateUrl}) | - |\n`;
        }
    }
    content += `\n`;
}

content += `---\n\n`;

// Usage section
content += `## 🚀 How to Use\n\n`;
content += `1. **Browse by Category** - Use the table of contents above to jump to any category\n`;
content += `2. **Click Any API** - All links include affiliate tracking and take you to the Apify platform\n`;
content += `3. **View Documentation** - Each API page has full documentation, examples, and pricing\n`;
content += `4. **Run via API** - All actors can be run programmatically via Apify's API\n`;
content += `5. **Schedule Runs** - Set up automated schedules for regular data collection\n\n`;

content += `---\n\n`;

// Notes section
content += `## 📝 Notes\n\n`;
content += `- ✅ All APIs are sorted alphabetically within their categories\n`;
content += `- ✅ Descriptions are optimized for readability (truncated to ~150 characters)\n`;
content += `- ✅ For full descriptions and details, visit the individual API pages\n`;
content += `- ✅ This list is automatically generated from the Apify Store API\n`;
content += `- ✅ All links include affiliate tracking (\`?fpr=p2hrc6\`)\n\n`;

content += `---\n\n`;

// Footer
content += `<div align="center">\n\n`;
content += `**Total APIs: ${totalActors.toLocaleString()}** | `;
content += `**Categories: ${sortedCategories.length}** | `;
content += `**Last Updated: ${new Date().toISOString().split('T')[0]}**\n\n`;
content += `*One of the most valuable API lists on GitHub—period.* 💪\n\n`;
content += `</div>\n`;

// Write to README.md (in parent directory)
const readmePath = path.join(__dirname, '..', 'README.md');
fs.writeFileSync(readmePath, content, 'utf-8');
console.log(`✅ Clean README.md generated successfully!`);
console.log(`   - ${sortedCategories.length} categories`);
console.log(`   - ${(actors.length - filteredCount).toLocaleString()} total APIs (${filteredCount} filtered out)`);
console.log(`   - ${uncategorized.length.toLocaleString()} uncategorized APIs`);

