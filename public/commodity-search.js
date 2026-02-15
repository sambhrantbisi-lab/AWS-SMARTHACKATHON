// Enhanced Commodity Search System
// Supports 240+ commodities from 7,000+ mandis with dynamic loading

class CommoditySearchSystem {
    constructor() {
        this.apiKey = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
        this.allCommodities = [];
        this.filteredCommodities = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.categories = ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'oilseeds'];
        this.selectedCategory = 'all';
    }

    // Load all commodities from Data.gov.in
    async loadAllCommodities() {
        try {
            const response = await fetch('/api/realdata/commodities/live');
            const data = await response.json();
            
            if (data.success) {
                this.allCommodities = data.data;
                this.filteredCommodities = this.allCommodities;
                return this.allCommodities;
            }
            return [];
        } catch (error) {
            console.error('Commodity load error:', error);
            return [];
        }
    }

    // Search commodities by name
    searchCommodities(query) {
        if (!query || query.length < 2) {
            this.filteredCommodities = this.allCommodities;
            return this.getPaginatedResults();
        }
        
        const lowerQuery = query.toLowerCase();
        this.filteredCommodities = this.allCommodities.filter(item =>
            item.commodity.toLowerCase().includes(lowerQuery) ||
            item.state.toLowerCase().includes(lowerQuery) ||
            item.market.toLowerCase().includes(lowerQuery)
        );
        
        this.currentPage = 1;
        return this.getPaginatedResults();
    }

    // Filter by category
    filterByCategory(category) {
        this.selectedCategory = category;
        
        if (category === 'all') {
            this.filteredCommodities = this.allCommodities;
        } else {
            this.filteredCommodities = this.allCommodities.filter(item =>
                item.category === category
            );
        }
        
        this.currentPage = 1;
        return this.getPaginatedResults();
    }

    // Filter by state
    filterByState(state) {
        if (state === 'all') {
            this.filteredCommodities = this.allCommodities;
        } else {
            this.filteredCommodities = this.allCommodities.filter(item =>
                item.state === state
            );
        }
        
        this.currentPage = 1;
        return this.getPaginatedResults();
    }

    // Get unique states
    getStates() {
        const states = new Set(this.allCommodities.map(item => item.state));
        return Array.from(states).sort();
    }

    // Get paginated results
    getPaginatedResults() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredCommodities.slice(start, end);
    }

    // Pagination helpers
    getTotalPages() {
        return Math.ceil(this.filteredCommodities.length / this.itemsPerPage);
    }

    hasNextPage() {
        return this.currentPage < this.getTotalPages();
    }

    hasPrevPage() {
        return this.currentPage > 1;
    }

    nextPage() {
        if (this.hasNextPage()) {
            this.currentPage++;
            return this.getPaginatedResults();
        }
        return [];
    }

    prevPage() {
        if (this.hasPrevPage()) {
            this.currentPage--;
            return this.getPaginatedResults();
        }
        return [];
    }

    goToPage(page) {
        if (page >= 1 && page <= this.getTotalPages()) {
            this.currentPage = page;
            return this.getPaginatedResults();
        }
        return [];
    }

    // Get commodity details
    getCommodityDetails(commodity, state, market) {
        return this.allCommodities.find(item =>
            item.commodity === commodity &&
            item.state === state &&
            item.market === market
        );
    }

    // Get price statistics
    getPriceStats(commodityName) {
        const items = this.allCommodities.filter(item =>
            item.commodity === commodityName
        );
        
        if (items.length === 0) return null;
        
        const prices = items.map(item => item.prices.wholesale.average);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
        
        return {
            min,
            max,
            average: avg,
            markets: items.length,
            states: new Set(items.map(item => item.state)).size
        };
    }
}

// Initialize the system
const commoditySearch = new CommoditySearchSystem();
