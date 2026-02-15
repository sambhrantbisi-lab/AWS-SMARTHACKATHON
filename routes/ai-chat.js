const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Simple rate limit tracking (in-memory, resets on server restart)
const rateLimitTracker = {
    requests: [],
    addRequest: function() {
        const now = Date.now();
        this.requests.push(now);
        // Keep only requests from last minute
        this.requests = this.requests.filter(time => now - time < 60000);
    },
    getRequestsLastMinute: function() {
        const now = Date.now();
        return this.requests.filter(time => now - time < 60000).length;
    },
    getRequestsToday: function() {
        const now = Date.now();
        const startOfDay = new Date().setHours(0, 0, 0, 0);
        return this.requests.filter(time => time >= startOfDay).length;
    }
};

// AI Chat endpoint - integrates with Google Gemini (free tier)
router.post('/ai-query', async (req, res) => {
    try {
        const { message, context, enableWebSearch } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Track request for rate limiting
        rateLimitTracker.addRequest();
        const requestsLastMinute = rateLimitTracker.getRequestsLastMinute();
        const requestsToday = rateLimitTracker.getRequestsToday();
        
        console.log(`📊 Rate Limit Tracker: ${requestsLastMinute} req/min, ${requestsToday} req/day`);
        
        // Warn if approaching limits (Gemini: 15 RPM, 20 RPD after Dec 2025)
        if (requestsLastMinute >= 12) {
            console.warn(`⚠️ Approaching RPM limit: ${requestsLastMinute}/15`);
        }
        if (requestsToday >= 15) {
            console.warn(`⚠️ Approaching daily limit: ${requestsToday}/20 - Groq fallback will activate soon`);
        }
        if (requestsToday >= 20) {
            console.warn(`🔄 Gemini limit reached (20/20) - Using Groq fallback (70,000+ RPD available)`);
        }

        // Web search enhancement (if enabled)
        let webSearchResults = null;
        if (enableWebSearch !== false) { // Default to true
            console.log('🔍 Web search ENABLED - Performing search...');
            webSearchResults = await performWebSearch(message, context);
            if (webSearchResults) {
                console.log(`✅ Found ${webSearchResults.length} web search results:`, webSearchResults);
            } else {
                console.log('⚠️ Web search returned no results');
            }
        } else {
            console.log('❌ Web search DISABLED');
        }

        // Debug: Log received context
        console.log('📊 Received context:', JSON.stringify(context, null, 2));
        if (context && context.visibleStocks) {
            console.log(`📈 Stocks in context: ${context.visibleStocks.length}`);
            if (context.visibleStocks.length > 0) {
                const firstStock = context.visibleStocks[0];
                console.log('📈 First stock data:', firstStock);
                console.log('📈 Has volume?', !!firstStock.volume);
            }
        }

        let response = null;

        // Try Google Gemini first (free tier - 15 RPM, 20 RPD after Dec 2025 cuts)
        response = await queryGemini(message, context, webSearchResults);

        // If Gemini fails or rate limited, try Groq (free tier - 30 RPM, 70,000+ RPD)
        if (!response) {
            console.log('🔄 Gemini unavailable, switching to Groq fallback...');
            response = await queryGroq(message, context, webSearchResults);
            
            if (response) {
                console.log('✅ Groq fallback successful!');
            }
        }

        // If no AI service worked, return error
        if (!response) {
            return res.status(503).json({ 
                error: 'AI service unavailable',
                response: 'I apologize, but the AI service is temporarily unavailable. Please try again in a moment.'
            });
        }

        res.json({ response });
    } catch (error) {
        console.error('AI Chat error:', error);
        res.status(500).json({ 
            error: 'Failed to get AI response',
            response: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.'
        });
    }
});

