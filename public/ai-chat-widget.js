// AI Chat Widget - Floating chat button with third-party AI integration
(function() {
    // Create chat widget HTML
    const widgetHTML = `
        <div id="aiChatWidget" class="ai-chat-widget">
            <!-- Chat Button -->
            <button id="aiChatToggle" class="ai-chat-toggle" title="AI Assistant">
                <i class="fas fa-robot"></i>
                <span class="chat-badge">AI</span>
            </button>

            <!-- Chat Window -->
            <div id="aiChatWindow" class="ai-chat-window" style="display: none;">
                <div class="ai-chat-header">
                    <div class="ai-chat-title">
                        <i class="fas fa-robot me-2"></i>
                        <span>AI Assistant</span>
                    </div>
                    <div class="ai-chat-actions">
                        <button class="ai-chat-minimize" title="Minimize">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="ai-chat-close" title="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div class="ai-chat-messages" id="aiChatMessages">
                    <div class="ai-message ai-message-bot">
                        <div class="ai-message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="ai-message-content">
                            <p>Hello! I'm your AI assistant powered by Google Gemini.</p>
                            <p>I can help you with:</p>
                            <ul>
                                <li>Government services information</li>
                                <li>Stock market queries</li>
                                <li>Commodity prices</li>
                                <li>General questions</li>
                            </ul>
                            <p>How can I help you today?</p>
                        </div>
                    </div>
                </div>

                <div class="ai-chat-input-container">
                    <textarea 
                        id="aiChatInput" 
                        class="ai-chat-input" 
                        placeholder="Type your message..."
                        rows="1"
                    ></textarea>
                    <button id="aiChatSend" class="ai-chat-send" title="Send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>

                <div class="ai-chat-footer">
                    <small>Powered by AI • <a href="#" id="clearChat">Clear chat</a></small>
                </div>
            </div>
        </div>
    `;

    // Inject styles
    const styles = `
        <style>
            .ai-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .ai-chat-toggle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .ai-chat-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
            }

            .chat-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ef4444;
                color: white;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 10px;
                font-weight: 600;
            }

            .ai-chat-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 600px;
                max-height: calc(100vh - 120px);
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                animation: slideUp 0.3s ease;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            [data-theme="dark"] .ai-chat-window {
                background: #1a1a1a;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .ai-chat-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
            }

            .ai-chat-title {
                font-weight: 600;
                font-size: 16px;
                display: flex;
                align-items: center;
            }

            .ai-chat-actions {
                display: flex;
                gap: 8px;
            }

            .ai-chat-minimize,
            .ai-chat-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .ai-chat-minimize:hover,
            .ai-chat-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .ai-chat-messages {
                flex: 1 1 auto;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 16px;
                background: #f8f9fa;
                max-height: 100%;
                min-height: 0;
                scroll-behavior: smooth;
            }

            .ai-chat-messages::-webkit-scrollbar {
                width: 6px;
            }

            .ai-chat-messages::-webkit-scrollbar-track {
                background: transparent;
            }

            .ai-chat-messages::-webkit-scrollbar-thumb {
                background: rgba(102, 126, 234, 0.3);
                border-radius: 3px;
            }

            .ai-chat-messages::-webkit-scrollbar-thumb:hover {
                background: rgba(102, 126, 234, 0.5);
            }

            [data-theme="dark"] .ai-chat-messages {
                background: #0f0f0f;
            }

            [data-theme="dark"] .ai-chat-messages::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
            }

            [data-theme="dark"] .ai-chat-messages::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .ai-message {
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .ai-message-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .ai-message-bot .ai-message-avatar {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .ai-message-user .ai-message-avatar {
                background: #10b981;
                color: white;
            }

            .ai-message-content {
                flex: 1;
                background: white;
                padding: 12px;
                border-radius: 12px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                word-wrap: break-word;
                overflow-wrap: break-word;
                max-width: 100%;
            }

            [data-theme="dark"] .ai-message-content {
                background: #2a2a2a;
                color: #e0e0e0;
            }

            .ai-message-content p {
                margin: 0 0 8px 0;
                line-height: 1.5;
                white-space: pre-wrap;
            }

            .ai-message-content p:last-child {
                margin-bottom: 0;
            }

            .ai-message-content ul {
                margin: 8px 0;
                padding-left: 20px;
            }

            .ai-message-content li {
                margin: 4px 0;
            }

            .ai-chat-input-container {
                display: flex;
                gap: 8px;
                padding: 16px;
                background: white;
                border-top: 1px solid #e5e7eb;
                flex-shrink: 0;
            }

            [data-theme="dark"] .ai-chat-input-container {
                background: #1a1a1a;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .ai-chat-input {
                flex: 1;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 10px 12px;
                font-size: 14px;
                resize: none;
                max-height: 100px;
                font-family: inherit;
            }

            [data-theme="dark"] .ai-chat-input {
                background: #2a2a2a;
                border-color: rgba(255, 255, 255, 0.1);
                color: #e0e0e0;
            }

            .ai-chat-input:focus {
                outline: none;
                border-color: #667eea;
            }

            .ai-chat-send {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .ai-chat-send:hover {
                transform: scale(1.05);
            }

            .ai-chat-send:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .ai-chat-footer {
                padding: 8px 16px;
                text-align: center;
                background: #f8f9fa;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
                flex-shrink: 0;
            }

            [data-theme="dark"] .ai-chat-footer {
                background: #0f0f0f;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                color: #9ca3af;
            }

            .ai-chat-footer a {
                color: #667eea;
                text-decoration: none;
            }

            .ai-chat-footer a:hover {
                text-decoration: underline;
            }

            .ai-typing-indicator {
                display: flex;
                gap: 4px;
                padding: 8px 0;
            }

            .ai-typing-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #667eea;
                animation: typing 1.4s infinite;
            }

            .ai-typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .ai-typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-10px);
                }
            }

            @media (max-width: 480px) {
                .ai-chat-window {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 100px);
                    bottom: 80px;
                    right: 20px;
                }
            }
        </style>
    `;

    // Inject widget into page
    document.addEventListener('DOMContentLoaded', function() {
        // Add styles
        document.head.insertAdjacentHTML('beforeend', styles);
        
        // Add widget
        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        // Get elements
        const toggle = document.getElementById('aiChatToggle');
        const window = document.getElementById('aiChatWindow');
        const minimize = document.querySelector('.ai-chat-minimize');
        const close = document.querySelector('.ai-chat-close');
        const input = document.getElementById('aiChatInput');
        const send = document.getElementById('aiChatSend');
        const messages = document.getElementById('aiChatMessages');
        const clearBtn = document.getElementById('clearChat');

        // Toggle chat window
        toggle.addEventListener('click', () => {
            const isVisible = window.style.display !== 'none';
            window.style.display = isVisible ? 'none' : 'block';
        });

        // Minimize/Close
        minimize.addEventListener('click', () => {
            window.style.display = 'none';
        });

        close.addEventListener('click', () => {
            window.style.display = 'none';
        });

        // Send message
        async function sendMessage() {
            const message = input.value.trim();
            if (!message) return;

            // Add user message
            addMessage(message, 'user');
            input.value = '';
            input.style.height = 'auto';

            // Show typing indicator
            const typingId = showTyping();

            // Gather page context
            let context;
            try {
                // Check for hotfix first - use globalThis to access true global scope
                const globalWindow = (typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : {}));
                console.log('🔍 Checking for hotfix... globalWindow.gatherPageContextFixed =', typeof globalWindow.gatherPageContextFixed);
                
                if (typeof globalWindow.gatherPageContextFixed === 'function') {
                    context = globalWindow.gatherPageContextFixed();
                    console.log('✅ Using hotfix for context');
                } else {
                    console.log('⚠️ Hotfix not found, using fallback');
                    context = gatherPageContext();
                    console.log('📊 Context gathered:', context);
                }
                
                // Show context summary in console
                if (context.visibleStocks && context.visibleStocks.length > 0) {
                    console.log(`📈 Found ${context.visibleStocks.length} stocks on screen`);
                }
                if (context.visibleCommodities && context.visibleCommodities.length > 0) {
                    console.log(`🌾 Found ${context.visibleCommodities.length} commodities on screen`);
                }
                if (context.visibleServices && context.visibleServices.length > 0) {
                    console.log(`📋 Found ${context.visibleServices.length} services on screen`);
                }
            } catch (error) {
                console.error('Context gathering failed:', error);
                context = { page: 'unknown', pageName: 'Unknown' };
            }

            // Send to AI API
            try {
                console.log('Sending to AI API...');
                const response = await fetch('/api/ai/ai-query', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        message,
                        context 
                    })
                });

                console.log('Response received:', response.status);
                const data = await response.json();
                
                // Remove typing indicator
                removeTyping(typingId);

                // Add bot response
                if (response.ok) {
                    addMessage(data.response, 'bot');
                } else {
                    console.error('API error:', data);
                    addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                removeTyping(typingId);
                addMessage('Sorry, I\'m having trouble connecting. Please check your internet connection.', 'bot');
            }
        }

        send.addEventListener('click', sendMessage);
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-resize textarea
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });

        // Clear chat
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Clear all messages?')) {
                messages.innerHTML = `
                    <div class="ai-message ai-message-bot">
                        <div class="ai-message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="ai-message-content">
                            <p>Chat cleared. How can I help you?</p>
                        </div>
                    </div>
                `;
            }
        });

        // Gather page context for AI
        function gatherPageContext() {
            // Use hotfix if available (bypasses cache issues)
            if (typeof window !== 'undefined' && window.gatherPageContextFixed) {
                return window.gatherPageContextFixed();
            }
            
            try {
                // Check if window is available
                if (typeof window === 'undefined') {
                    return { page: 'unknown', pageName: 'Unknown' };
                }
                
                const context = {
                    page: window.location.pathname,
                    pageTitle: document.title,
                    url: window.location.href
                };

                // Detect which page we're on
                const path = window.location.pathname;
                
                if (path.includes('index') || path === '/') {
                    context.pageName = 'Home';
                    context.description = 'Digital India Portal homepage with overview of services';
                } else if (path.includes('services')) {
                    context.pageName = 'Services';
                    context.description = 'Government services directory';
                    
                    // Get visible services
                    const serviceCards = document.querySelectorAll('.service-card');
                    if (serviceCards.length > 0) {
                        const services = [];
                        serviceCards.forEach((card, idx) => {
                            if (idx < 15) { // Limit to first 15
                                const title = card.querySelector('.service-title, h3');
                                const description = card.querySelector('.service-description, p');
                                if (title) {
                                    const serviceInfo = {
                                        name: title.textContent.trim()
                                    };
                                    if (description) {
                                        serviceInfo.description = description.textContent.trim().substring(0, 100);
                                    }
                                    services.push(serviceInfo);
                                }
                            }
                        });
                        if (services.length > 0) {
                            context.visibleServices = services;
                        }
                    }
                } else if (path.includes('stocks')) {
                    context.pageName = 'Stocks';
                    context.description = 'NSE stock market data and charts';
                    
                    // Get visible stocks
                    const stockCards = document.querySelectorAll('.stock-card');
                    if (stockCards.length > 0) {
                        const stocks = [];
                        stockCards.forEach((card, idx) => {
                            if (idx < 20) { // Limit to first 20
                                const symbol = card.querySelector('.stock-symbol');
                                const name = card.querySelector('.stock-name');
                                const price = card.querySelector('.stock-price');
                                if (symbol) {
                                    const stockInfo = { 
                                        symbol: symbol.textContent.trim()
                                    };
                                    if (name) stockInfo.name = name.textContent.trim();
                                    if (price) stockInfo.price = price.textContent.trim();
                                    stocks.push(stockInfo);
                                }
                            }
                        });
                        if (stocks.length > 0) {
                            context.visibleStocks = stocks;
                        }
                    }
                    
                    // Get selected stock from chart title
                    const chartTitle = document.querySelector('#stockChartTitle');
                    if (chartTitle && chartTitle.textContent) {
                        context.selectedStock = chartTitle.textContent.trim();
                    }
                } else if (path.includes('market')) {
                    context.pageName = 'Market';
                    context.description = 'Commodity market prices across India';
                    
                    // Get visible commodities
                    const commodityCards = document.querySelectorAll('.market-card');
                    if (commodityCards.length > 0) {
                        const commodities = [];
                        commodityCards.forEach((card, idx) => {
                            if (idx < 20) { // Limit to first 20
                                const nameEl = card.querySelector('.commodity-info h3');
                                const locationEl = card.querySelector('.commodity-location');
                                const priceEl = card.querySelector('.price-value');
                                if (nameEl) {
                                    const commodityInfo = { 
                                        name: nameEl.textContent.trim()
                                    };
                                    if (locationEl) {
                                        const location = locationEl.textContent.trim();
                                        // Extract state from "Market, District, State" format
                                        const parts = location.split(',');
                                        if (parts.length >= 3) {
                                            commodityInfo.state = parts[2].trim();
                                            commodityInfo.market = parts[0].trim();
                                        }
                                    }
                                    if (priceEl) commodityInfo.price = priceEl.textContent.trim();
                                    commodities.push(commodityInfo);
                                }
                            }
                        });
                        if (commodities.length > 0) {
                            context.visibleCommodities = commodities;
                        }
                    }
                    
                    // Get search/filter state
                    const searchInput = document.querySelector('#searchInput, input[type="search"]');
                    if (searchInput && searchInput.value) {
                        context.searchQuery = searchInput.value;
                    }
                    
                    // Get active filters
                    const categoryFilter = document.querySelector('#categoryFilter');
                    const stateFilter = document.querySelector('#stateFilter');
                    if (categoryFilter && categoryFilter.value !== 'all') {
                        context.categoryFilter = categoryFilter.value;
                    }
                    if (stateFilter && stateFilter.value !== 'all') {
                        context.stateFilter = stateFilter.value;
                    }
                } else if (path.includes('chat')) {
                    context.pageName = 'Chat';
                    context.description = 'Community chat and discussions';
                } else if (path.includes('admin')) {
                    context.pageName = 'Admin Panel';
                    context.description = 'Administrative dashboard for managing services';
                }

                return context;
            } catch (error) {
                console.error('Error gathering context:', error);
                // Return minimal context on error
                return {
                    page: window.location.pathname,
                    pageTitle: document.title,
                    pageName: 'Unknown',
                    description: 'Digital India Portal'
                };
            }
        }

        // Helper functions
        function addMessage(text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `ai-message ai-message-${type}`;
            
            const avatar = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
            
            // Format text - preserve line breaks and structure
            const formattedText = text
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map(line => `<p>${line}</p>`)
                .join('');
            
            messageDiv.innerHTML = `
                <div class="ai-message-avatar">${avatar}</div>
                <div class="ai-message-content">
                    ${formattedText || '<p>' + text + '</p>'}
                </div>
            `;
            
            messages.appendChild(messageDiv);
            
            // Smooth scroll to bottom with delay to ensure content is rendered
            requestAnimationFrame(() => {
                messages.scrollTo({
                    top: messages.scrollHeight,
                    behavior: 'smooth'
                });
            });
        }

        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'ai-message ai-message-bot';
            typingDiv.id = 'typing-indicator';
            
            typingDiv.innerHTML = `
                <div class="ai-message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="ai-message-content">
                    <div class="ai-typing-indicator">
                        <div class="ai-typing-dot"></div>
                        <div class="ai-typing-dot"></div>
                        <div class="ai-typing-dot"></div>
                    </div>
                </div>
            `;
            
            messages.appendChild(typingDiv);
            messages.scrollTop = messages.scrollHeight;
            
            return 'typing-indicator';
        }

        function removeTyping(id) {
            const typing = document.getElementById(id);
            if (typing) typing.remove();
        }
    });
})();
