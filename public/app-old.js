// 🇮🇳 Civic AI Assistant - Professional Grade Implementation
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
        
        if (title && title.textContent.includes('AI-Powered')) {
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
        } else if (title && title.textContent.includes('Service Directory')) {
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
// APPLICATION INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Civic AI Assistant...');
    initializeApp();
});

async function initializeApp() {
    try {
        // Initialize theme system
        initializeTheme();
        
        // Initialize government-grade language system
        initializeLanguageSystem();
        
        // Load available languages
        await loadAvailableLanguages();
        
        // Load Bharat services data
        await loadBharatServices();
        
        // Update service statistics
        updateServiceStatistics();
        
        // Setup all button handlers
        setupButtonHandlers();
        
        // Create modal interfaces
        createChatModal();
        createServicesModal();
        
        // Setup accessibility features
        setupAccessibility();
        
        // Apply government UI
        updateGovernmentUI();
        
        // Show success notification
        showNotification('🇮🇳 Civic AI Assistant Ready!', 'success');
        
        console.log('✅ Application initialized successfully');
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showNotification('Failed to initialize application', 'error');
    }
}

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeIcon = document.getElementById('theme-icon');
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = 'light_mode';
    } else {
        document.body.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.textContent = 'dark_mode';
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const themeIcon = document.getElementById('theme-icon');
            if (e.matches) {
                document.body.setAttribute('data-theme', 'dark');
                if (themeIcon) themeIcon.textContent = 'light_mode';
            } else {
                document.body.setAttribute('data-theme', 'light');
                if (themeIcon) themeIcon.textContent = 'dark_mode';
            }
        }
    });
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        body.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = 'light_mode';
        localStorage.setItem('theme', 'dark');
        showNotification('Dark mode enabled', 'info');
    } else {
        body.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.textContent = 'dark_mode';
        localStorage.setItem('theme', 'light');
        showNotification('Light mode enabled', 'info');
    }
}

// ============================================================================
// DATA LOADING
// ============================================================================

async function loadAvailableLanguages() {
    try {
        console.log('🌐 Loading available languages...');
        const response = await fetch('/api/services/languages');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        availableLanguages = data.languages || [];
        
        console.log(`✅ Loaded ${availableLanguages.length} languages`);
        
        // Update language selector
        updateLanguageSelector();
        
        return availableLanguages;
        
    } catch (error) {
        console.error('❌ Error loading languages:', error);
        // Fallback to basic languages
        availableLanguages = [
            { code: 'en', name: 'English', englishName: 'English' },
            { code: 'hi', name: 'हिन्दी', englishName: 'Hindi' }
        ];
        return availableLanguages;
    }
}

function updateLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    if (!languageSelect) {
        console.error('❌ Language selector not found');
        return;
    }
    
    console.log('🌐 Updating language selector with', availableLanguages.length, 'languages');
    
    if (availableLanguages.length === 0) {
        console.log('⚠️ No available languages, using fallback');
        // Fallback languages if API fails
        availableLanguages = [
            { code: 'en', name: 'English', englishName: 'English' },
            { code: 'hi', name: 'हिन्दी', englishName: 'Hindi' },
            { code: 'bn', name: 'বাংলা', englishName: 'Bengali' },
            { code: 'te', name: 'తెలుగు', englishName: 'Telugu' },
            { code: 'ta', name: 'தமிழ்', englishName: 'Tamil' },
            { code: 'gu', name: 'ગુજરાતી', englishName: 'Gujarati' }
        ];
    }
    
    // Clear existing options
    languageSelect.innerHTML = '';
    
    // Add language options
    availableLanguages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = `${lang.name} (${lang.englishName})`;
        languageSelect.appendChild(option);
    });
    
    // Set current language
    languageSelect.value = currentLanguage;
    
    console.log('✅ Language selector updated with options:', availableLanguages.map(l => l.code));
}

async function loadBharatServices() {
    try {
        console.log('📊 Loading Bharat services...');
        const response = await fetch('/api/services');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        bharatServices = data.services || [];
        
        console.log(`✅ Loaded ${bharatServices.length} Bharat services`);
        
        // Update category counts
        updateCategoryCounts();
        
        return bharatServices;
        
    } catch (error) {
        console.error('❌ Error loading services:', error);
        showNotification('Unable to load services. Please check your connection.', 'error');
        
        // Fallback to empty array
        bharatServices = [];
        return [];
    }
}

