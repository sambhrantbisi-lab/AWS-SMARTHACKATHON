// Enhanced Digital India Civic AI Assistant
class CivicAIApp {
    constructor() {
        this.currentUser = null;
        this.services = [];
        this.marketData = [];
        this.stockData = [];
        this.chatSessionId = null;
        this.animationsEnabled = true;
        this.darkMode = false;
        this.marketChart = null;
        this.stockChart = null;
        this.customTabs = [];
        this.init();
    }

    async init() {
        await this.loadServices();
        await this.loadMarketData();
        await this.loadStockData();
        this.setupEventListeners();
        this.checkAuthStatus();
        this.loadUserPreferences();
        this.showWelcomeMessage();
        this.loadMarketIndices();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => {
                this.onTabSwitch(e.target.getAttribute('data-bs-target'));
            });
        });

        // Forms
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('addServiceForm').addEventListener('submit', (e) => this.handleAddService(e));
        document.getElementById('createTabForm').addEventListener('submit', (e) => this.handleCreateTab(e));

        // Real-time search
        document.getElementById('serviceSearch').addEventListener('input', () => this.debounce(this.filterServices.bind(this), 300)());
    }

    onTabSwitch(target) {
        switch(target) {
            case '#services':
                this.loadServices();
                break;
            case '#market':
                this.loadMarketData();
                break;
            case '#stocks':
                this.loadStockData();
                break;
            case '#admin':
                if (this.currentUser && this.currentUser.role === 'admin') {
                    this.loadAdminDashboard();
                }
                break;
            case '#content':
                if (this.currentUser && this.currentUser.role === 'admin') {
                    this.loadContentManager();
                }
                break;
        }
    }

    // Authentication
    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const loginData = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();
            
            if (result.token) {
                localStorage.setItem('token', result.token);
                this.currentUser = result.user;
                this.updateUserDisplay();
                bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                this.showNotification('Login successful! Welcome to Digital India Portal', 'success');
                
                if (result.user.role === 'admin') {
                    document.getElementById('admin-tab').style.display = 'block';
                }
            } else {
                this.showNotification(result.message || 'Login failed', 'error');
            }
        } catch (error) {
            this.showNotification('Login error. Please try again.', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const registerData = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...registerData,
                    location: {
                        state: registerData.state,
                        city: registerData.city
                    }
                })
            });

            const result = await response.json();
            
            if (result.token) {
                localStorage.setItem('token', result.token);
                this.currentUser = result.user;
                this.updateUserDisplay();
                bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
                this.showNotification('Registration successful! Welcome to Digital India Portal', 'success');
            } else {
                this.showNotification(result.message || 'Registration failed', 'error');
            }
        } catch (error) {
            this.showNotification('Registration error. Please try again.', 'error');
        }
    }

    checkAuthStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => response.json())
            .then(user => {
                this.currentUser = user;
                this.updateUserDisplay();
                if (user.role === 'admin') {
                    document.getElementById('admin-tab').style.display = 'block';
                }
            })
            .catch(() => {
                localStorage.removeItem('token');
            });
        }
    }

    updateUserDisplay() {
        const loginSection = document.getElementById('loginSection');
        const userSection = document.getElementById('userSection');
        const userDisplay = document.getElementById('userDisplay');
        
        if (this.currentUser) {
            loginSection.style.display = 'none';
            userSection.style.display = 'block';
            userDisplay.textContent = this.currentUser.name;
            
            if (this.currentUser.role === 'admin') {
                document.getElementById('admin-tab').style.display = 'block';
                document.getElementById('content-tab').style.display = 'block';
            }
        } else {
            loginSection.style.display = 'block';
            userSection.style.display = 'none';
            document.getElementById('admin-tab').style.display = 'none';
            document.getElementById('content-tab').style.display = 'none';
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.currentUser = null;
        this.updateUserDisplay();
        this.showNotification('Logged out successfully', 'info');
    }

    // Services Management
    async loadServices() {
        try {
            const response = await fetch('/api/services');
            const data = await response.json();
            this.services = data.services || [];
            this.displayServices(this.services);
        } catch (error) {
            console.error('Error loading services:', error);
            this.services = this.getFallbackServices();
            this.displayServices(this.services);
        }
    }

    displayServices(services) {
        const servicesList = document.getElementById('servicesList');
        servicesList.innerHTML = '';

        if (services.length === 0) {
            servicesList.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h5>No services found</h5>
                    <p class="text-muted">Try adjusting your search criteria</p>
                </div>
            `;
            return;
        }

        services.forEach((service, index) => {
            const serviceCard = this.createServiceCard(service, index);
            servicesList.appendChild(serviceCard);
        });
    }

    createServiceCard(service, index) {
        const card = document.createElement('div');
        card.className = 'service-card';
        if (this.animationsEnabled) {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate__animated', 'animate__fadeInUp');
        }

        const categoryIcons = {
            'identity-documents': { icon: '🆔', color: '#FF6B35' },
            'financial-services': { icon: '💰', color: '#28a745' },
            'healthcare': { icon: '🏥', color: '#dc3545' },
            'education': { icon: '🎓', color: '#007bff' },
            'social-welfare': { icon: '🤝', color: '#6f42c1' },
            'digital-services': { icon: '💻', color: '#17a2b8' }
        };

        const categoryInfo = categoryIcons[service.category] || { icon: '🏛️', color: '#6c757d' };

        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="service-icon" style="background: ${categoryInfo.color}">
                    ${categoryInfo.icon}
                </div>
                <div class="text-end">
                    <span class="badge bg-success">Active</span>
                    ${service.digitalFeatures?.onlineApplication ? '<span class="badge bg-primary ms-1">Online</span>' : ''}
                </div>
            </div>
            
            <h4 class="mb-2">${service.name}</h4>
            <p class="text-muted mb-3">${service.shortDescription || service.description.substring(0, 120)}...</p>
            
            <div class="row mb-3">
                <div class="col-md-6">
                    <div class="mb-2">
                        <strong><i class="fas fa-building me-2"></i>Department:</strong>
                        <div class="small text-muted">${service.department}</div>
                    </div>
                    ${service.contact?.helpline ? `
                        <div class="mb-2">
                            <strong><i class="fas fa-phone me-2"></i>Helpline:</strong>
                            <div class="small"><a href="tel:${service.contact.helpline}">${service.contact.helpline}</a></div>
                        </div>
                    ` : ''}
                </div>
                <div class="col-md-6">
                    <div class="mb-2">
                        <strong><i class="fas fa-clock me-2"></i>Processing Time:</strong>
                        <div class="small text-muted">${service.processingTime?.normal || 'Contact for details'}</div>
                    </div>
                    <div class="mb-2">
                        <strong><i class="fas fa-rupee-sign me-2"></i>Fees:</strong>
                        <div class="small text-muted">₹${service.fees?.normal || 0}</div>
                    </div>
                </div>
            </div>
            
            ${this.createDigitalFeaturesBadges(service.digitalFeatures)}
            
            <div class="d-flex gap-2 mt-3 flex-wrap">
                <button class="btn btn-primary btn-sm" onclick="app.openServiceApp('${service._id}')">
                    <i class="fas fa-external-link-alt me-1"></i>Open Service App
                </button>
                <button class="btn btn-outline-primary btn-sm" onclick="app.askAboutService('${service.name}')">
                    <i class="fas fa-comments me-1"></i>Ask AI
                </button>
                <button class="btn btn-outline-secondary btn-sm" onclick="app.openServiceFeedback('${service._id}')">
                    <i class="fas fa-comment-dots me-1"></i>Feedback
                </button>
                ${service.officialWebsite ? `
                    <a href="${service.officialWebsite}" target="_blank" class="btn btn-outline-info btn-sm">
                        <i class="fas fa-globe me-1"></i>Official Site
                    </a>
                ` : ''}
            </div>
        `;

        return card;
    }

    createDigitalFeaturesBadges(features) {
        if (!features) return '';
        
        let badges = '<div class="mb-2">';
        if (features.onlineApplication) badges += '<span class="badge bg-success me-1"><i class="fas fa-laptop me-1"></i>Online Application</span>';
        if (features.statusTracking) badges += '<span class="badge bg-info me-1"><i class="fas fa-search me-1"></i>Status Tracking</span>';
        if (features.digitalPayment) badges += '<span class="badge bg-warning me-1"><i class="fas fa-credit-card me-1"></i>Digital Payment</span>';
        if (features.aadhaarAuthentication) badges += '<span class="badge bg-primary me-1"><i class="fas fa-fingerprint me-1"></i>Aadhaar Auth</span>';
        badges += '</div>';
        return badges;
    }

    filterServices() {
        const searchTerm = document.getElementById('serviceSearch').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const stateFilter = document.getElementById('stateFilter').value;

        let filteredServices = this.services.filter(service => {
            const matchesSearch = !searchTerm || 
                service.name.toLowerCase().includes(searchTerm) ||
                service.description.toLowerCase().includes(searchTerm) ||
                service.department.toLowerCase().includes(searchTerm);
            
            const matchesCategory = !categoryFilter || service.category === categoryFilter;
            const matchesState = !stateFilter || (service.states && service.states.includes(stateFilter));
            
            return matchesSearch && matchesCategory && matchesState;
        });

        this.displayServices(filteredServices);
        this.showNotification(`Found ${filteredServices.length} services`, 'info');
    }

    // Market Data Management
    async loadMarketData() {
        try {
            const response = await fetch('/api/market');
            const data = await response.json();
            this.marketData = data.data || [];
            this.displayMarketData(this.marketData);
        } catch (error) {
            console.error('Error loading market data:', error);
            this.marketData = this.getFallbackMarketData();
            this.displayMarketData(this.marketData);
        }
    }

    displayMarketData(marketData) {
        const marketList = document.getElementById('marketDataList');
        marketList.innerHTML = '';

        if (marketData.length === 0) {
            marketList.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-chart-line fa-3x text-muted mb-3"></i>
                    <h5>No market data found</h5>
                    <p class="text-muted">Try adjusting your filter criteria</p>
                </div>
            `;
            return;
        }

        marketData.forEach((item, index) => {
            const marketCard = this.createMarketCard(item, index);
            marketList.appendChild(marketCard);
        });
    }

    createMarketCard(item, index) {
        const card = document.createElement('div');
        card.className = 'market-card';
        if (this.animationsEnabled) {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate__animated', 'animate__fadeInLeft');
        }

        const trendIcon = {
            'rising': '<i class="fas fa-arrow-up trend-up"></i>',
            'falling': '<i class="fas fa-arrow-down trend-down"></i>',
            'stable': '<i class="fas fa-minus trend-stable"></i>'
        };

        const categoryEmojis = {
            'vegetables': '🥬',
            'fruits': '🍎',
            'grains': '🌾',
            'pulses': '🫘',
            'spices': '🌶️'
        };

        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h5 class="mb-1">${categoryEmojis[item.category] || '📦'} ${item.commodity}</h5>
                    <small class="text-muted">${item.market}, ${item.district}, ${item.state}</small>
                </div>
                <div class="price-trend">
                    ${trendIcon[item.trend] || trendIcon.stable}
                    ${item.changePercent ? `<span class="trend-${item.trend}">${item.changePercent > 0 ? '+' : ''}${item.changePercent}%</span>` : ''}
                </div>
            </div>
            
            <div class="row">
                <div class="col-6">
                    <div class="text-center p-2 bg-light rounded">
                        <div class="small text-muted">Wholesale</div>
                        <div class="fw-bold">₹${item.prices.wholesale.average}</div>
                        <div class="small">${item.unit}</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="text-center p-2 bg-light rounded">
                        <div class="small text-muted">Retail</div>
                        <div class="fw-bold">₹${item.prices.retail.average}</div>
                        <div class="small">${item.unit}</div>
                    </div>
                </div>
            </div>
            
            <div class="mt-2 d-flex justify-content-between align-items-center">
                <span class="badge bg-${item.quality === 'premium' ? 'success' : item.quality === 'good' ? 'primary' : 'secondary'}">${item.quality}</span>
                <small class="text-muted">Updated: ${new Date(item.lastUpdated).toLocaleDateString()}</small>
            </div>
        `;

        return card;
    }

    filterMarketData() {
        const categoryFilter = document.getElementById('marketCategoryFilter').value;
        const stateFilter = document.getElementById('marketStateFilter').value;

        let filteredData = this.marketData.filter(item => {
            const matchesCategory = !categoryFilter || item.category === categoryFilter;
            const matchesState = !stateFilter || item.state === stateFilter;
            return matchesCategory && matchesState;
        });

        this.displayMarketData(filteredData);
        this.showNotification(`Found ${filteredData.length} market entries`, 'info');
    }

    // Stock Market Functionality
    async loadStockData() {
        try {
            const response = await fetch('/api/stocks');
            const data = await response.json();
            this.stockData = data.stocks || [];
            this.displayStockData(this.stockData);
        } catch (error) {
            console.error('Error loading stock data:', error);
            this.stockData = this.getFallbackStockData();
            this.displayStockData(this.stockData);
        }
    }

    displayStockData(stockData) {
        const stocksList = document.getElementById('stocksList');
        stocksList.innerHTML = '';

        if (stockData.length === 0) {
            stocksList.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-chart-line fa-3x text-muted mb-3"></i>
                    <h5>No stock data found</h5>
                    <p class="text-muted">Try adjusting your filter criteria</p>
                </div>
            `;
            return;
        }

        stockData.forEach((stock, index) => {
            const stockCard = this.createStockCard(stock, index);
            stocksList.appendChild(stockCard);
        });
    }

    createStockCard(stock, index) {
        const card = document.createElement('div');
        card.className = 'market-card';
        if (this.animationsEnabled) {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate__animated', 'animate__fadeInRight');
        }

        const trendIcon = {
            'up': '<i class="fas fa-arrow-up trend-up"></i>',
            'down': '<i class="fas fa-arrow-down trend-down"></i>',
            'stable': '<i class="fas fa-minus trend-stable"></i>'
        };

        const trendClass = stock.change >= 0 ? 'up' : 'down';
        const changePercent = ((stock.change / stock.previousClose) * 100).toFixed(2);

        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h5 class="mb-1">${stock.symbol}</h5>
                    <small class="text-muted">${stock.name} • ${stock.exchange}</small>
                </div>
                <div class="price-trend">
                    ${trendIcon[trendClass]}
                    <span class="trend-${trendClass}">${changePercent > 0 ? '+' : ''}${changePercent}%</span>
                </div>
            </div>
            
            <div class="row">
                <div class="col-6">
                    <div class="text-center p-2 bg-light rounded">
                        <div class="small text-muted">Current Price</div>
                        <div class="fw-bold">₹${stock.currentPrice.toFixed(2)}</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="text-center p-2 bg-light rounded">
                        <div class="small text-muted">Change</div>
                        <div class="fw-bold text-${trendClass === 'up' ? 'success' : 'danger'}">
                            ${stock.change > 0 ? '+' : ''}₹${stock.change.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-2">
                <div class="col-4">
                    <div class="small text-muted">High</div>
                    <div class="fw-bold">₹${stock.dayHigh.toFixed(2)}</div>
                </div>
                <div class="col-4">
                    <div class="small text-muted">Low</div>
                    <div class="fw-bold">₹${stock.dayLow.toFixed(2)}</div>
                </div>
                <div class="col-4">
                    <div class="small text-muted">Volume</div>
                    <div class="fw-bold">${this.formatVolume(stock.volume)}</div>
                </div>
            </div>
            
            <div class="mt-2 d-flex justify-content-between align-items-center">
                <span class="badge bg-${stock.sector === 'IT' ? 'primary' : stock.sector === 'Banking' ? 'success' : 'secondary'}">${stock.sector}</span>
                <small class="text-muted">Updated: ${new Date(stock.lastUpdated).toLocaleTimeString()}</small>
            </div>
        `;

        return card;
    }

    formatVolume(volume) {
        if (volume >= 10000000) return (volume / 10000000).toFixed(1) + 'Cr';
        if (volume >= 100000) return (volume / 100000).toFixed(1) + 'L';
        if (volume >= 1000) return (volume / 1000).toFixed(1) + 'K';
        return volume.toString();
    }

    filterStocks() {
        const exchangeFilter = document.getElementById('exchangeFilter').value;
        const sectorFilter = document.getElementById('sectorFilter').value;

        let filteredStocks = this.stockData.filter(stock => {
            const matchesExchange = !exchangeFilter || stock.exchange === exchangeFilter;
            const matchesSector = !sectorFilter || stock.sector === sectorFilter;
            return matchesExchange && matchesSector;
        });

        this.displayStockData(filteredStocks);
        this.showNotification(`Found ${filteredStocks.length} stocks`, 'info');
    }

    async loadMarketIndices() {
        try {
            const response = await fetch('/api/stocks/indices');
            const indices = await response.json();
            
            const indicesContainer = document.getElementById('marketIndices');
            if (indicesContainer) {
                indicesContainer.innerHTML = indices.map(index => `
                    <div class="d-flex justify-content-between align-items-center mb-2 p-2 rounded" style="background: var(--bg-secondary);">
                        <div>
                            <div class="fw-bold">${index.name}</div>
                            <div class="small text-muted">₹${index.value.toFixed(2)}</div>
                        </div>
                        <div class="text-end">
                            <div class="small ${index.change >= 0 ? 'text-success' : 'text-danger'}">
                                ${index.change >= 0 ? '+' : ''}${index.change.toFixed(2)}
                            </div>
                            <div class="small ${index.changePercent >= 0 ? 'text-success' : 'text-danger'}">
                                ${index.changePercent >= 0 ? '+' : ''}${index.changePercent.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading market indices:', error);
            // Fallback to mock data
            this.loadMarketIndicesFallback();
        }
    }

    loadMarketIndicesFallback() {
        const indicesContainer = document.getElementById('marketIndices');
        if (!indicesContainer) return;
        
        const indices = [
            { name: 'NIFTY 50', value: 19674.25, change: 145.30, changePercent: 0.74 },
            { name: 'SENSEX', value: 65953.48, change: 498.58, changePercent: 0.76 },
            { name: 'NIFTY BANK', value: 44821.15, change: 312.85, changePercent: 0.70 }
        ];

        indicesContainer.innerHTML = indices.map(index => `
            <div class="d-flex justify-content-between align-items-center mb-2 p-2 rounded" style="background: var(--bg-secondary);">
                <div>
                    <div class="fw-bold">${index.name}</div>
                    <div class="small text-muted">₹${index.value.toFixed(2)}</div>
                </div>
                <div class="text-end">
                    <div class="small ${index.change >= 0 ? 'text-success' : 'text-danger'}">
                        ${index.change >= 0 ? '+' : ''}${index.change.toFixed(2)}
                    </div>
                    <div class="small ${index.changePercent >= 0 ? 'text-success' : 'text-danger'}">
                        ${index.changePercent >= 0 ? '+' : ''}${index.changePercent.toFixed(2)}%
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Chart Functions
    showMarketCharts() {
        const container = document.getElementById('marketChartsContainer');
        container.style.display = 'block';
        
        if (this.marketChart) {
            this.marketChart.destroy();
        }

        const ctx = document.getElementById('marketPriceChart').getContext('2d');
        const chartData = this.prepareMarketChartData();

        this.marketChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Market Price Trends (Last 7 Days)',
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                    },
                    legend: {
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    }
                }
            }
        });
    }

    showStockCharts() {
        const container = document.getElementById('stockChartsContainer');
        container.style.display = 'block';
        
        if (this.stockChart) {
            this.stockChart.destroy();
        }

        const ctx = document.getElementById('stockPriceChart').getContext('2d');
        const chartData = this.prepareStockChartData();

        this.stockChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Stock Price Trends (Last 30 Days)',
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                    },
                    legend: {
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    }
                }
            }
        });
    }

    prepareMarketChartData() {
        const labels = ['7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday'];
        const commodities = ['Onion', 'Tomato', 'Potato'];
        const colors = ['#FF6B35', '#138808', '#000080'];

        const datasets = commodities.map((commodity, index) => ({
            label: commodity,
            data: Array.from({length: 7}, () => Math.floor(Math.random() * 50) + 20),
            borderColor: colors[index],
            backgroundColor: colors[index] + '20',
            tension: 0.4
        }));

        return { labels, datasets };
    }

    prepareStockChartData() {
        const labels = Array.from({length: 30}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        });

        const stocks = ['RELIANCE', 'TCS', 'INFY'];
        const colors = ['#FF6B35', '#138808', '#000080'];

        const datasets = stocks.map((stock, index) => {
            const basePrice = 1000 + (index * 500);
            const data = [];
            let currentPrice = basePrice;
            
            for (let i = 0; i < 30; i++) {
                const change = (Math.random() - 0.5) * 50;
                currentPrice += change;
                data.push(Math.max(currentPrice, basePrice * 0.8));
            }

            return {
                label: stock,
                data: data,
                borderColor: colors[index],
                backgroundColor: colors[index] + '20',
                tension: 0.4
            };
        });

        return { labels, datasets };
    }

    // Dark Mode Toggle
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
        
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('themeText');
        
        if (this.darkMode) {
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Light';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Dark';
        }
        
        localStorage.setItem('darkMode', this.darkMode);
        this.showNotification(`${this.darkMode ? 'Dark' : 'Light'} mode enabled`, 'info');
        
        // Update charts if they exist
        if (this.marketChart) {
            this.marketChart.update();
        }
        if (this.stockChart) {
            this.stockChart.update();
        }
    }

    // Content Management Functions
    loadContentManager() {
        this.loadExistingTabs();
    }

    loadExistingTabs() {
        const container = document.getElementById('existingTabs');
        const tabs = ['services', 'market', 'stocks', 'chat'];
        
        container.innerHTML = tabs.map(tab => `
            <div class="d-flex justify-content-between align-items-center mb-2 p-2 rounded" style="background: var(--bg-secondary);">
                <span class="fw-bold">${tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                <button class="btn btn-sm btn-outline-primary" onclick="app.editTab('${tab}')">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `).join('');
    }

    async handleCreateTab(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const tabData = Object.fromEntries(formData);

        try {
            // In a real implementation, this would save to the backend
            const tabId = tabData.tabName.toLowerCase().replace(/\s+/g, '-');
            
            // Add new tab to navigation
            const tabNav = document.getElementById('mainTabs');
            const newTabLi = document.createElement('li');
            newTabLi.className = 'nav-item';
            newTabLi.setAttribute('role', 'presentation');
            newTabLi.innerHTML = `
                <button class="nav-link" id="${tabId}-tab" data-bs-toggle="tab" data-bs-target="#${tabId}" type="button" role="tab">
                    <i class="${tabData.tabIcon} me-2"></i>${tabData.tabName}
                </button>
            `;
            
            // Insert before admin tab
            const adminTab = document.querySelector('#admin-tab').parentElement;
            tabNav.insertBefore(newTabLi, adminTab);
            
            // Add new tab content
            const tabContent = document.getElementById('mainTabContent');
            const newTabContent = document.createElement('div');
            newTabContent.className = 'tab-pane fade';
            newTabContent.id = tabId;
            newTabContent.setAttribute('role', 'tabpanel');
            newTabContent.innerHTML = `
                <div class="service-card">
                    <h3><i class="${tabData.tabIcon} me-2"></i>${tabData.tabName}</h3>
                    ${tabData.tabContent}
                </div>
            `;
            
            tabContent.appendChild(newTabContent);
            
            this.showNotification('New tab created successfully!', 'success');
            e.target.reset();
            this.loadExistingTabs();
            
        } catch (error) {
            this.showNotification('Error creating tab', 'error');
        }
    }

    loadContentSection() {
        const section = document.getElementById('contentSection').value;
        const editor = document.getElementById('contentEditor');
        
        if (!section) {
            editor.style.display = 'none';
            return;
        }
        
        editor.style.display = 'block';
        
        // Load section content (mock data for demo)
        const sectionData = {
            hero: {
                title: 'Digital India - Civic AI Assistant',
                content: 'Welcome to the future of government services. Access all Indian government services, get real-time market data, and chat with our AI assistant.'
            },
            about: {
                title: 'About Digital India Portal',
                content: 'Our platform bridges the gap between citizens and government services through AI-powered assistance and comprehensive service directory.'
            },
            features: {
                title: 'Key Features',
                content: 'AI-powered chat assistance, comprehensive service directory, real-time market data, multi-language support, and accessibility features.'
            },
            footer: {
                title: 'Footer Information',
                content: '© 2024 Digital India Portal. All rights reserved. Built for the people of India.'
            }
        };
        
        const data = sectionData[section];
        document.getElementById('sectionTitle').value = data.title;
        document.getElementById('sectionContent').value = data.content;
    }

    saveContentSection() {
        const section = document.getElementById('contentSection').value;
        const title = document.getElementById('sectionTitle').value;
        const content = document.getElementById('sectionContent').value;
        
        // In a real implementation, this would save to the backend
        this.showNotification(`${section} section updated successfully!`, 'success');
    }

    previewContent() {
        const content = document.getElementById('sectionContent').value;
        
        // Create preview modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Content Preview</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="service-card">
                            ${content}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }

    // Chat Functionality
    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessageToChat('user', message);
        input.value = '';

        try {
            const response = await fetch('/api/chat/' + (this.chatSessionId ? `continue/${this.chatSessionId}` : 'start'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    language: 'en',
                    context: 'digital-india'
                })
            });

            const data = await response.json();
            
            if (data.sessionId) {
                this.chatSessionId = data.sessionId;
            }

            this.addMessageToChat('assistant', data.response || 'I apologize, but I encountered an error. Please try again.');
        } catch (error) {
            this.addMessageToChat('assistant', 'I apologize, but I\'m having trouble connecting right now. Please try again later.');
        }
    }

    addMessageToChat(role, content) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = `<strong>${role === 'user' ? 'You' : 'AI Assistant'}:</strong> ${content}`;
        
        messageDiv.appendChild(contentDiv);
        
        if (this.animationsEnabled) {
            messageDiv.classList.add('animate__animated', 'animate__fadeInUp');
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    quickMessage(message) {
        document.getElementById('messageInput').value = message;
        this.sendMessage();
    }

    clearChat() {
        document.getElementById('chatMessages').innerHTML = '';
        this.chatSessionId = null;
        this.showWelcomeMessage();
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.addMessageToChat('assistant', 'Namaste! I\'m your Digital India AI Assistant. How can I help you today?');
        }, 500);
    }

    // Service Apps (Individual service interfaces)
    openServiceApp(serviceId) {
        const service = this.services.find(s => s._id === serviceId);
        if (!service) return;

        // Create a modal for the service app
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white;">
                        <h5 class="modal-title">${service.name} - Service Portal</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${this.createServiceAppContent(service)}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }

    createServiceAppContent(service) {
        return `
            <div class="service-app">
                <div class="row">
                    <div class="col-md-8">
                        <h6><i class="fas fa-info-circle me-2"></i>Service Information</h6>
                        <p>${service.description}</p>
                        
                        <h6><i class="fas fa-list-check me-2"></i>Eligibility Criteria</h6>
                        <ul>
                            ${service.eligibility?.criteria?.map(criteria => `<li>${criteria}</li>`).join('') || '<li>Contact department for details</li>'}
                        </ul>
                        
                        <h6><i class="fas fa-file-alt me-2"></i>Required Documents</h6>
                        <ul>
                            ${service.eligibility?.documents?.map(doc => `<li>${doc}</li>`).join('') || '<li>Contact department for details</li>'}
                        </ul>
                        
                        <h6><i class="fas fa-clock me-2"></i>Processing Time</h6>
                        <p>Normal: ${service.processingTime?.normal || 'Contact for details'}</p>
                        
                        <h6><i class="fas fa-rupee-sign me-2"></i>Fees</h6>
                        <p>₹${service.fees?.normal || 0} (Normal Processing)</p>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header">
                                <h6><i class="fas fa-rocket me-2"></i>Quick Actions</h6>
                            </div>
                            <div class="card-body">
                                ${service.digitalFeatures?.onlineApplication ? `
                                    <a href="${service.officialWebsite}" target="_blank" class="btn btn-primary w-100 mb-2">
                                        <i class="fas fa-external-link-alt me-2"></i>Apply Online
                                    </a>
                                ` : ''}
                                ${service.digitalFeatures?.statusTracking ? `
                                    <button class="btn btn-outline-primary w-100 mb-2" onclick="app.trackApplicationStatus('${service._id}')">
                                        <i class="fas fa-search me-2"></i>Track Status
                                    </button>
                                ` : ''}
                                <button class="btn btn-outline-secondary w-100 mb-2" onclick="app.openServiceFeedback('${service._id}')">
                                    <i class="fas fa-comment-dots me-2"></i>Feedback & Support
                                </button>
                                ${service.contact?.helpline ? `
                                    <a href="tel:${service.contact.helpline}" class="btn btn-outline-success w-100">
                                        <i class="fas fa-phone me-2"></i>Call Helpline
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                        
                        ${service.faqs && service.faqs.length > 0 ? `
                            <div class="card mt-3">
                                <div class="card-header">
                                    <h6><i class="fas fa-question-circle me-2"></i>FAQs</h6>
                                </div>
                                <div class="card-body">
                                    ${service.faqs.slice(0, 3).map(faq => `
                                        <div class="mb-2">
                                            <strong class="small">${faq.question}</strong>
                                            <div class="small text-muted">${faq.answer}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    openServiceFeedback(serviceId) {
        const service = this.services.find(s => s._id === serviceId);
        if (!service) return;

        // Create feedback modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Feedback & Support - ${service.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="feedbackForm">
                            <input type="hidden" name="serviceId" value="${serviceId}">
                            <div class="mb-3">
                                <label class="form-label">Type of Feedback</label>
                                <select class="form-select" name="type" required>
                                    <option value="support">Support Request</option>
                                    <option value="complaint">Complaint</option>
                                    <option value="suggestion">Suggestion</option>
                                    <option value="compliment">Compliment</option>
                                    <option value="bug_report">Bug Report</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Subject</label>
                                <input type="text" class="form-control" name="subject" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Message</label>
                                <textarea class="form-control" name="message" rows="4" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Priority</label>
                                <select class="form-select" name="priority">
                                    <option value="low">Low</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Submit Feedback</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        // Handle feedback form submission
        modal.querySelector('#feedbackForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const feedbackData = Object.fromEntries(formData);

            try {
                const response = await fetch('/api/feedback', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(feedbackData)
                });

                if (response.ok) {
                    this.showNotification('Feedback submitted successfully!', 'success');
                    modalInstance.hide();
                } else {
                    this.showNotification('Error submitting feedback', 'error');
                }
            } catch (error) {
                this.showNotification('Error submitting feedback', 'error');
            }
        });

        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }

    askAboutService(serviceName) {
        // Switch to chat tab and ask about the service
        const chatTab = document.getElementById('chat-tab');
        chatTab.click();
        
        setTimeout(() => {
            document.getElementById('messageInput').value = `Tell me more about ${serviceName}`;
            this.sendMessage();
        }, 500);
    }

    // Admin Functions
    async loadAdminDashboard() {
        if (!this.currentUser || this.currentUser.role !== 'admin') return;

        try {
            const response = await fetch('/api/admin/dashboard', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();

            document.getElementById('totalUsers').textContent = data.stats.totalUsers;
            document.getElementById('totalServices').textContent = data.stats.totalServices;
            document.getElementById('pendingFeedback').textContent = data.stats.pendingFeedback;
        } catch (error) {
            console.error('Error loading admin dashboard:', error);
        }
    }

    async handleAddService(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const serviceData = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/admin/services', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...serviceData,
                    shortDescription: serviceData.description.substring(0, 150)
                })
            });

            if (response.ok) {
                this.showNotification('Service added successfully!', 'success');
                e.target.reset();
                this.loadServices();
            } else {
                this.showNotification('Error adding service', 'error');
            }
        } catch (error) {
            this.showNotification('Error adding service', 'error');
        }
    }

    // Utility Functions
    toggleAnimations() {
        this.animationsEnabled = !this.animationsEnabled;
        document.body.classList.toggle('no-animations', !this.animationsEnabled);
        localStorage.setItem('animationsEnabled', this.animationsEnabled);
        this.showNotification(`Animations ${this.animationsEnabled ? 'enabled' : 'disabled'}`, 'info');
    }

    toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
        const enabled = document.body.classList.contains('high-contrast');
        localStorage.setItem('highContrast', enabled);
        this.showNotification(`High contrast ${enabled ? 'enabled' : 'disabled'}`, 'info');
    }

    toggleLargeText() {
        document.body.classList.toggle('large-text');
        const enabled = document.body.classList.contains('large-text');
        localStorage.setItem('largeText', enabled);
        this.showNotification(`Large text ${enabled ? 'enabled' : 'disabled'}`, 'info');
    }

    loadUserPreferences() {
        const animationsEnabled = localStorage.getItem('animationsEnabled');
        if (animationsEnabled === 'false') {
            this.animationsEnabled = false;
            document.body.classList.add('no-animations');
        }

        if (localStorage.getItem('highContrast') === 'true') {
            document.body.classList.add('high-contrast');
        }

        if (localStorage.getItem('largeText') === 'true') {
            document.body.classList.add('large-text');
        }

        // Load dark mode preference
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'true') {
            this.darkMode = true;
            document.documentElement.setAttribute('data-theme', 'dark');
            const themeIcon = document.getElementById('themeIcon');
            const themeText = document.getElementById('themeText');
            if (themeIcon && themeText) {
                themeIcon.className = 'fas fa-sun';
                themeText.textContent = 'Light';
            }
        }
    }

    toggleVoiceInput() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('messageInput').value = transcript;
                this.showNotification('Voice input captured!', 'success');
            };
            
            recognition.onerror = () => {
                this.showNotification('Voice recognition error', 'error');
            };
            
            recognition.start();
            this.showNotification('Listening... Speak now!', 'info');
        } else {
            this.showNotification('Voice recognition not supported', 'error');
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        
        document.body.appendChild(notification);
        
        if (this.animationsEnabled) {
            notification.classList.add('animate__animated', 'animate__slideInRight');
        }
        
        setTimeout(() => {
            if (notification.parentElement) {
                if (this.animationsEnabled) {
                    notification.classList.add('animate__slideOutRight');
                    setTimeout(() => notification.remove(), 500);
                } else {
                    notification.remove();
                }
            }
        }, 5000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Fallback data
    getFallbackServices() {
        return [
            {
                _id: '1',
                name: 'Aadhaar Card Services',
                description: 'Get your unique 12-digit identity number for all government services',
                shortDescription: 'Get your unique 12-digit identity number for all government services',
                category: 'identity-documents',
                department: 'UIDAI',
                officialWebsite: 'https://uidai.gov.in',
                contact: { helpline: '1947' },
                processingTime: { normal: '90 days' },
                fees: { normal: 0 },
                digitalFeatures: {
                    onlineApplication: true,
                    statusTracking: true,
                    aadhaarAuthentication: true
                },
                states: ['All States and UTs']
            }
        ];
    }

    getFallbackMarketData() {
        return [
            {
                commodity: 'Onion',
                category: 'vegetables',
                state: 'Maharashtra',
                district: 'Nashik',
                market: 'Lasalgaon',
                prices: {
                    wholesale: { average: 1000 },
                    retail: { average: 1400 }
                },
                unit: 'per quintal',
                quality: 'good',
                trend: 'stable',
                lastUpdated: new Date()
            }
        ];
    }

    getFallbackStockData() {
        return [
            {
                symbol: 'RELIANCE',
                name: 'Reliance Industries Limited',
                exchange: 'NSE',
                sector: 'Energy',
                currentPrice: 2456.75,
                previousClose: 2445.30,
                change: 11.45,
                dayHigh: 2467.80,
                dayLow: 2441.20,
                volume: 12500000,
                lastUpdated: new Date()
            },
            {
                symbol: 'TCS',
                name: 'Tata Consultancy Services',
                exchange: 'NSE',
                sector: 'IT',
                currentPrice: 3678.90,
                previousClose: 3665.45,
                change: 13.45,
                dayHigh: 3689.30,
                dayLow: 3658.70,
                volume: 8750000,
                lastUpdated: new Date()
            },
            {
                symbol: 'INFY',
                name: 'Infosys Limited',
                exchange: 'NSE',
                sector: 'IT',
                currentPrice: 1456.25,
                previousClose: 1448.80,
                change: 7.45,
                dayHigh: 1462.90,
                dayLow: 1445.60,
                volume: 15600000,
                lastUpdated: new Date()
            },
            {
                symbol: 'HDFCBANK',
                name: 'HDFC Bank Limited',
                exchange: 'NSE',
                sector: 'Banking',
                currentPrice: 1678.45,
                previousClose: 1685.20,
                change: -6.75,
                dayHigh: 1689.80,
                dayLow: 1672.30,
                volume: 9800000,
                lastUpdated: new Date()
            },
            {
                symbol: 'ICICIBANK',
                name: 'ICICI Bank Limited',
                exchange: 'NSE',
                sector: 'Banking',
                currentPrice: 945.60,
                previousClose: 952.30,
                change: -6.70,
                dayHigh: 956.80,
                dayLow: 941.20,
                volume: 11200000,
                lastUpdated: new Date()
            }
        ];
    }
}

// Global functions for HTML onclick events
function showLogin() {
    new bootstrap.Modal(document.getElementById('loginModal')).show();
}

function showRegister() {
    new bootstrap.Modal(document.getElementById('registerModal')).show();
}

function logout() {
    app.logout();
}

function toggleAnimations() {
    app.toggleAnimations();
}

function toggleHighContrast() {
    app.toggleHighContrast();
}

function toggleLargeText() {
    app.toggleLargeText();
}

function sendMessage() {
    app.sendMessage();
}

function quickMessage(message) {
    app.quickMessage(message);
}

function clearChat() {
    app.clearChat();
}

function toggleVoiceInput() {
    app.toggleVoiceInput();
}

function handleKeyPress(event) {
    app.handleKeyPress(event);
}

function filterServices() {
    app.filterServices();
}

function filterMarketData() {
    app.filterMarketData();
}

function showMarketCharts() {
    app.showMarketCharts();
}

function filterStocks() {
    app.filterStocks();
}

function showStockCharts() {
    app.showStockCharts();
}

function toggleDarkMode() {
    app.toggleDarkMode();
}

function showProfile() {
    app.showNotification('Profile feature coming soon!', 'info');
}

// Initialize the app
const app = new CivicAIApp();