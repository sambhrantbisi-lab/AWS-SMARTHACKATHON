// 🇮🇳 Civic AI Assistant - Government Grade Implementation
// Built for AWS Smart Hackathon 2024

// ============================================================================
// GLOBAL STATE MANAGEMENT
// ============================================================================

let currentChatSession = null;
let bharatServices = [];
let availableLanguages = [];
let categoryTranslations = {};
let isLoading = false;
let chatModal = null;
let servicesModal = null;

// ============================================================================
// GOVERNMENT-GRADE LANGUAGE SWITCHING SYSTEM
// ============================================================================

let currentLanguage = 'en';
let translations = {};
let isTranslationsLoaded = false;

// Government-grade translations (English and Hindi only)
const GOVERNMENT_TRANSLATIONS = {
    en: {
        app_title: "Civic AI Assistant",
        government_platform: "Government of India Official Platform",
        nav_services: "Services",
        nav_chat: "Chat Assistant",
        hero_title: "Your Comprehensive Civic Information Assistant",
        hero_subtitle: "Connecting citizens with government services, public welfare schemes, and civic information through advanced AI assistance. Available in Hindi and English.",
        hero_disclaimer: "This is an AI-powered assistant. For official procedures, please contact the relevant government department.",
        start_ai_assistant: "Start AI Assistant",
        browse_all_services: "Browse All Services",
        government_services: "Government Service Categories",
        comprehensive_access: "Comprehensive access to all government departments and public services across India.",
        how_we_help: "How We Help Your Community",
        tools_description: "Discover the tools designed to make accessing public services simple and efficient.",
        ai_powered_assistant: "AI-Powered Assistant",
        ai_description: "Get instant help finding public services and information through our intelligent chat assistant.",
        service_directory: "Service Directory",
        directory_description: "Browse and search through comprehensive database of local public services and resources.",
        start_chatting: "Start Chatting",
        browse_services: "Browse Services",
        accessible_for_everyone: "Accessible for Everyone",
        accessibility_description: "Our platform supports multiple languages, screen readers, high contrast mode, and keyboard navigation to ensure everyone can access public services.",
        built_with_love: "Built with ❤️ for community empowerment",
        services_count: "Government Services",
        languages_count: "Official Languages",
        ai_assistance: "AI Assistance"
    },
    hi: {
        app_title: "नागरिक AI सहायक",
        government_platform: "भारत सरकार का आधिकारिक मंच",
        nav_services: "सेवाएं",
        nav_chat: "चैट सहायक",
        hero_title: "आपका व्यापक नागरिक सूचना सहायक",
        hero_subtitle: "उन्नत AI सहायता के माध्यम से नागरिकों को सरकारी सेवाओं, सार्वजनिक कल्याण योजनाओं और नागरिक जानकारी से जोड़ना। हिंदी और अंग्रेजी में उपलब्ध।",
        hero_disclaimer: "यह एक AI-संचालित सहायक है। आधिकारिक प्रक्रियाओं के लिए, कृपया संबंधित सरकारी विभाग से संपर्क करें।",
        start_ai_assistant: "AI सहायक शुरू करें",
        browse_all_services: "सभी सेवाएं देखें",
        government_services: "सरकारी सेवा श्रेणियां",
        comprehensive_access: "भारत भर में सभी सरकारी विभागों और सार्वजनिक सेवाओं तक व्यापक पहुंच।",
        how_we_help: "हम आपके समुदाय की कैसे मदद करते हैं",
        tools_description: "सार्वजनिक सेवाओं तक पहुंच को सरल और कुशल बनाने के लिए डिज़ाइन किए गए उपकरणों की खोज करें।",
        ai_powered_assistant: "AI-संचालित सहायक",
        ai_description: "हमारे बुद्धिमान चैट सहायक के माध्यम से सार्वजनिक सेवाओं और जानकारी खोजने में तत्काल सहायता प्राप्त करें।",
        service_directory: "सेवा निर्देशिका",
        directory_description: "स्थानीय सार्वजनिक सेवाओं और संसाधनों के व्यापक डेटाबेस को ब्राउज़ और खोजें।",
        start_chatting: "चैट शुरू करें",
        browse_services: "सेवाएं देखें",
        accessible_for_everyone: "सभी के लिए सुलभ",
        accessibility_description: "हमारा मंच कई भाषाओं, स्क्रीन रीडर, उच्च कंट्रास्ट मोड और कीबोर्ड नेवीगेशन का समर्थन करता है ताकि हर कोई सार्वजनिक सेवाओं तक पहुंच सके।",
        built_with_love: "समुदायिक सशक्तिकरण के लिए ❤️ के साथ निर्मित",
        services_count: "सरकारी सेवाएं",
        languages_count: "आधिकारिक भाषाएं",
        ai_assistance: "AI सहायता"
    }
};