async function loadTranslations() {
    try {
        console.log('🌐 Loading translations...');
        
        // Load main translations
        const translationsResponse = await fetch('/data/translations.json');
        if (!translationsResponse.ok) {
            throw new Error(`HTTP ${translationsResponse.status}: ${translationsResponse.statusText}`);
        }
        const translationsData = await translationsResponse.json();
        translations = translationsData.translations || {};
        console.log('✅ Main translations loaded:', Object.keys(translations));
        
        // Load category translations
        const categoryResponse = await fetch('/data/categoryTranslations.json');
        if (!categoryResponse.ok) {
            throw new Error(`HTTP ${categoryResponse.status}: ${categoryResponse.statusText}`);
        }
        const categoryData = await categoryResponse.json();
        categoryTranslations = categoryData.categories || {};
        console.log('✅ Category translations loaded:', Object.keys(categoryTranslations));
        
        console.log('✅ All translations loaded successfully');
        
    } catch (error) {
        console.error('❌ Error loading translations:', error);
        // Fallback to empty translations
        translations = {};
        categoryTranslations = {};
    }
}

function initializeLanguage() {
    // Get language from localStorage or browser preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    const browserLanguage = navigator.language.split('-')[0];
    
    // Check if saved language is available
    if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
        currentLanguage = savedLanguage;
    } else if (availableLanguages.some(lang => lang.code === browserLanguage)) {
        currentLanguage = browserLanguage;
    } else {
        currentLanguage = 'en'; // Default fallback
    }
    
    // Update language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    
    // Apply initial language
    updateUILanguage();
    
    console.log(`🌐 Language initialized: ${currentLanguage}`);
}

function changeLanguage(languageCode) {
    console.log('🌐 changeLanguage called with:', languageCode);
    console.log('🌐 Current language:', currentLanguage);
    console.log('🌐 Available translations:', Object.keys(translations));
    
    if (!languageCode || languageCode === currentLanguage) {
        console.log('⚠️ Language code invalid or same as current');
        return;
    }
    
    // Validate language code
    if (!availableLanguages.some(lang => lang.code === languageCode)) {
        console.error('❌ Invalid language code:', languageCode);
        console.log('Available languages:', availableLanguages.map(l => l.code));
        return;
    }
    
    console.log(`🌐 Changing language from ${currentLanguage} to ${languageCode}`);
    
    currentLanguage = languageCode;
    localStorage.setItem('preferredLanguage', languageCode);
    
    // Update UI
    updateUILanguage();
    
    // Update language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = languageCode;
    }
    
    // Show notification
    const languageName = availableLanguages.find(lang => lang.code === languageCode)?.name || languageCode;
    showNotification(`Language changed to ${languageName}`, 'success');
    
    console.log('✅ Language change completed');
}