// Web Search Function - supports multiple providers
async function performWebSearch(query, context) {
    try {
        // Build search query based on context
        let searchQuery = query;
        
        // If we have place context, make the search more specific
        if (context && context.place) {
            searchQuery = `${context.place.name} ${context.place.address} ${query}`;
        }
        
        console.log(`🔍 Searching for: "${searchQuery}"`);
        
        // Try Google Custom Search API first (if configured)
        if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID) {
            console.log('🔍 Using Google Custom Search API...');
            const googleResults = await performGoogleSearch(searchQuery);
            if (googleResults && googleResults.length > 0) {
                console.log(`✅ Google Search found ${googleResults.length} results`);
                return googleResults;
            }
        }
        
        // Fallback to Groq for web search (more reliable, higher limits)
        console.log('🔍 Using Groq for web search (fallback)...');
        const groqResults = await performGroqWebSearch(searchQuery);
        if (groqResults && groqResults.length > 0) {
            console.log(`✅ Groq search found ${groqResults.length} results`);
            return groqResults;
        }
        
        // Fallback to DuckDuckGo (limited results)
        console.log('🔍 Using DuckDuckGo API (final fallback)...');
        const ddgResponse = await fetch(
            `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; DigitalIndiaBot/1.0)'
                }
            }
        );
        
        if (!ddgResponse.ok) {
            console.error('DuckDuckGo API error:', ddgResponse.status);
            return null;
        }
        
        const ddgData = await ddgResponse.json();
        const results = [];
        
        // Extract abstract/summary
        if (ddgData.Abstract) {
            results.push({
                title: ddgData.Heading || 'Summary',
                snippet: ddgData.Abstract,
                url: ddgData.AbstractURL || '',
                source: ddgData.AbstractSource || 'DuckDuckGo'
            });
        }
        
        // Extract related topics
        if (ddgData.RelatedTopics && ddgData.RelatedTopics.length > 0) {
            ddgData.RelatedTopics.slice(0, 5).forEach(topic => {
                if (topic.Text && topic.FirstURL) {
                    results.push({
                        title: topic.Text.split(' - ')[0] || 'Related',
                        snippet: topic.Text,
                        url: topic.FirstURL,
                        source: 'DuckDuckGo'
                    });
                }
            });
        }
        
        if (results.length === 0) {
            console.log('⚠️ No web search results found from any provider');
            return null;
        }
        
        console.log(`✅ Web search found ${results.length} results`);
        return results;
        
    } catch (error) {
        console.error('Web search error:', error.message);
        return null;
    }
}

// Google Custom Search API (more reliable for business queries)
async function performGoogleSearch(query) {
    try {
        const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
        const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
        
        const response = await fetch(
            `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${engineId}&q=${encodeURIComponent(query)}&num=5`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; DigitalIndiaBot/1.0)'
                }
            }
        );
        
        if (!response.ok) {
            console.error('Google Search API error:', response.status);
            return null;
        }
        
        const data = await response.json();
        const results = [];
        
        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                results.push({
                    title: item.title,
                    snippet: item.snippet,
                    url: item.link,
                    source: 'Google'
                });
            });
        }
        
        return results.length > 0 ? results : null;
        
    } catch (error) {
        console.error('Google Search error:', error.message);
        return null;
    }
}

// Groq Web Search (more reliable than Google Custom Search, higher rate limits)
async function performGroqWebSearch(query) {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        
        if (!apiKey || apiKey === 'your_groq_api_key_here') {
            console.log('⚠️ Groq API key not configured, skipping Groq search');
            return null;
        }
        
        console.log('🔍 Calling Groq for web search...');
        
        const response = await fetch(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a web search assistant. Search for and provide current information about the query. Return results in a structured format with title, snippet, and source.'
                        },
                        {
                            role: 'user',
                            content: `Search for: ${query}. Provide 3-5 key results with titles, snippets, and sources.`
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 500,
                })
            }
        );
        
        if (!response.ok) {
            console.error('Groq API error:', response.status);
            return null;
        }
        
        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const content = data.choices[0].message.content;
            
            // Parse Groq response into structured results
            const results = [];
            
            // Simple parsing - look for numbered items
            const lines = content.split('\n');
            let currentResult = null;
            
            lines.forEach(line => {
                if (line.match(/^\d+\./)) {
                    if (currentResult) results.push(currentResult);
                    currentResult = {
                        title: line.replace(/^\d+\.\s*/, '').trim(),
                        snippet: '',
                        source: 'Groq Search',
                        url: ''
                    };
                } else if (currentResult && line.trim()) {
                    currentResult.snippet += ' ' + line.trim();
                }
            });
            
            if (currentResult) results.push(currentResult);
            
            return results.length > 0 ? results : null;
        }
        
        return null;
        
    } catch (error) {
        console.error('Groq search error:', error.message);
        return null;
    }
}

// Google Gemini Integration (Free tier)
async function queryGemini(message, context, webSearchResults) {
    try {
        console.log('Querying Google Gemini...');
        
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            console.error('Gemini API key not configured');
            return null;
        }

        // Build context-aware system prompt
        let systemPrompt = `You are a helpful AI assistant for the Digital India Portal. You help users with:
- Indian government services (Aadhaar, PAN, Passport, etc.)
- Stock market information (NSE stocks, real-time prices)
- Commodity market data (agricultural products, state-wise pricing)
- Location-based services and recommendations
- General queries about India

Be concise, helpful, and specific. Use the page context to provide relevant answers.`;

        // Add web search results if available
        if (webSearchResults && webSearchResults.length > 0) {
            systemPrompt += `\n\n🌐 WEB SEARCH RESULTS (Current Information from Internet):`;
            webSearchResults.forEach((result, idx) => {
                systemPrompt += `\n\n${idx + 1}. ${result.title}`;
                if (result.snippet) systemPrompt += `\n   ${result.snippet}`;
                if (result.url) systemPrompt += `\n   Source: ${result.url}`;
            });
            systemPrompt += `\n\nIMPORTANT: Use the web search results above to provide current, accurate information. Cite sources when relevant.`;
        }

        // Add page-specific context
        if (context) {
            systemPrompt += `\n\nCurrent Page Context:`;
            systemPrompt += `\n- Page: ${context.pageName || 'Unknown'}`;
            systemPrompt += `\n- Description: ${context.description || 'N/A'}`;
            
            // Add place-specific context if available
            if (context.place) {
                systemPrompt += `\n\n📍 PLACE INFORMATION:`;
                systemPrompt += `\n- Name: ${context.place.name}`;
                systemPrompt += `\n- Category: ${context.place.category}`;
                systemPrompt += `\n- Address: ${context.place.address}`;
                systemPrompt += `\n- Distance: ${context.place.distance}`;
                if (context.place.openingHours) systemPrompt += `\n- Hours: ${context.place.openingHours}`;
                if (context.place.phone) systemPrompt += `\n- Phone: ${context.place.phone}`;
                if (context.place.wheelchair) systemPrompt += `\n- Wheelchair: ${context.place.wheelchair}`;
                if (context.place.brand) systemPrompt += `\n- Brand: ${context.place.brand}`;
                if (context.place.website) systemPrompt += `\n- Website: Available`;
            }
            
            if (context.visibleServices && context.visibleServices.length > 0) {
                systemPrompt += `\n\n📋 VISIBLE SERVICES ON SCREEN (${context.visibleServices.length} services with COMPLETE DATA):`;
                context.visibleServices.forEach((service, idx) => {
                    systemPrompt += `\n${idx + 1}. ${service.name}`;
                    if (service.description) systemPrompt += ` - ${service.description}`;
                    if (service.fee) systemPrompt += ` | Fee: ${service.fee}`;
                    if (service.processingTime) systemPrompt += ` | Processing: ${service.processingTime}`;
                    if (service.category) systemPrompt += ` | Category: ${service.category}`;
                });
            }
            
            if (context.visibleStocks && context.visibleStocks.length > 0) {
                systemPrompt += `\n\n📈 VISIBLE STOCKS ON SCREEN (${context.visibleStocks.length} stocks with COMPLETE DATA):`;
                context.visibleStocks.forEach((stock, idx) => {
                    systemPrompt += `\n${idx + 1}. ${stock.symbol}`;
                    if (stock.name) systemPrompt += ` (${stock.name})`;
                    if (stock.exchange) systemPrompt += ` [${stock.exchange}`;
                    if (stock.sector) systemPrompt += ` - ${stock.sector}]`;
                    if (stock.currentPrice || stock.price) systemPrompt += ` - Price: ${stock.currentPrice || stock.price}`;
                    if (stock.change) systemPrompt += ` | Change: ${stock.change}`;
                    if (stock.volume) systemPrompt += ` | Volume: ${stock.volume}`;
                    if (stock.dayHigh) systemPrompt += ` | High: ${stock.dayHigh}`;
                    if (stock.dayLow) systemPrompt += ` | Low: ${stock.dayLow}`;
                    if (stock.marketCap) systemPrompt += ` | Market Cap: ${stock.marketCap}`;
                    if (stock.marketStatus) systemPrompt += ` | Status: ${stock.marketStatus}`;
                });
            }
            
            if (context.selectedStock) {
                systemPrompt += `\n\n🎯 SELECTED STOCK IN CHART: ${context.selectedStock}`;
            }
            
            if (context.visibleCommodities && context.visibleCommodities.length > 0) {
                systemPrompt += `\n\n🌾 VISIBLE COMMODITIES ON SCREEN (${context.visibleCommodities.length} commodities with COMPLETE DATA):`;
                context.visibleCommodities.slice(0, 20).forEach((commodity, idx) => {
                    systemPrompt += `\n${idx + 1}. ${commodity.commodity || commodity.name}`;
                    if (commodity.location) systemPrompt += ` - ${commodity.location}`;
                    if (commodity.wholesalePrice) systemPrompt += ` | Wholesale: ${commodity.wholesalePrice}`;
                    if (commodity.retailPrice) systemPrompt += ` | Retail: ${commodity.retailPrice}`;
                    if (commodity.unit) systemPrompt += ` ${commodity.unit}`;
                    if (commodity.source) systemPrompt += ` | Source: ${commodity.source}`;
                });
            }
            
            if (context.searchQuery) {
                systemPrompt += `\n\n🔍 USER IS SEARCHING FOR: "${context.searchQuery}"`;
            }
            
            if (context.categoryFilter) {
                systemPrompt += `\n📂 ACTIVE CATEGORY FILTER: ${context.categoryFilter}`;
            }
            
            if (context.stateFilter) {
                systemPrompt += `\n📍 ACTIVE STATE FILTER: ${context.stateFilter}`;
            }
        }

        systemPrompt += `\n\nUser Question: ${message}

CRITICAL INSTRUCTIONS FOR DATA HONESTY:

1. WEB SEARCH PRIORITY (MOST IMPORTANT):
   - If web search results are provided above, CHECK THEM FIRST
   - Web search results contain CURRENT information from the internet
   - Use web search to fill gaps in local OpenStreetMap data
   - Always cite the source: "According to [source], ..."
   - Combine local data (distance, address) with web search data (hours, reviews, accessibility)

2. OPENING HOURS:
   - FIRST: Check web search results for opening hours
   - SECOND: Check if context shows "Opening Hours: [value] ✓ DATA AVAILABLE" → STATE THE HOURS EXACTLY
   - THIRD: Check context.place.openingHours field
   - FOURTH: Check context.place.allTags.opening_hours as backup
   - If found anywhere, provide the hours with source
   - If not found anywhere, say "Opening hours not available. Call to confirm."
   
3. WHEELCHAIR ACCESSIBILITY:
   - FIRST: Check web search results for accessibility information
   - SECOND: Check if wheelchair data shows "yes/no/limited" in context
   - If found, state it clearly with source
   - If not found anywhere, say "Accessibility not specified. Call to confirm."
   
4. MISSING DATA HANDLING:
   - Be completely honest when data is not available ANYWHERE (local + web search)
   - ALWAYS check web search results before saying "not available"
   - ALWAYS check the provided context thoroughly before saying "not available"
   - If you see a field with actual data (not "Not available" or "Unknown"), USE IT
   - If data is truly missing everywhere, suggest calling the phone number
   
5. GENERAL:
   - When the user asks about what's on screen, list the VISIBLE items shown above
   - Reference specific stock symbols, commodity names, or services from the visible list
   - Be specific and use the actual data from the context
   - Provide helpful, actionable advice

Provide a helpful, concise answer (2-3 sentences max) based on the context above:`;

        // Using Flash-Lite for higher rate limits: 15 RPM, 1000 RPD (vs Flash: 10 RPM, 250 RPD)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: systemPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800,
                    }
                })
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log('Gemini response received');
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const text = data.candidates[0].content.parts[0].text;
                return text;
            }
        } else {
            const errorData = await response.json();
            
            // Handle 429 Rate Limit errors specifically
            if (response.status === 429) {
                console.error('🚫 GEMINI RATE LIMIT (429) ERROR - Switching to Groq fallback');
                console.error('Status:', response.status);
                console.error('Error Details:', JSON.stringify(errorData, null, 2));
                
                // Extract the error message from Gemini's response
                if (errorData.error && errorData.error.message) {
                    console.error('Gemini Message:', errorData.error.message);
                }
                
                // Return null to trigger Groq fallback
                return null;
            }
            
            console.error('Gemini API error:', response.status, errorData);
        }
    } catch (error) {
        console.error('Gemini error:', error.message);
        
        // Check if it's a network error
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            console.error('🌐 Network error connecting to Gemini API - will try Groq fallback');
            return null;
        }
        
        // Check if it's a timeout
        if (error.code === 'ETIMEDOUT') {
            console.error('⏱️ Gemini API request timed out - will try Groq fallback');
            return null;
        }
    }
    return null;
}

// Groq Integration (Free tier - 30 RPM, 70,000+ RPD)
async function queryGroq(message, context, webSearchResults) {
    try {
        console.log('Querying Groq...');
        
        const apiKey = process.env.GROQ_API_KEY;
        
        if (!apiKey || apiKey === 'your_groq_api_key_here') {
            console.error('Groq API key not configured');
            return null;
        }

        // Build context-aware system prompt (same as Gemini)
        let systemPrompt = `You are a helpful AI assistant for the Digital India Portal. You help users with:
- Indian government services (Aadhaar, PAN, Passport, etc.)
- Stock market information (NSE stocks, real-time prices)
- Commodity market data (agricultural products, state-wise pricing)
- Location-based services and recommendations
- General queries about India

Be concise, helpful, and specific. Use the page context to provide relevant answers.`;

        // Add web search results if available
        if (webSearchResults && webSearchResults.length > 0) {
            systemPrompt += `\n\n🌐 WEB SEARCH RESULTS (Current Information from Internet):`;
            webSearchResults.forEach((result, idx) => {
                systemPrompt += `\n\n${idx + 1}. ${result.title}`;
                if (result.snippet) systemPrompt += `\n   ${result.snippet}`;
                if (result.url) systemPrompt += `\n   Source: ${result.url}`;
            });
            systemPrompt += `\n\nIMPORTANT: Use the web search results above to provide current, accurate information. Cite sources when relevant.`;
        }

        // Add page-specific context (same as Gemini)
        if (context) {
            systemPrompt += `\n\nCurrent Page Context:`;
            systemPrompt += `\n- Page: ${context.pageName || 'Unknown'}`;
            systemPrompt += `\n- Description: ${context.description || 'N/A'}`;
            
            // Add place-specific context if available
            if (context.place) {
                systemPrompt += `\n\n📍 PLACE INFORMATION:`;
                systemPrompt += `\n- Name: ${context.place.name}`;
                systemPrompt += `\n- Category: ${context.place.category}`;
                systemPrompt += `\n- Address: ${context.place.address}`;
                systemPrompt += `\n- Distance: ${context.place.distance}`;
                if (context.place.openingHours) systemPrompt += `\n- Hours: ${context.place.openingHours}`;
                if (context.place.phone) systemPrompt += `\n- Phone: ${context.place.phone}`;
                if (context.place.wheelchair) systemPrompt += `\n- Wheelchair: ${context.place.wheelchair}`;
                if (context.place.brand) systemPrompt += `\n- Brand: ${context.place.brand}`;
                if (context.place.website) systemPrompt += `\n- Website: Available`;
            }
            
            if (context.visibleServices && context.visibleServices.length > 0) {
                systemPrompt += `\n\n📋 VISIBLE SERVICES ON SCREEN (${context.visibleServices.length} services with COMPLETE DATA):`;
                context.visibleServices.forEach((service, idx) => {
                    systemPrompt += `\n${idx + 1}. ${service.name}`;
                    if (service.description) systemPrompt += ` - ${service.description}`;
                    if (service.fee) systemPrompt += ` | Fee: ${service.fee}`;
                    if (service.processingTime) systemPrompt += ` | Processing: ${service.processingTime}`;
                    if (service.category) systemPrompt += ` | Category: ${service.category}`;
                });
            }
            
            if (context.visibleStocks && context.visibleStocks.length > 0) {
                systemPrompt += `\n\n📈 VISIBLE STOCKS ON SCREEN (${context.visibleStocks.length} stocks with COMPLETE DATA):`;
                context.visibleStocks.forEach((stock, idx) => {
                    systemPrompt += `\n${idx + 1}. ${stock.symbol}`;
                    if (stock.name) systemPrompt += ` (${stock.name})`;
                    if (stock.exchange) systemPrompt += ` [${stock.exchange}`;
                    if (stock.sector) systemPrompt += ` - ${stock.sector}]`;
                    if (stock.currentPrice || stock.price) systemPrompt += ` - Price: ${stock.currentPrice || stock.price}`;
                    if (stock.change) systemPrompt += ` | Change: ${stock.change}`;
                    if (stock.volume) systemPrompt += ` | Volume: ${stock.volume}`;
                    if (stock.dayHigh) systemPrompt += ` | High: ${stock.dayHigh}`;
                    if (stock.dayLow) systemPrompt += ` | Low: ${stock.dayLow}`;
                    if (stock.marketCap) systemPrompt += ` | Market Cap: ${stock.marketCap}`;
                    if (stock.marketStatus) systemPrompt += ` | Status: ${context.marketStatus}`;
                });
            }
            
            if (context.selectedStock) {
                systemPrompt += `\n\n🎯 SELECTED STOCK IN CHART: ${context.selectedStock}`;
            }
            
            if (context.visibleCommodities && context.visibleCommodities.length > 0) {
                systemPrompt += `\n\n🌾 VISIBLE COMMODITIES ON SCREEN (${context.visibleCommodities.length} commodities with COMPLETE DATA):`;
                context.visibleCommodities.slice(0, 20).forEach((commodity, idx) => {
                    systemPrompt += `\n${idx + 1}. ${commodity.commodity || commodity.name}`;
                    if (commodity.location) systemPrompt += ` - ${commodity.location}`;
                    if (commodity.wholesalePrice) systemPrompt += ` | Wholesale: ${commodity.wholesalePrice}`;
                    if (commodity.retailPrice) systemPrompt += ` | Retail: ${commodity.retailPrice}`;
                    if (commodity.unit) systemPrompt += ` ${commodity.unit}`;
                    if (commodity.source) systemPrompt += ` | Source: ${commodity.source}`;
                });
            }
            
            if (context.searchQuery) {
                systemPrompt += `\n\n🔍 USER IS SEARCHING FOR: "${context.searchQuery}"`;
            }
            
            if (context.categoryFilter) {
                systemPrompt += `\n📂 ACTIVE CATEGORY FILTER: ${context.categoryFilter}`;
            }
            
            if (context.stateFilter) {
                systemPrompt += `\n📍 ACTIVE STATE FILTER: ${context.stateFilter}`;
            }
        }

        systemPrompt += `\n\nUser Question: ${message}

CRITICAL INSTRUCTIONS FOR DATA HONESTY:

1. WEB SEARCH PRIORITY (MOST IMPORTANT):
   - If web search results are provided above, CHECK THEM FIRST
   - Web search results contain CURRENT information from the internet
   - Use web search to fill gaps in local OpenStreetMap data
   - Always cite the source: "According to [source], ..."
   - Combine local data (distance, address) with web search data (hours, reviews, accessibility)

2. OPENING HOURS:
   - FIRST: Check web search results for opening hours
   - SECOND: Check if context shows "Opening Hours: [value] ✓ DATA AVAILABLE" → STATE THE HOURS EXACTLY
   - THIRD: Check context.place.openingHours field
   - FOURTH: Check context.place.allTags.opening_hours as backup
   - If found anywhere, provide the hours with source
   - If not found anywhere, say "Opening hours not available. Call to confirm."
   
3. WHEELCHAIR ACCESSIBILITY:
   - FIRST: Check web search results for accessibility information
   - SECOND: Check if wheelchair data shows "yes/no/limited" in context
   - If found, state it clearly with source
   - If not found anywhere, say "Accessibility not specified. Call to confirm."
   
4. MISSING DATA HANDLING:
   - Be completely honest when data is not available ANYWHERE (local + web search)
   - ALWAYS check web search results before saying "not available"
   - ALWAYS check the provided context thoroughly before saying "not available"
   - If you see a field with actual data (not "Not available" or "Unknown"), USE IT
   - If data is truly missing everywhere, suggest calling the phone number
   
5. GENERAL:
   - When the user asks about what's on screen, list the VISIBLE items shown above
   - Reference specific stock symbols, commodity names, or services from the visible list
   - Be specific and use the actual data from the context
   - Provide helpful, actionable advice

Provide a helpful, concise answer (2-3 sentences max) based on the context above:`;

        // Groq uses OpenAI-compatible API
        const response = await fetch(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile', // Fast and capable
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful AI assistant for the Digital India Portal.'
                        },
                        {
                            role: 'user',
                            content: systemPrompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 800,
                })
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log('Groq response received');
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const text = data.choices[0].message.content;
                return text;
            }
        } else {
            const errorData = await response.json();
            
            // Handle 429 Rate Limit errors
            if (response.status === 429) {
                console.error('🚫 GROQ RATE LIMIT (429) ERROR:');
                console.error('Status:', response.status);
                console.error('Error Details:', JSON.stringify(errorData, null, 2));
                
                let errorMessage = 'Rate limit exceeded. Please try again later.';
                if (errorData.error && errorData.error.message) {
                    errorMessage = errorData.error.message;
                    console.error('Groq Message:', errorMessage);
                }
                
                return `⚠️ Rate Limit Reached\n\n${errorMessage}\n\nGroq API Free Tier Limits:\n- 30 requests/minute\n- 70,000+ requests/day\n- Please wait a moment and try again.`;
            }
            
            console.error('Groq API error:', response.status, errorData);
        }
    } catch (error) {
        console.error('Groq error:', error.message);
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            console.error('🌐 Network error connecting to Groq API');
            return 'Unable to connect to Groq API. Please check your internet connection.';
        }
        
        if (error.code === 'ETIMEDOUT') {
            console.error('⏱️ Groq API request timed out');
            return 'The AI service is taking too long to respond. Please try again.';
        }
    }
    return null;
}

module.exports = router;
