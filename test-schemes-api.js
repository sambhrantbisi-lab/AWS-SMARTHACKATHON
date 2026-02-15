const axios = require('axios');

/**
 * Test script to search for government schemes datasets on Data.gov.in
 */

const API_KEY = '579b464db66ec23bdd00000119204304bc5840c46e6c182d7e2fc8ee';

async function searchDatasets(query) {
    try {
        // Search for datasets using CKAN API
        const searchUrl = `https://data.gov.in/api/3/action/package_search?q=${encodeURIComponent(query)}`;
        
        console.log(`\n🔍 Searching for: "${query}"`);
        console.log(`URL: ${searchUrl}\n`);
        
        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        
        if (response.data && response.data.result) {
            const results = response.data.result.results;
            console.log(`✅ Found ${results.length} datasets\n`);
            
            results.slice(0, 5).forEach((dataset, index) => {
                console.log(`${index + 1}. ${dataset.title}`);
                console.log(`   ID: ${dataset.id}`);
                console.log(`   Organization: ${dataset.organization?.title || 'N/A'}`);
                console.log(`   Resources: ${dataset.num_resources}`);
                
                if (dataset.resources && dataset.resources.length > 0) {
                    dataset.resources.forEach((resource, rIndex) => {
                        console.log(`   Resource ${rIndex + 1}: ${resource.name || resource.description}`);
                        console.log(`      Format: ${resource.format}`);
                        if (resource.format === 'API') {
                            console.log(`      API URL: ${resource.url}`);
                        }
                    });
                }
                console.log('');
            });
            
            return results;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

async function main() {
    console.log('='.repeat(80));
    console.log('DATA.GOV.IN - GOVERNMENT SCHEMES DATASET SEARCH');
    console.log('='.repeat(80));
    
    // Search for different scheme-related keywords
    const queries = [
        'schemes',
        'government schemes',
        'welfare schemes',
        'social schemes',
        'pradhan mantri',
        'yojana'
    ];
    
    for (const query of queries) {
        await searchDatasets(query);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between requests
    }
}

main();
