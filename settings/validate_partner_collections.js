/**
 * Validate sponsored partner collection counts, deep links, and main README placement.
 *
 * Usage:
 *   node settings/validate_partner_collections.js
 *   node settings/validate_partner_collections.js --check-links
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const mainReadme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const featuredLanding = fs.readFileSync(path.join(root, '00-featured-apis', 'README.md'), 'utf8');
const apyhubReadme = fs.readFileSync(path.join(root, '00-featured-apis', 'apyhub-utility-apis', 'README.md'), 'utf8');
const coreclawReadme = null; // CoreClaw partnership removed 2026-10-11
const readmeGenerator = fs.readFileSync(path.join(__dirname, 'generate_readme_clean.js'), 'utf8');

const errors = [];

function check(condition, message) {
    if (!condition) errors.push(message);
}

function unique(values) {
    return new Set(values).size === values.length;
}

const apyhubUrls = [...apyhubReadme.matchAll(/^\| \[[^\]]+\]\((https:\/\/apyhub\.com\/[^)]+)\)/gm)]
    .map(match => match[1]);
const uniqueApyhubUrls = [...new Set(apyhubUrls)];
// ApyHub returned 2026-11-27 (draft): featured collection only, NO banner,
// below Blotato and below APIMesa. Every ApyHub link must carry ?fpr=chris-2f0318.
const allApyhubUrls = [...mainReadme.matchAll(/https:\/\/apyhub\.com[^\s)"']*/g)]
    .map(m => m[0])
    .concat([...featuredLanding.matchAll(/https:\/\/apyhub\.com[^\s)"']*/g)].map(m => m[0]))
    .concat([...apyhubReadme.matchAll(/https:\/\/apyhub\.com[^\s)"']*/g)].map(m => m[0]));
const untrackedApyhub = allApyhubUrls.filter(u => !u.includes('fpr=chris-2f0318'));

check(uniqueApyhubUrls.length === 200, `Expected 200 unique ApyHub API links, found ${uniqueApyhubUrls.length}`);
check(untrackedApyhub.length === 0, `Found untracked ApyHub links (missing ?fpr=chris-2f0318): ${untrackedApyhub.slice(0, 5).join(', ')}`);
check(mainReadme.includes('#### [ApyHub Utility API Collection]'), 'Main README is missing the ApyHub featured entry');
check(mainReadme.indexOf('### Sponsored: Blotato') < mainReadme.indexOf('#### [ApyHub Utility API Collection]'), 'ApyHub featured entry is not below Blotato in the main README');
check(!mainReadme.includes('### Sponsored: ApyHub'), 'Main README has an ApyHub sponsored-slot banner block (not allowed)');
check(!mainReadme.toLowerCase().includes('apyhub-banner'), 'Main README references an ApyHub banner (not allowed)');
check(featuredLanding.includes('href="./apyhub-utility-apis/"'), 'Featured APIs page is missing the ApyHub collection');
check(featuredLanding.indexOf('apimesa-marketplace-apis') < featuredLanding.indexOf('apyhub-utility-apis'), 'ApyHub collection is not below APIMesa on the Featured APIs page');
check(!featuredLanding.toLowerCase().includes('apyhub-banner'), 'Featured APIs page references an ApyHub banner (not allowed)');
check(!apyhubReadme.toLowerCase().includes('apyhub-banner'), 'ApyHub collection page references a banner image (not allowed)');
check(!fs.existsSync(path.join(root, '00-featured-apis', 'coreclaw-scraper-apis')), 'CoreClaw collection directory still exists');
check(!mainReadme.toLowerCase().includes('coreclaw'), 'Main README still references CoreClaw');
check(!mainReadme.includes('fpr=chris69'), 'Main README still contains CoreClaw affiliate tracking');
check(!featuredLanding.toLowerCase().includes('coreclaw'), 'Featured APIs page still references CoreClaw');
check(!mainReadme.includes('All links include affiliate tracking'), 'Main README contains the removed affiliate-tracking note');
check(readmeGenerator.includes("name: 'ApyHub Utility API Collection'"), 'README generator is missing the ApyHub partner collection');
check(readmeGenerator.includes('### Sponsored: KamdenAI'), 'README generator is missing the KamdenAI sponsor block');
check(!readmeGenerator.includes('buymeacoffee.com'), 'README generator would restore the retired coffee-support block');

async function validateUrl(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'follow',
            signal: controller.signal,
            headers: { 'user-agent': 'API-Mega-List-Link-Validator/1.0' }
        });
        return { url, status: response.status, ok: response.ok };
    } catch (error) {
        return { url, status: 0, ok: false, error: error.message };
    } finally {
        clearTimeout(timeout);
    }
}

async function validateInBatches(urls, concurrency = 8) {
    const results = [];
    let nextIndex = 0;

    async function worker() {
        while (nextIndex < urls.length) {
            const index = nextIndex++;
            results[index] = await validateUrl(urls[index]);
        }
    }

    await Promise.all(Array.from({ length: concurrency }, () => worker()));
    return results;
}

async function main() {
    if (errors.length > 0) {
        console.error('\nPartner collection validation failed:');
        for (const error of errors) console.error(`- ${error}`);
        process.exitCode = 1;
        return;
    }

    console.log(`ApyHub API links: ${uniqueApyhubUrls.length} unique (${apyhubUrls.length} category placements)`);
    console.log('Partner collection validation passed.');
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
