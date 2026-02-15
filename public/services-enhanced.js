/**
 * Enhanced Services Page with Tags and Multi-Language Support
 * Version: 1.0
 */

(function() {
    'use strict';

    let governmentServices = [];
    let allTags = new Set();

    // Enhanced service card creation with tags
    function createServiceCard(service) {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.setAttribute('data-category', service.category);
        card.setAttribute('data-tags', (service.tags || []).join(','));

        const serviceId = service._id || service.id;
        const icon = service.icon || '📋';
        const fees = service.fees?.normal !== undefined ? service.fees.normal : 0;
        const processingTime = service.processingTime?.normal || service.processingTime || 'N/A';
        const tags = service.tags || [];

        // Collect all unique tags
        tags.forEach(tag => allTags.add(tag));

        card.innerHTML = `
            <div class="service-icon">${icon}</div>
            <h3 class="service-title">${service.name}</h3>
            <p class="service-description">${service.shortDescription || service.description}</p>
            
            ${tags.length > 0 ? `
                <div class="service-tags">
                    ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="service-meta">
                <span class="service-fee" data-i18n="${fees === 0 ? 'free' : ''}">${fees === 0 ? 'Free' : '₹' + fees}</span>
                <span class="service-time">${processingTime}</span>
            </div>
            <div class="service-actions">
                <button class="btn btn-primary" data-i18n="apply_online" onclick="applyOnline('${serviceId}')">
                    <i class="fas fa-external-link-alt"></i>
                    Apply Online
                </button>
                <button class="btn btn-secondary" data-i18n="view_details" onclick="showServiceDetails('${serviceId}')">
                    <i class="fas fa-info-circle"></i>
                    Details
                </button>
            </div>
        `;

        return card;
    }

    // Enhanced filtering with tags
    function filterServices() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const tagFilter = document.getElementById('tagFilter');
        
        if (!searchInput || !categoryFilter) return;

        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedTag = tagFilter ? tagFilter.value : '';
        const serviceCards = document.querySelectorAll('.service-card');

        let visibleCount = 0;

        serviceCards.forEach(card => {
            const title = card.querySelector('.service-title').textContent.toLowerCase();
            const description = card.querySelector('.service-description').textContent.toLowerCase();
            const category = card.getAttribute('data-category');
            const tags = (card.getAttribute('data-tags') || '').split(',');

            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = !selectedCategory || category === selectedCategory;
            const matchesTag = !selectedTag || tags.includes(selectedTag);

            const isVisible = matchesSearch && matchesCategory && matchesTag;
            card.style.display = isVisible ? 'block' : 'none';
            
            if (isVisible) visibleCount++;
        });

        // Update results count
        updateResultsCount(visibleCount, serviceCards.length);
    }

    // Update results count display
    function updateResultsCount(visible, total) {
        let countDisplay = document.getElementById('resultsCount');
        if (!countDisplay) {
            countDisplay = document.createElement('div');
            countDisplay.id = 'resultsCount';
            countDisplay.className = 'results-count';
            const controls = document.querySelector('.controls');
            if (controls) {
                controls.parentNode.insertBefore(countDisplay, controls.nextSibling);
            }
        }
        
        const lang = window.LanguageManager ? window.LanguageManager.getCurrentLanguage() : 'en';
        const text = lang === 'hi' ? 
            `${visible} सेवाएं दिखाई जा रही हैं (कुल ${total})` :
            `Showing ${visible} services (of ${total} total)`;
        
        countDisplay.textContent = text;
        countDisplay.style.cssText = `
            text-align: center;
            padding: 12px;
            color: var(--text-secondary);
            font-weight: 600;
            margin-bottom: 16px;
        `;
    }

    // Populate tag filter dropdown
    function populateTagFilter() {
        const tagFilter = document.getElementById('tagFilter');
        if (!tagFilter || allTags.size === 0) return;

        // Clear existing options except first
        while (tagFilter.options.length > 1) {
            tagFilter.remove(1);
        }

        // Add tag options
        Array.from(allTags).sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
            tagFilter.appendChild(option);
        });
    }

    // Initialize enhanced services
    function initEnhancedServices() {
        // Attach filter event listeners
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const tagFilter = document.getElementById('tagFilter');

        if (searchInput) {
            searchInput.addEventListener('input', filterServices);
        }
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterServices);
        }
        if (tagFilter) {
            tagFilter.addEventListener('change', filterServices);
        }

        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            // Re-apply translations to dynamically created elements
            if (window.LanguageManager) {
                setTimeout(() => {
                    document.querySelectorAll('[data-i18n]').forEach(element => {
                        const key = element.getAttribute('data-i18n');
                        if (key) {
                            element.textContent = window.LanguageManager.t(key);
                        }
                    });
                }, 100);
            }
        });

        console.log('✅ Enhanced services initialized with tags and language support');
    }

    // Export functions
    window.EnhancedServices = {
        createServiceCard,
        filterServices,
        populateTagFilter,
        init: initEnhancedServices
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancedServices);
    } else {
        initEnhancedServices();
    }

})();