// Government-grade category translations
const GOVERNMENT_CATEGORY_TRANSLATIONS = {
    en: {
        healthcare: "Healthcare",
        healthcare_desc: "Health Services",
        employment: "Employment", 
        employment_desc: "Job Services",
        education: "Education",
        education_desc: "Educational Services",
        housing: "Housing",
        housing_desc: "Housing Schemes",
        legal: "Legal Aid",
        legal_desc: "Legal Assistance",
        transportation: "Transportation",
        transportation_desc: "Transport Services",
        documentation: "Documentation",
        documentation_desc: "Document Services",
        financial: "Financial",
        financial_desc: "Financial Services",
        emergency: "Emergency",
        emergency_desc: "Emergency Services",
        utilities: "Utilities",
        utilities_desc: "Utility Services",
        agriculture: "Agriculture",
        agriculture_desc: "Agricultural Services",
        welfare: "Welfare",
        welfare_desc: "Welfare Schemes"
    },
    hi: {
        healthcare: "स्वास्थ्य सेवा",
        healthcare_desc: "स्वास्थ्य सेवाएं",
        employment: "रोजगार",
        employment_desc: "रोजगार सेवाएं",
        education: "शिक्षा",
        education_desc: "शिक्षा सेवाएं",
        housing: "आवास",
        housing_desc: "आवास योजनाएं",
        legal: "कानूनी सहायता",
        legal_desc: "कानूनी सहायता",
        transportation: "परिवहन",
        transportation_desc: "परिवहन सेवाएं",
        documentation: "दस्तावेज़",
        documentation_desc: "दस्तावेज़ सेवाएं",
        financial: "वित्तीय",
        financial_desc: "वित्तीय सेवाएं",
        emergency: "आपातकाल",
        emergency_desc: "आपातकालीन सेवाएं",
        utilities: "उपयोगिताएं",
        utilities_desc: "उपयोगिता सेवाएं",
        agriculture: "कृषि",
        agriculture_desc: "कृषि सेवाएं",
        welfare: "कल्याण",
        welfare_desc: "कल्याण योजनाएं"
    }
};

// Initialize language system
function initializeLanguageSystem() {
    // Load translations
    translations = GOVERNMENT_TRANSLATIONS;
    categoryTranslations = GOVERNMENT_CATEGORY_TRANSLATIONS;
    isTranslationsLoaded = true;
    
    // Get saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
        currentLanguage = savedLanguage;
    } else {
        // Default to English
        currentLanguage = 'en';
    }
    
    // Update language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    
    console.log('🇮🇳 Government language system initialized:', currentLanguage);
}

// Government-grade language change function
function changeLanguage(languageCode) {
    console.log('🌐 Government language change requested:', languageCode);
    
    // Validate language code (only English and Hindi supported)
    if (languageCode !== 'en' && languageCode !== 'hi') {
        console.error('❌ Unsupported language code:', languageCode);
        return;
    }
    
    // Check if translations are loaded
    if (!isTranslationsLoaded) {
        console.error('❌ Translations not loaded yet');
        return;
    }
    
    // Update current language
    currentLanguage = languageCode;
    localStorage.setItem('preferredLanguage', languageCode);
    
    // Update UI immediately
    updateGovernmentUI();
    
    // Update language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = languageCode;
    }
    
    // Show notification
    const languageName = languageCode === 'hi' ? 'हिन्दी' : 'English';
    showNotification(`भाषा बदली गई / Language changed to ${languageName}`, 'success');
    
    console.log('✅ Government language change completed:', languageCode);
}