function updateUILanguage() {
    const lang = currentLanguage;
    const t = translations[lang] || translations['en'] || {};
    const ct = categoryTranslations[lang] || categoryTranslations['en'] || {};
    
    console.log(`🌐 Updating UI to language: ${lang}`);
    console.log('🌐 Translation object keys:', Object.keys(t));
    console.log('🌐 Category translations keys:', Object.keys(ct));
    
    if (Object.keys(t).length === 0) {
        console.error('❌ No translations available for language:', lang);
        return;
    }
    
    // Update page title
    document.title = t.app_title || 'Civic AI Assistant';
    console.log('📝 Updated page title to:', document.title);
    
    // Update navbar
    const navbarTitle = document.querySelector('.navbar-title');
    if (navbarTitle) {
        navbarTitle.innerHTML = `
            <span class="gov-emblem">🇮🇳</span>
            ${t.app_title || 'Civic AI Assistant'}
            <span class="beta-tag">BETA</span>
        `;
    }
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(btn => {
        const href = btn.getAttribute('href');
        if (href === '#services') {
            btn.textContent = t.nav_services || 'Services';
        } else if (href === '#chat') {
            btn.textContent = t.nav_chat || 'Chat Assistant';
        }
    });
    
    // Update hero section
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        heroTitle.textContent = t.hero_title || 'Your Comprehensive Civic Information Assistant';
    }
    
    const heroSubtitle = document.querySelector('.hero p');
    if (heroSubtitle) {
        heroSubtitle.textContent = t.hero_subtitle || 'Connecting citizens with government services, public welfare schemes, and civic information through advanced AI assistance. Available in all official Indian languages.';
    }
    
    const heroDisclaimer = document.querySelector('.hero-disclaimer');
    if (heroDisclaimer) {
        heroDisclaimer.innerHTML = `
            <span class="material-icons">info</span>
            ${t.hero_disclaimer || 'This is an AI-powered assistant. For official procedures, please contact the relevant government department.'}
        `;
    }
    
    // Update hero buttons
    const startChatBtn = document.getElementById('start-chat-btn');
    if (startChatBtn) {
        startChatBtn.innerHTML = `
            <span class="material-icons">chat</span>
            ${t.start_ai_assistant || 'Start AI Assistant'}
        `;
    }
    
    const browseServicesBtn = document.getElementById('browse-services-btn');
    if (browseServicesBtn) {
        browseServicesBtn.innerHTML = `
            <span class="material-icons">search</span>
            ${t.browse_all_services || 'Browse All Services'}
        `;
    }
    
    // Update hero badge
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        heroBadge.innerHTML = `
            <span class="material-icons">verified</span>
            ${t.government_platform || 'Government of India Official Platform'}
        `;
    }
    
    // Update stats labels
    const statLabels = document.querySelectorAll('.stat-label');
    if (statLabels.length >= 3) {
        statLabels[0].textContent = t.services_count || 'Government Services';
        statLabels[1].textContent = t.languages_count || 'Official Languages';
        statLabels[2].textContent = t.ai_assistance || 'AI Assistance';
    }
    
    // Update section headers
    const sectionHeaders = document.querySelectorAll('.section-header h2');
    sectionHeaders.forEach(header => {
        const text = header.textContent.trim();
        if (text.includes('How We Help')) {
            header.textContent = t.how_we_help || 'How We Help Your Community';
        } else if (text.includes('Government Service Categories')) {
            header.textContent = t.government_services || 'Government Service Categories';
        }
    });
    
    const sectionSubtitles = document.querySelectorAll('.section-header p');
    sectionSubtitles.forEach(subtitle => {
        const text = subtitle.textContent.trim();
        if (text.includes('tools designed')) {
            subtitle.textContent = t.tools_description || 'Discover the tools designed to make accessing public services simple and efficient.';
        } else if (text.includes('Comprehensive access')) {
            subtitle.textContent = t.comprehensive_access || 'Comprehensive access to all government departments and public services across India.';
        }
    });
    
    // Update feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        const button = card.querySelector('.btn-contained');
        
        if (title && title.textContent.includes('AI-Powered')) {
            title.textContent = t.ai_powered_assistant || 'AI-Powered Assistant';
            if (description) {
                description.textContent = t.ai_description || 'Get instant help finding public services and information through our intelligent chat assistant.';
            }
            if (button) {
                button.innerHTML = `
                    ${t.start_chatting || 'Start Chatting'}
                    <span class="material-icons">arrow_forward</span>
                `;
            }
        } else if (title && title.textContent.includes('Service Directory')) {
            title.textContent = t.service_directory || 'Service Directory';
            if (description) {
                description.textContent = t.directory_description || 'Browse and search through comprehensive database of local public services and resources.';
            }
            if (button) {
                button.innerHTML = `
                    ${t.browse_services || 'Browse Services'}
                    <span class="material-icons">arrow_forward</span>
                `;
            }
        }
    });
    
    // Update category chips
    updateCategoryChips();
    
    // Update accessibility section
    const accessibilityTitle = document.querySelector('.accessibility-notice h3');
    if (accessibilityTitle) {
        accessibilityTitle.textContent = t.accessible_for_everyone || 'Accessible for Everyone';
    }
    
    const accessibilityDesc = document.querySelector('.accessibility-notice p');
    if (accessibilityDesc) {
        accessibilityDesc.textContent = t.accessibility_description || 'Our platform supports multiple languages, screen readers, high contrast mode, and keyboard navigation to ensure everyone can access public services.';
    }
    
    // Update footer
    const footer = document.querySelector('.footer p');
    if (footer) {
        footer.innerHTML = `&copy; 2024 Civic AI Assistant - ${t.built_with_love || 'Built with ❤️ for community empowerment'}`;
    }
    
    // Update demo section
    const demoTitle = document.querySelector('#chat .section-header h2');
    if (demoTitle && demoTitle.textContent.includes('AI Chat Assistant')) {
        demoTitle.textContent = `🇮🇳 ${t.nav_chat || 'AI Chat Assistant'} - Live Demo`;
    }
    
    // Update modals if they exist
    updateModalLanguage();
    
    console.log('✅ UI language updated successfully');
}

