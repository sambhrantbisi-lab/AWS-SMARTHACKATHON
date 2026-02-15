/**
 * AI Chat Floating Window - Mobile-Friendly with Multi-Language Support
 * Version: 2.1
 * Fixed: Drag functionality - resolved variable name conflict that caused window to disappear
 * Replaces side panel with floating draggable window
 */

(function() {
  'use strict';

  // Multi-language translations
  const translations = {
    en: {
      title: 'AI Assistant',
      placeholder: 'Ask me anything...',
      send: 'Send',
      welcome: 'Hello! I\'m your AI assistant powered by Google Gemini.',
      capabilities: 'I can help you with:',
      cap1: 'Information about stocks, commodities, and services on this page',
      cap2: 'Answering questions about the Digital India Portal',
      cap3: 'General assistance and guidance',
      tryAsking: 'Try asking: "What stocks are visible?" or "Tell me about the services"',
      minimize: 'Minimize',
      close: 'Close',
      dragToMove: 'Drag to move'
    },
    hi: {
      title: 'एआई सहायक',
      placeholder: 'मुझसे कुछ भी पूछें...',
      send: 'भेजें',
      welcome: 'नमस्ते! मैं Google Gemini द्वारा संचालित आपका एआई सहायक हूं।',
      capabilities: 'मैं आपकी मदद कर सकता हूं:',
      cap1: 'इस पृष्ठ पर स्टॉक, वस्तुओं और सेवाओं के बारे में जानकारी',
      cap2: 'डिजिटल इंडिया पोर्टल के बारे में प्रश्नों के उत्तर',
      cap3: 'सामान्य सहायता और मार्गदर्शन',
      tryAsking: 'पूछने का प्रयास करें: "कौन से स्टॉक दिखाई दे रहे हैं?" या "सेवाओं के बारे में बताएं"',
      minimize: 'छोटा करें',
      close: 'बंद करें',
      dragToMove: 'स्थानांतरित करने के लिए खींचें'
    },
    ta: {
      title: 'AI உதவியாளர்',
      placeholder: 'என்னிடம் எதையும் கேளுங்கள்...',
      send: 'அனுப்பு',
      welcome: 'வணக்கம்! நான் Google Gemini மூலம் இயக்கப்படும் உங்கள் AI உதவியாளர்.',
      capabilities: 'நான் உங்களுக்கு உதவ முடியும்:',
      cap1: 'இந்தப் பக்கத்தில் உள்ள பங்குகள், பொருட்கள் மற்றும் சேவைகள் பற்றிய தகவல்',
      cap2: 'டிஜிட்டல் இந்தியா போர்ட்டல் பற்றிய கேள்விகளுக்கு பதில்கள்',
      cap3: 'பொதுவான உதவி மற்றும் வழிகாட்டுதல்',
      tryAsking: 'கேட்க முயற்சிக்கவும்: "என்ன பங்குகள் தெரியும்?" அல்லது "சேவைகள் பற்றி சொல்லுங்கள்"',
      minimize: 'சிறிதாக்கு',
      close: 'மூடு',
      dragToMove: 'நகர்த்த இழுக்கவும்'
    },
    te: {
      title: 'AI సహాయకుడు',
      placeholder: 'నన్ను ఏదైనా అడగండి...',
      send: 'పంపు',
      welcome: 'నమస్కారం! నేను Google Gemini ద్వారా శక్తివంతం చేయబడిన మీ AI సహాయకుడిని.',
      capabilities: 'నేను మీకు సహాయం చేయగలను:',
      cap1: 'ఈ పేజీలో ఉన్న స్టాక్స్, వస్తువులు మరియు సేవల గురించి సమాచారం',
      cap2: 'డిజిటల్ ఇండియా పోర్టల్ గురించి ప్రశ్నలకు సమాధానాలు',
      cap3: 'సాధారణ సహాయం మరియు మార్గదర్శకత్వం',
      tryAsking: 'అడగడానికి ప్రయత్నించండి: "ఏ స్టాక్స్ కనిపిస్తున్నాయి?" లేదా "సేవల గురించి చెప్పండి"',
      minimize: 'చిన్నదిగా చేయండి',
      close: 'మూసివేయండి',
      dragToMove: 'తరలించడానికి లాగండి'
    },
    bn: {
      title: 'AI সহায়ক',
      placeholder: 'আমাকে যেকোনো কিছু জিজ্ঞাসা করুন...',
      send: 'পাঠান',
      welcome: 'হ্যালো! আমি Google Gemini দ্বারা চালিত আপনার AI সহায়ক।',
      capabilities: 'আমি আপনাকে সাহায্য করতে পারি:',
      cap1: 'এই পৃষ্ঠায় স্টক, পণ্য এবং পরিষেবা সম্পর্কে তথ্য',
      cap2: 'ডিজিটাল ইন্ডিয়া পোর্টাল সম্পর্কে প্রশ্নের উত্তর',
      cap3: 'সাধারণ সহায়তা এবং নির্দেশনা',
      tryAsking: 'জিজ্ঞাসা করার চেষ্টা করুন: "কোন স্টক দৃশ্যমান?" বা "পরিষেবা সম্পর্কে বলুন"',
      minimize: 'ছোট করুন',
      close: 'বন্ধ করুন',
      dragToMove: 'সরাতে টেনে আনুন'
    }
  };

  // State management
  let currentLanguage = localStorage.getItem('language') || 'en';
  let isMinimized = false; // Always start expanded
  let windowPosition = JSON.parse(localStorage.getItem('aiChatPosition') || '{"x": null, "y": null}');
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  // Get translation
  function t(key) {
    return translations[currentLanguage]?.[key] || translations.en[key];
  }

  // Create floating window HTML
  function createFloatingWindow() {
    const window = document.createElement('div');
    window.id = 'ai-chat-floating';
    window.className = 'ai-chat-floating' + (isMinimized ? ' minimized' : '');
    
    // Set position if saved
    if (windowPosition.x !== null && windowPosition.y !== null) {
      window.style.left = windowPosition.x + 'px';
      window.style.top = windowPosition.y + 'px';
    }

    window.innerHTML = `
      <div class="ai-chat-header" id="ai-chat-header">
        <div class="ai-chat-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>
          </svg>
          <span>${t('title')}</span>
        </div>
        <div class="ai-chat-controls">
          <button class="ai-chat-control-btn" id="ai-chat-minimize" title="${t('minimize')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="ai-chat-content">
        <div class="ai-chat-messages" id="ai-chat-messages">
          <div class="ai-chat-message ai-message">
            <div class="ai-message-content">
              <strong>🤖 ${t('title')}</strong>
              <p>${t('welcome')}</p>
              <p><strong>${t('capabilities')}</strong></p>
              <ul>
                <li>${t('cap1')}</li>
                <li>${t('cap2')}</li>
                <li>${t('cap3')}</li>
              </ul>
              <p><em>${t('tryAsking')}</em></p>
            </div>
          </div>
        </div>

        <div class="ai-chat-input-container">
          <textarea 
            id="ai-chat-input" 
            placeholder="${t('placeholder')}"
            rows="2"
          ></textarea>
          <button id="ai-chat-send-btn" class="ai-chat-send-btn" title="${t('send')}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="ai-chat-fab" id="ai-chat-fab">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>
        </svg>
      </div>
    `;

    document.body.appendChild(window);
    return window;
  }

  // Add styles
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .ai-chat-floating {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 380px;
        max-width: calc(100vw - 40px);
        height: 500px;
        max-height: calc(100vh - 100px);
        background: #ffffff;
        border: 6px solid #000000;
        box-shadow: 12px 12px 0 rgba(0, 0, 0, 0.3);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
      }

      .ai-chat-floating.minimized {
        width: 60px;
        height: 60px;
        border-radius: 0;
        cursor: pointer;
      }

      .ai-chat-floating.minimized .ai-chat-content,
      .ai-chat-floating.minimized .ai-chat-header .ai-chat-title span,
      .ai-chat-floating.minimized .ai-chat-controls {
        display: none;
      }

      .ai-chat-floating.minimized .ai-chat-header {
        padding: 0;
        background: transparent;
        justify-content: center;
        align-items: center;
        height: 100%;
      }

      .ai-chat-floating.minimized .ai-chat-fab {
        display: flex;
      }

      .ai-chat-fab {
        display: none;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: white;
      }

      .ai-chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: #7b2cbf;
        color: white;
        cursor: move;
        user-select: none;
        flex-shrink: 0;
        border-bottom: 4px solid #000000;
      }

      .ai-chat-header:active {
        cursor: grabbing;
      }

      .ai-chat-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        font-size: 14px;
        font-family: 'Space Mono', monospace;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .ai-chat-controls {
        display: flex;
        gap: 8px;
      }

      .ai-chat-control-btn {
        background: #000000;
        border: 3px solid #ffffff;
        border-radius: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        transition: all 0.2s;
      }

      .ai-chat-control-btn:hover {
        background: #ffffff;
        color: #000000;
        border-color: #000000;
      }

      .ai-chat-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
      }

      .ai-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .ai-chat-messages::-webkit-scrollbar {
        width: 6px;
      }

      .ai-chat-messages::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
      }

      .ai-chat-messages::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
      }

      .ai-chat-message {
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .ai-message-content,
      .user-message-content {
        padding: 12px 16px;
        border-radius: 0;
        max-width: 100%;
        word-wrap: break-word;
        border: 3px solid #000000;
      }

      .ai-message-content {
        background: #ffffff;
        color: #333;
      }

      .user-message-content {
        background: #7b2cbf;
        color: white;
        margin-left: auto;
        border-color: #000000;
      }

      .ai-message-content strong {
        display: block;
        margin-bottom: 8px;
        color: #667eea;
      }

      .ai-message-content p {
        margin: 8px 0;
        line-height: 1.6;
      }

      .ai-message-content ul {
        margin: 8px 0;
        padding-left: 20px;
      }

      .ai-message-content li {
        margin: 4px 0;
        line-height: 1.5;
      }

      .ai-chat-input-container {
        padding: 15px;
        background: #f5f5f5;
        display: flex;
        gap: 10px;
        flex-shrink: 0;
        border-top: 4px solid #000000;
      }

      #ai-chat-input {
        flex: 1;
        padding: 12px;
        border: 3px solid #000000;
        border-radius: 0;
        background: #ffffff;
        color: #333;
        font-size: 14px;
        font-family: 'Space Grotesk', sans-serif;
        resize: none;
        outline: none;
        transition: border-color 0.2s;
      }

      #ai-chat-input:focus {
        border-color: #7b2cbf;
      }

      .ai-chat-send-btn {
        background: #7b2cbf;
        border: 3px solid #000000;
        border-radius: 0;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #ffffff;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .ai-chat-send-btn:hover {
        background: #9d4edd;
        transform: translate(2px, 2px);
        box-shadow: -2px -2px 0 #000000;
      }

      .ai-chat-send-btn:active {
        transform: translate(4px, 4px);
        box-shadow: none;
      }

      .ai-chat-send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .ai-chat-loading {
        display: flex;
        gap: 4px;
        padding: 12px 16px;
      }

      .ai-chat-loading span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        animation: bounce 1.4s infinite ease-in-out both;
      }

      .ai-chat-loading span:nth-child(1) {
        animation-delay: -0.32s;
      }

      .ai-chat-loading span:nth-child(2) {
        animation-delay: -0.16s;
      }

      @keyframes bounce {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .ai-chat-floating {
          width: calc(100vw - 20px);
          height: calc(100vh - 100px);
          bottom: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }

        .ai-chat-floating.minimized {
          width: 56px;
          height: 56px;
          left: auto;
          right: 10px;
          bottom: 10px;
        }
      }

      /* Dragging state */
      .ai-chat-floating.dragging {
        transition: none;
        cursor: grabbing;
      }
    `;
    document.head.appendChild(style);
  }

  // Setup dragging
  function setupDragging(chatWindow) {
    const header = document.getElementById('ai-chat-header');

    header.addEventListener('mousedown', startDrag);
    header.addEventListener('touchstart', startDrag);

    function startDrag(e) {
      if (isMinimized) return;
      if (e.target.closest('.ai-chat-control-btn')) return;

      isDragging = true;
      chatWindow.classList.add('dragging');

      const rect = chatWindow.getBoundingClientRect();
      const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

      dragOffset.x = clientX - rect.left;
      dragOffset.y = clientY - rect.top;

      e.preventDefault();
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);

    function drag(e) {
      if (!isDragging) return;

      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

      let newX = clientX - dragOffset.x;
      let newY = clientY - dragOffset.y;

      // Keep within viewport
      const maxX = window.innerWidth - chatWindow.offsetWidth;
      const maxY = window.innerHeight - chatWindow.offsetHeight;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      chatWindow.style.left = newX + 'px';
      chatWindow.style.top = newY + 'px';
      chatWindow.style.right = 'auto';
      chatWindow.style.bottom = 'auto';

      e.preventDefault();
    }

    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);

    function stopDrag() {
      if (isDragging) {
        isDragging = false;
        chatWindow.classList.remove('dragging');

        // Save position
        windowPosition = {
          x: parseInt(chatWindow.style.left),
          y: parseInt(chatWindow.style.top)
        };
        localStorage.setItem('aiChatPosition', JSON.stringify(windowPosition));
      }
    }
  }

  // Toggle minimize
  function toggleMinimize(chatWindow) {
    isMinimized = !isMinimized;
    localStorage.setItem('aiChatMinimized', isMinimized);

    if (isMinimized) {
      chatWindow.classList.add('minimized');
    } else {
      chatWindow.classList.remove('minimized');
    }
  }

  // Close window
  function closeWindow(chatWindow) {
    chatWindow.style.opacity = '0';
    chatWindow.style.transform = 'scale(0.8)';
    setTimeout(() => {
      chatWindow.remove();
    }, 300);
  }

  // Update language
  function updateLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Reload window with new language
    const chatWindow = document.getElementById('ai-chat-floating');
    if (chatWindow) {
      chatWindow.remove();
      init();
    }
  }

  // Listen for language changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'language' && e.newValue !== currentLanguage) {
      updateLanguage(e.newValue);
    }
  });

  // Also listen for direct language selector changes
  document.addEventListener('DOMContentLoaded', () => {
    const langSelector = document.getElementById('languageSelector') || document.getElementById('language-select');
    if (langSelector) {
      langSelector.addEventListener('change', (e) => {
        updateLanguage(e.target.value);
      });
    }
  });

  // Gather context (reuse from panel)
  function gatherContext() {
    try {
      if (typeof globalThis.gatherPageContextFixed === 'function') {
        return globalThis.gatherPageContextFixed();
      }
      
      return {
        page: window.location.pathname,
        pageName: document.title || 'Digital India Portal',
        description: 'User is viewing the Digital India Portal',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error gathering context:', error);
      return {
        page: window.location.pathname,
        error: 'Context gathering failed'
      };
    }
  }

  // Send message
  async function sendMessage(message) {
    const messagesContainer = document.getElementById('ai-chat-messages');
    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send-btn');

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-chat-message user-message';
    userMsg.innerHTML = `
      <div class="user-message-content">
        ${escapeHtml(message)}
      </div>
    `;
    messagesContainer.appendChild(userMsg);

    // Add loading indicator
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'ai-chat-message ai-message';
    loadingMsg.innerHTML = `
      <div class="ai-message-content">
        <div class="ai-chat-loading">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    messagesContainer.appendChild(loadingMsg);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    input.disabled = true;
    sendBtn.disabled = true;

    try {
      const context = gatherContext();

      const response = await fetch('/api/ai/ai-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      messagesContainer.removeChild(loadingMsg);

      const aiMsg = document.createElement('div');
      aiMsg.className = 'ai-chat-message ai-message';
      aiMsg.innerHTML = `
        <div class="ai-message-content">
          <strong>🤖 ${t('title')}</strong>
          <p>${formatResponse(data.response)}</p>
        </div>
      `;
      messagesContainer.appendChild(aiMsg);

      messagesContainer.scrollTop = messagesContainer.scrollHeight;

    } catch (error) {
      console.error('Error sending message:', error);

      messagesContainer.removeChild(loadingMsg);

      const errorMsg = document.createElement('div');
      errorMsg.className = 'ai-chat-message ai-message';
      errorMsg.innerHTML = `
        <div class="ai-message-content">
          <strong>🤖 ${t('title')}</strong>
          <p>Sorry, I encountered an error. Please try again.</p>
        </div>
      `;
      messagesContainer.appendChild(errorMsg);
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      input.value = '';
      input.focus();
    }
  }

  // Format response
  function formatResponse(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Setup event listeners
  function setupEventListeners(chatWindow) {
    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send-btn');
    const minimizeBtn = document.getElementById('ai-chat-minimize');
    const fab = document.getElementById('ai-chat-fab');

    sendBtn.addEventListener('click', () => {
      const message = input.value.trim();
      if (message) {
        sendMessage(message);
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const message = input.value.trim();
        if (message) {
          sendMessage(message);
        }
      }
    });

    minimizeBtn.addEventListener('click', () => {
      toggleMinimize(chatWindow);
    });

    // Click FAB to restore
    fab.addEventListener('click', () => {
      toggleMinimize(chatWindow);
    });

    // Click minimized window to restore
    chatWindow.addEventListener('click', (e) => {
      if (isMinimized && !e.target.closest('.ai-chat-control-btn')) {
        toggleMinimize(chatWindow);
      }
    });
  }

  // Initialize
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    addStyles();
    const chatWindow = createFloatingWindow();
    setupDragging(chatWindow);
    setupEventListeners(chatWindow);

    console.log('AI Chat Floating Window initialized (v2.1) - Language:', currentLanguage);
  }

  init();

})();