// Government-grade UI update function
function updateGovernmentUI() {
    const lang = currentLanguage;
    const t = translations[lang] || translations['en'];
    const ct = categoryTranslations[lang] || categoryTranslations['en'];
    
    console.log('🏛️ Updating government UI to:', lang);
    
    // Update page title
    document.title = t.app_title;
    
    // Update navbar
    const navbarTitle = document.querySelector('.navbar-title');
    if (navbarTitle) {
        navbarTitle.innerHTML = `
            <span class="gov-emblem">🇮🇳</span>
            ${t.app_title}
            <span class="beta-tag">BETA</span>
        `;
    }
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(btn => {
        const href = btn.getAttribute('href');
        if (href === '#services') {
            btn.textContent = t.nav_services;
        } else if (href === '#chat') {
            btn.textContent = t.nav_chat;
        }
    });
    
    // Update hero section
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        heroTitle.textContent = t.hero_title;
    }
    
    const heroSubtitle = document.querySelector('.hero p');
    if (heroSubtitle) {
        heroSubtitle.textContent = t.hero_subtitle;
    }
    
    const heroDisclaimer = document.querySelector('.hero-disclaimer');
    if (heroDisclaimer) {
        heroDisclaimer.innerHTML = `
            <span class="material-icons">info</span>
            ${t.hero_disclaimer}
        `;
    }
    
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        heroBadge.innerHTML = `
            <span class="material-icons">verified</span>
            ${t.government_platform}
        `;
    }
    
    // Update hero buttons
    const startChatBtn = document.getElementById('start-chat-btn');
    if (startChatBtn) {
        startChatBtn.innerHTML = `
            <span class="material-icons">chat</span>
            ${t.start_ai_assistant}
        `;
    }
    
    const browseServicesBtn = document.getElementById('browse-services-btn');
    if (browseServicesBtn) {
        browseServicesBtn.innerHTML = `
            <span class="material-icons">search</span>
            ${t.browse_all_services}
        `;
    }
    
    // Update stats labels
    const statLabels = document.querySelectorAll('.stat-label');
    if (statLabels.length >= 3) {
        statLabels[0].textContent = t.services_count;
        statLabels[1].textContent = t.languages_count;
        statLabels[2].textContent = t.ai_assistance;
    }
    
    // Update section headers
    const sectionHeaders = document.querySelectorAll('.section-header h2');
    sectionHeaders.forEach(header => {
        const text = header.textContent.trim();
        if (text.includes('How We Help') || text.includes('हम आपके समुदाय')) {
            header.textContent = t.how_we_help;
        } else if (text.includes('Government Service Categories') || text.includes('सरकारी सेवा श्रेणियां')) {
            header.textContent = t.government_services;
        }
    });
    
    const sectionSubtitles = document.querySelectorAll('.section-header p');
    sectionSubtitles.forEach(subtitle => {
        const text = subtitle.textContent.trim();
        if (text.includes('tools designed') || text.includes('उपकरणों की खोज')) {
            subtitle.textContent = t.tools_description;
        } else if (text.includes('Comprehensive access') || text.includes('व्यापक पहुंच')) {
            subtitle.textContent = t.comprehensive_access;
        }
    });
    
    // Update feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        const button = card.querySelector('.btn-contained');
        
        if (title && (title.textContent.includes('AI-Powered') || title.textContent.includes('AI-संचालित'))) {
            title.textContent = t.ai_powered_assistant;
            if (description) {
                description.textContent = t.ai_description;
            }
            if (button) {
                button.innerHTML = `
                    ${t.start_chatting}
                    <span class="material-icons">arrow_forward</span>
                `;
            }
        } else if (title && (title.textContent.includes('Service Directory') || title.textContent.includes('सेवा निर्देशिका'))) {
            title.textContent = t.service_directory;
            if (description) {
                description.textContent = t.directory_description;
            }
            if (button) {
                button.innerHTML = `
                    ${t.browse_services}
                    <span class="material-icons">arrow_forward</span>
                `;
            }
        }
    });
    
    // Update category chips
    updateGovernmentCategoryChips();
    
    // Update accessibility section
    const accessibilityTitle = document.querySelector('.accessibility-notice h3');
    if (accessibilityTitle) {
        accessibilityTitle.textContent = t.accessible_for_everyone;
    }
    
    const accessibilityDesc = document.querySelector('.accessibility-notice p');
    if (accessibilityDesc) {
        accessibilityDesc.textContent = t.accessibility_description;
    }
    
    // Update footer
    const footer = document.querySelector('.footer p');
    if (footer) {
        footer.innerHTML = `&copy; 2024 Civic AI Assistant - ${t.built_with_love}`;
    }
    
    console.log('✅ Government UI updated successfully');
}

// Update category chips with government translations
function updateGovernmentCategoryChips() {
    const lang = currentLanguage;
    const ct = categoryTranslations[lang] || categoryTranslations['en'];
    
    document.querySelectorAll('.category-chip').forEach(chip => {
        const category = chip.getAttribute('data-category');
        const categoryInfo = chip.querySelector('.category-info');
        
        if (category && categoryInfo && ct[category]) {
            const nameSpan = categoryInfo.querySelector('.category-name');
            const descSpan = categoryInfo.querySelector('.category-desc');
            
            if (nameSpan) {
                nameSpan.textContent = ct[category];
            }
            if (descSpan) {
                descSpan.textContent = ct[category + '_desc'] || '';
            }
        }
    });
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <span class="notification-text">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    console.log(`📢 Notification: ${type} - ${message}`);
}

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Government-Grade Civic AI Assistant...');
    
    // Initialize government language system
    initializeLanguageSystem();
    
    // Apply initial UI
    updateGovernmentUI();
    
    // Show success notification
    showNotification('🇮🇳 Civic AI Assistant Ready!', 'success');
    
    console.log('✅ Government application initialized successfully');
});

// ============================================================================
// GLOBAL FUNCTIONS (for onclick handlers)
// ============================================================================

// Make functions globally available for onclick handlers
window.changeLanguage = changeLanguage; // Government-grade function

// Test function for debugging
window.testLanguageChange = function() {
    console.log('🧪 Testing government language change to Hindi');
    changeLanguage('hi');
};

console.log('🎉 Government-Grade Civic AI Assistant JavaScript loaded successfully!');
console.log('🇮🇳 Ready to serve Indian citizens with bilingual AI-powered civic assistance');