function updateCategoryChips() {
    const lang = currentLanguage;
    const ct = categoryTranslations[lang] || categoryTranslations['en'] || {};
    
    // Update category chips
    document.querySelectorAll('.category-chip').forEach(chip => {
        const category = chip.getAttribute('data-category');
        const categoryInfo = chip.querySelector('.category-info');
        
        if (category && categoryInfo && ct[category]) {
            const nameSpan = categoryInfo.querySelector('.category-name');
            const descSpan = categoryInfo.querySelector('.category-desc');
            
            if (nameSpan) {
                nameSpan.textContent = ct[category] || category;
            }
            if (descSpan) {
                descSpan.textContent = ct[category + '_desc'] || '';
            }
        }
    });
}

function updateModalLanguage() {
    const lang = currentLanguage;
    const t = translations[lang] || translations['en'] || {};
    
    // Update chat modal if it exists
    const chatModalHeader = document.querySelector('#chat-modal .modal-header h2');
    if (chatModalHeader) {
        chatModalHeader.textContent = `🇮🇳 ${t.nav_chat || 'Civic AI Assistant'}`;
    }
    
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        if (lang === 'hi') {
            chatInput.placeholder = 'हिंदी या अंग्रेजी में अपना प्रश्न टाइप करें...';
        } else if (lang === 'bn') {
            chatInput.placeholder = 'বাংলা বা ইংরেজিতে আপনার প্রশ্ন টাইপ করুন...';
        } else if (lang === 'te') {
            chatInput.placeholder = 'తెలుగు లేదా ఇంగ్లీష్‌లో మీ ప్రశ్నను టైప్ చేయండి...';
        } else if (lang === 'ta') {
            chatInput.placeholder = 'தமிழ் அல்லது ஆங்கிலத்தில் உங்கள் கேள்வியை தட்டச்சு செய்யுங்கள்...';
        } else if (lang === 'gu') {
            chatInput.placeholder = 'ગુજરાતી અથવા અંગ્રેજીમાં તમારો પ્રશ્ન ટાઇપ કરો...';
        } else {
            chatInput.placeholder = 'Type your question in Hindi or English...';
        }
    }
    
    // Update services modal if it exists
    const servicesModalHeader = document.querySelector('#services-modal .modal-header h2');
    if (servicesModalHeader) {
        servicesModalHeader.textContent = `🇮🇳 ${t.government_services || 'Bharat Public Services Directory'}`;
    }
    
    const servicesSearch = document.getElementById('services-search');
    if (servicesSearch) {
        if (lang === 'hi') {
            servicesSearch.placeholder = 'सेवाएं खोजें...';
        } else if (lang === 'bn') {
            servicesSearch.placeholder = 'সেবা খুঁজুন...';
        } else if (lang === 'te') {
            servicesSearch.placeholder = 'సేవలను వెతకండి...';
        } else if (lang === 'ta') {
            servicesSearch.placeholder = 'சேவைகளைத் தேடுங்கள்...';
        } else if (lang === 'gu') {
            servicesSearch.placeholder = 'સેવાઓ શોધો...';
        } else {
            servicesSearch.placeholder = 'Search services...';
        }
    }
}

function updateServiceStatistics() {
    const servicesCountElement = document.getElementById('services-count');
    if (servicesCountElement) {
        servicesCountElement.textContent = `${bharatServices.length}+`;
    }
    
    console.log('📊 Service statistics updated');
}

