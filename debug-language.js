// Debug script to test language functionality
console.log('🧪 Starting language debug test...');

// Test if translations are loaded
fetch('/data/translations.json')
    .then(response => response.json())
    .then(data => {
        console.log('✅ Translations loaded:', Object.keys(data.translations));
        
        // Test Hindi translation
        const hindiTranslations = data.translations.hi;
        console.log('🇮🇳 Hindi translations:', hindiTranslations);
        
        // Test if we can change a simple element
        setTimeout(() => {
            const testElement = document.querySelector('h1');
            if (testElement && hindiTranslations.hero_title) {
                console.log('🔄 Changing title to Hindi...');
                testElement.textContent = hindiTranslations.hero_title;
                console.log('✅ Title changed successfully');
            } else {
                console.log('❌ Could not find element or translation');
            }
        }, 2000);
    })
    .catch(error => {
        console.error('❌ Failed to load translations:', error);
    });

// Test the changeLanguage function directly
setTimeout(() => {
    console.log('🧪 Testing changeLanguage function...');
    if (typeof window.changeLanguage === 'function') {
        console.log('✅ changeLanguage function exists');
        window.changeLanguage('hi');
    } else {
        console.log('❌ changeLanguage function not found');
    }
}, 3000);