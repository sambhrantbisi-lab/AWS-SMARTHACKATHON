/**
 * Language Manager - Centralized Multi-Language Support
 * Version: 1.0
 * Provides comprehensive language switching across all pages
 */

(function() {
  'use strict';

  // Current language state
  let currentLanguage = localStorage.getItem('language') || 'en';
  let translations = {};

  // Load translations from server
  async function loadTranslations() {
    try {
      const response = await fetch('/data/translations.json');
      const data = await response.json();
      translations = data.translations || {};
      console.log('✅ Translations loaded:', Object.keys(translations));
      return true;
    } catch (error) {
      console.error('❌ Failed to load translations:', error);
      return false;
    }
  }

  // Get translation for a key
  function t(key, lang = currentLanguage) {
    if (!translations[lang]) {
      console.warn(`Language ${lang} not found, falling back to English`);
      lang = 'en';
    }
    return translations[lang]?.[key] || translations.en?.[key] || key;
  }

  // Apply translations to page elements
  function applyTranslations() {
    // Find all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = t(key);
      
      // Handle different element types
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.hasAttribute('placeholder')) {
          element.placeholder = translation;
        } else {
          element.value = translation;
        }
      } else {
        element.textContent = translation;
      }
    });

    // Find all elements with data-i18n-html attribute (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      element.innerHTML = t(key);
    });

    // Update language selector
    const langSelector = document.getElementById('languageSelector');
    if (langSelector) {
      langSelector.value = currentLanguage;
    }

    console.log(`🌐 Applied translations for language: ${currentLanguage}`);
  }

  // Change language
  function changeLanguage(lang) {
    if (!translations[lang]) {
      console.error(`Language ${lang} not available`);
      return;
    }

    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Apply translations
    applyTranslations();
    
    // Notify other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    
    // Update AI chat language if available
    if (window.updateAIChatLanguage) {
      window.updateAIChatLanguage(lang);
    }

    console.log(`✅ Language changed to: ${lang}`);
  }

  // Initialize language manager
  async function init() {
    const loaded = await loadTranslations();
    if (loaded) {
      applyTranslations();
    }
  }

  // Export functions to global scope
  window.LanguageManager = {
    init,
    changeLanguage,
    t,
    getCurrentLanguage: () => currentLanguage,
    getAvailableLanguages: () => Object.keys(translations)
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