function updateCategoryCounts() {
    const categoryCounts = {};
    bharatServices.forEach(service => {
        const category = service.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Update category chips with counts
    document.querySelectorAll('.category-chip').forEach(chip => {
        const category = chip.getAttribute('data-category');
        if (category && categoryCounts[category]) {
            const currentText = chip.innerHTML;
            if (!currentText.includes('(')) {
                chip.innerHTML = currentText + ` <small>(${categoryCounts[category]})</small>`;
            }
        }
    });
    
    console.log('📊 Category counts updated:', categoryCounts);
}

// ============================================================================
// BUTTON HANDLERS SETUP
// ============================================================================

function setupButtonHandlers() {
    console.log('🔘 Setting up button handlers...');
    
    // Hero section buttons
    const startChatBtn = document.getElementById('start-chat-btn');
    const browseServicesBtn = document.getElementById('browse-services-btn');
    
    if (startChatBtn) {
        startChatBtn.addEventListener('click', openChatInterface);
        console.log('✅ Start chat button connected');
    }
    
    if (browseServicesBtn) {
        browseServicesBtn.addEventListener('click', openServicesInterface);
        console.log('✅ Browse services button connected');
    }
    
    // Feature section buttons
    const featureChatBtn = document.getElementById('feature-chat-btn');
    const featureServicesBtn = document.getElementById('feature-services-btn');
    
    if (featureChatBtn) {
        featureChatBtn.addEventListener('click', openChatInterface);
        console.log('✅ Feature chat button connected');
    }
    
    if (featureServicesBtn) {
        featureServicesBtn.addEventListener('click', openServicesInterface);
        console.log('✅ Feature services button connected');
    }
    
    // Demo section button
    const demoChatBtn = document.getElementById('demo-chat-btn');
    if (demoChatBtn) {
        demoChatBtn.addEventListener('click', openChatInterface);
        console.log('✅ Demo chat button connected');
    }
    
    // Category chips
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            openServicesInterface(category);
        });
    });
    console.log('✅ Category chips connected');
    
    // Example query buttons
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const query = this.getAttribute('data-query');
            openChatInterface(query);
        });
    });
    console.log('✅ Example query buttons connected');
    
    console.log('🎉 All button handlers setup complete!');
}

// ============================================================================
// CHAT INTERFACE
// ============================================================================

function createChatModal() {
    if (document.getElementById('chat-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'chat-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content chat-modal-content">
            <div class="modal-header">
                <h2>🇮🇳 Civic AI Assistant</h2>
                <button class="close-btn" onclick="closeChatInterface()">&times;</button>
            </div>
            <div class="chat-container">
                <div class="chat-messages" id="chat-messages">
                    <div class="ai-message welcome-message">
                        <div class="message-content">
                            <h3>🙏 नमस्ते! Welcome to Civic AI Assistant</h3>
                            <p>I'm here to help you find government services and public information across India.</p>
                            <div class="welcome-features">
                                <div class="feature-item">� <strong>Health Services</strong> - PHC, vaccination, medical aid</div>
                                <div class="feature-item">� <strong>Employment</strong> - PMKVY, skill training, job assistance</div>
                                <div class="feature-item">🏠 <strong>Housing</strong> - PMAY, housing subsidies</div>
                                <div class="feature-item">� <strong>Education</strong> - Libraries, scholarships</div>
                                <div class="feature-item">⚖️ <strong>Legal Aid</strong> - Free legal assistance</div>
                                <div class="feature-item">🚌 <strong>Transportation</strong> - Public transport info</div>
                            </div>
                            <p><em>Ask me anything in Hindi or English!</em></p>
                        </div>
                    </div>
                </div>
                <div class="chat-suggestions" id="chat-suggestions">
                    <button class="suggestion-btn" onclick="sendSuggestion('मुझे स्वास्थ्य सेवा चाहिए')">🏥 Health services</button>
                    <button class="suggestion-btn" onclick="sendSuggestion('How to get skill training?')">💼 Skill training</button>
                    <button class="suggestion-btn" onclick="sendSuggestion('Housing subsidy schemes')">🏠 Housing schemes</button>
                    <button class="suggestion-btn" onclick="sendSuggestion('Free legal aid services')">⚖️ Legal aid</button>
                </div>
                <div class="chat-input-container">
                    <input type="text" id="chat-input" placeholder="Type your question in Hindi or English..." />
                    <button id="send-btn" onclick="sendMessage()">
                        <span class="material-icons">send</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    chatModal = modal;
    
    // Setup enter key for chat input
    document.getElementById('chat-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    console.log('✅ Chat modal created');
}

function openChatInterface(initialQuery = null) {
    console.log('💬 Opening chat interface...');
    
    if (!chatModal) {
        createChatModal();
    }
    
    chatModal.style.display = 'flex';
    
    // Focus on input
    setTimeout(() => {
        const input = document.getElementById('chat-input');
        if (input) {
            if (initialQuery) {
                input.value = initialQuery;
                sendMessage();
            } else {
                input.focus();
            }
        }
    }, 100);
    
    showNotification('Chat interface opened', 'info');
}

function closeChatInterface() {
    if (chatModal) {
        chatModal.style.display = 'none';
        console.log('💬 Chat interface closed');
    }
}

function sendSuggestion(message) {
    const input = document.getElementById('chat-input');
    if (input) {
        input.value = message;
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message || isLoading) return;
    
    console.log('📤 Sending message:', message);
    
    // Add user message to chat
    addMessageToChat('user', message);
    input.value = '';
    
    // Show loading
    isLoading = true;
    const loadingId = addMessageToChat('ai', '🤔 Thinking...', true);
    
    try {
        let response;
        
        if (currentChatSession) {
            // Continue existing chat
            response = await fetch(`/api/chat/continue/${currentChatSession}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, language: currentLanguage })
            });
        } else {
            // Start new chat
            response = await fetch('/api/chat/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, language: currentLanguage })
            });
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.sessionId) {
            currentChatSession = data.sessionId;
        }
        
        // Remove loading message
        removeMessage(loadingId);
        
        // Add AI response
        addMessageToChat('ai', data.response || data.message);
        
        // Update suggestions
        if (data.suggestions && data.suggestions.length > 0) {
            updateChatSuggestions(data.suggestions);
        }
        
        // Show related services if any
        if (data.relatedServices && data.relatedServices.length > 0) {
            addServicesToChat(data.relatedServices);
        }
        
        console.log('✅ Message sent successfully');
        
    } catch (error) {
        console.error('❌ Chat error:', error);
        removeMessage(loadingId);
        addMessageToChat('ai', `Sorry, I'm having trouble right now. Please try again or contact the citizen helpline at 1950.\n\nक्षमा करें, मुझे कुछ समस्या हो रही है। कृपया दोबारा कोशिश करें।`);
        showNotification('Chat error occurred', 'error');
    }
    
    isLoading = false;
}

function addMessageToChat(sender, content, isLoading = false) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message`;
    messageDiv.id = messageId;
    
    if (isLoading) {
        messageDiv.classList.add('loading-message');
    }
    
    const lines = content.split('\n');
    const formattedContent = lines.map(line => {
        if (line.startsWith('**') && line.endsWith('**')) {
            return `<h4>${line.slice(2, -2)}</h4>`;
        }
        return `<p>${line}</p>`;
    }).join('');
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${formattedContent}
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageId;
}

function removeMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
        message.remove();
    }
}

function updateChatSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('chat-suggestions');
    suggestionsContainer.innerHTML = suggestions.map(suggestion => 
        `<button class="suggestion-btn" onclick="sendSuggestion('${suggestion}')">${suggestion}</button>`
    ).join('');
}

function addServicesToChat(services) {
    const messagesContainer = document.getElementById('chat-messages');
    
    const servicesDiv = document.createElement('div');
    servicesDiv.className = 'ai-message services-message';
    
    const servicesHtml = services.map(service => `
        <div class="service-card-mini">
            <h4>${service.name}</h4>
            <p>${service.description.substring(0, 100)}...</p>
            <div class="service-meta">
                <span>📞 ${service.contact.phone}</span>
                <span>🏢 ${service.department}</span>
            </div>
            <button class="btn-small" onclick="showServiceDetails('${service._id}')">View Details</button>
        </div>
    `).join('');
    
    servicesDiv.innerHTML = `
        <div class="message-content">
            <h4>🎯 Related Services Found:</h4>
            <div class="services-grid-mini">
                ${servicesHtml}
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(servicesDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ============================================================================
// SERVICES INTERFACE
// ============================================================================

function createServicesModal() {
    if (document.getElementById('services-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'services-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content services-modal-content">
            <div class="modal-header">
                <h2>🇮🇳 Bharat Public Services Directory</h2>
                <button class="close-btn" onclick="closeServicesInterface()">&times;</button>
            </div>
            <div class="services-container">
                <div class="services-search">
                    <input type="text" id="services-search" placeholder="Search services..." />
                    <select id="category-filter">
                        <option value="">All Categories</option>
                        <option value="healthcare">Healthcare (स्वास्थ्य)</option>
                        <option value="employment">Employment (रोजगार)</option>
                        <option value="education">Education (शिक्षा)</option>
                        <option value="housing">Housing (आवास)</option>
                        <option value="legal">Legal Aid (कानूनी सहायता)</option>
                        <option value="transportation">Transportation (परिवहन)</option>
                        <option value="welfare">Welfare (कल्याण)</option>
                    </select>
                    <button id="search-btn" onclick="filterServices()">
                        <span class="material-icons">search</span>
                    </button>
                </div>
                <div class="services-grid" id="services-grid">
                    <div class="loading-services">
                        <span class="material-icons">hourglass_empty</span>
                        <p>Loading services...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    servicesModal = modal;
    
    // Setup search functionality
    document.getElementById('services-search').addEventListener('input', filterServices);
    document.getElementById('category-filter').addEventListener('change', filterServices);
    
    console.log('✅ Services modal created');
}

function openServicesInterface(category = null) {
    console.log('🔍 Opening services interface...');
    
    if (!servicesModal) {
        createServicesModal();
    }
    
    servicesModal.style.display = 'flex';
    
    // Load services
    displayAllServices();
    
    // Set category filter if provided
    if (category) {
        setTimeout(() => {
            const categoryFilter = document.getElementById('category-filter');
            if (categoryFilter) {
                categoryFilter.value = category;
                filterServices();
            }
        }, 100);
    }
    
    showNotification('Services directory opened', 'info');
}

function closeServicesInterface() {
    if (servicesModal) {
        servicesModal.style.display = 'none';
        console.log('🔍 Services interface closed');
    }
}

function displayAllServices() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;
    
    if (bharatServices.length === 0) {
        servicesGrid.innerHTML = `
            <div class="no-services">
                <span class="material-icons">info</span>
                <h3>No Services Available</h3>
                <p>Please check your connection and try again.</p>
                <button class="btn-contained" onclick="loadBharatServices().then(displayAllServices)">
                    Retry Loading
                </button>
            </div>
        `;
        return;
    }
    
    servicesGrid.innerHTML = bharatServices.map(service => createServiceCard(service)).join('');
    console.log(`📋 Displayed ${bharatServices.length} services`);
}

function createServiceCard(service) {
    const categoryColors = {
        healthcare: '#dc2626',
        employment: '#059669',
        education: '#0284c7',
        housing: '#7c3aed',
        legal: '#ea580c',
        transportation: '#0891b2',
        welfare: '#be185d'
    };
    
    const color = categoryColors[service.category] || '#6b7280';
    
    return `
        <div class="service-card">
            <div class="service-header">
                <h3>${service.name}</h3>
                <span class="service-category" style="background-color: ${color}20; color: ${color};">
                    ${service.category}
                </span>
            </div>
            <p class="service-description">${service.description}</p>
            <div class="service-meta">
                <div class="meta-item">
                    <span class="material-icons">phone</span>
                    ${service.contact.phone}
                </div>
                <div class="meta-item">
                    <span class="material-icons">business</span>
                    ${service.department}
                </div>
                <div class="meta-item">
                    <span class="material-icons">location_on</span>
                    ${service.contact.address.city}
                </div>
                ${service.rating ? `
                <div class="meta-item">
                    <span class="material-icons">star</span>
                    ${service.rating.average}/5 (${service.rating.count} reviews)
                </div>
                ` : ''}
            </div>
            <div class="service-actions">
                <button class="btn-small btn-primary" onclick="showServiceDetails('${service._id}')">
                    <span class="material-icons">info</span>
                    View Details
                </button>
                <button class="btn-small btn-outline" onclick="askAboutService('${service._id}')">
                    <span class="material-icons">chat</span>
                    Ask AI
                </button>
            </div>
        </div>
    `;
}

function filterServices() {
    const searchTerm = document.getElementById('services-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    
    let filteredServices = bharatServices;
    
    if (categoryFilter) {
        filteredServices = filteredServices.filter(service => service.category === categoryFilter);
    }
    
    if (searchTerm) {
        filteredServices = filteredServices.filter(service =>
            service.name.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm) ||
            service.department.toLowerCase().includes(searchTerm) ||
            service.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    const servicesGrid = document.getElementById('services-grid');
    if (filteredServices.length === 0) {
        servicesGrid.innerHTML = `
            <div class="no-services">
                <span class="material-icons">search_off</span>
                <h3>No Services Found</h3>
                <p>Try adjusting your search criteria.</p>
            </div>
        `;
    } else {
        servicesGrid.innerHTML = filteredServices.map(service => createServiceCard(service)).join('');
    }
    
    console.log(`🔍 Filtered to ${filteredServices.length} services`);
}

function showServiceDetails(serviceId) {
    const service = bharatServices.find(s => s._id === serviceId);
    if (!service) {
        showNotification('Service not found', 'error');
        return;
    }
    
    // Create service details modal
    const detailsModal = document.createElement('div');
    detailsModal.className = 'modal service-details-modal';
    detailsModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${service.name}</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="service-details">
                <div class="service-description-full">
                    ${service.description}
                </div>
                
                <div class="details-grid">
                    <div class="details-section">
                        <h3>📞 Contact Information</h3>
                        <div class="contact-info">
                            <p><strong>Phone:</strong> ${service.contact.phone}</p>
                            ${service.contact.email ? `<p><strong>Email:</strong> ${service.contact.email}</p>` : ''}
                            ${service.contact.website ? `<p><strong>Website:</strong> <a href="${service.contact.website}" target="_blank">${service.contact.website}</a></p>` : ''}
                            <p><strong>Address:</strong> ${service.contact.address.street}, ${service.contact.address.city}, ${service.contact.address.state} - ${service.contact.address.zipCode}</p>
                        </div>
                    </div>
                    
                    <div class="details-section">
                        <h3>✅ Eligibility Criteria</h3>
                        <ul class="eligibility-list">
                            ${service.eligibility.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="details-section">
                        <h3>📋 Required Documents</h3>
                        <ul class="requirements-list">
                            ${service.requirements.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    ${service.hours ? `
                    <div class="details-section">
                        <h3>🕒 Operating Hours</h3>
                        <div class="hours-grid">
                            ${Object.entries(service.hours).map(([day, hours]) => 
                                `<div class="hour-item"><strong>${day.charAt(0).toUpperCase() + day.slice(1)}:</strong> ${hours}</div>`
                            ).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${service.schemes && service.schemes.length > 0 ? `
                    <div class="details-section">
                        <h3>🏛️ Related Government Schemes</h3>
                        <div class="schemes-list">
                            ${service.schemes.map(scheme => `<span class="scheme-tag">${scheme}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="service-actions-full">
                    <button class="btn-contained" onclick="askAboutService('${service._id}'); this.closest('.modal').remove();">
                        <span class="material-icons">chat</span>
                        Ask AI About This Service
                    </button>
                    <button class="btn-outline" onclick="this.closest('.modal').remove();">
                        <span class="material-icons">close</span>
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(detailsModal);
    detailsModal.style.display = 'flex';
    
    console.log('📋 Service details shown:', service.name);
}

function askAboutService(serviceId) {
    const service = bharatServices.find(s => s._id === serviceId);
    if (!service) {
        showNotification('Service not found', 'error');
        return;
    }
    
    // Close any open modals except chat
    document.querySelectorAll('.modal').forEach(modal => {
        if (modal.id !== 'chat-modal') {
            modal.style.display = 'none';
        }
    });
    
    // Open chat and ask about the service
    openChatInterface(`Tell me more about ${service.name}`);
    
    console.log('💬 Asked AI about service:', service.name);
}

// ============================================================================
// ACCESSIBILITY & UX FEATURES
// ============================================================================

function setupAccessibility() {
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // Escape key to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('♿ Accessibility features enabled');
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
// GLOBAL FUNCTIONS (for onclick handlers)
// ============================================================================

// Make functions globally available for onclick handlers
window.toggleTheme = toggleTheme;
window.changeLanguage = changeLanguage; // Government-grade function
window.openChatInterface = openChatInterface;
window.closeChatInterface = closeChatInterface;
window.openServicesInterface = openServicesInterface;
window.closeServicesInterface = closeServicesInterface;
window.sendMessage = sendMessage;
window.sendSuggestion = sendSuggestion;
window.showServiceDetails = showServiceDetails;
window.askAboutService = askAboutService;
window.filterServices = filterServices;

// Test function for debugging
window.testLanguageChange = function() {
    console.log('🧪 Testing government language change to Hindi');
    changeLanguage('hi');
};

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

// Monitor performance
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
    
    if (loadTime > 3000) {
        console.warn('⚠️ Slow page load detected');
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('🚨 Global error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// ============================================================================
// INITIALIZATION COMPLETE
// ============================================================================

console.log('🎉 Civic AI Assistant JavaScript loaded successfully!');
console.log('🇮🇳 Ready to serve Indian citizens with AI-powered civic assistance');