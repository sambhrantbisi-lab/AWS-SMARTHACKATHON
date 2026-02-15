/**
 * AI Chat Panel - Resizable Side Panel Version
 * Version: 1.0
 * Replaces floating widget with permanent right-side panel
 */

(function() {
  'use strict';

  // Panel state management
  const STORAGE_KEYS = {
    width: 'aiPanelWidth',
    collapsed: 'aiPanelCollapsed'
  };

  const DEFAULT_WIDTH = 400;
  const MIN_WIDTH = 300;
  const MAX_WIDTH = 600;
  const COLLAPSED_WIDTH = 50;

  let panelState = {
    width: parseInt(sessionStorage.getItem(STORAGE_KEYS.width)) || DEFAULT_WIDTH,
    collapsed: sessionStorage.getItem(STORAGE_KEYS.collapsed) === 'true'
  };

  let isResizing = false;
  let chatMessages = [];

  // Create panel HTML
  function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'ai-chat-panel';
    panel.className = 'ai-chat-panel' + (panelState.collapsed ? ' collapsed' : '');
    panel.style.width = panelState.collapsed ? COLLAPSED_WIDTH + 'px' : panelState.width + 'px';

    panel.innerHTML = `
      <div class="ai-chat-resize-handle" title="Drag to resize"></div>
      
      <div class="ai-chat-panel-header">
        <button class="ai-chat-collapse-btn" title="${panelState.collapsed ? 'Expand' : 'Collapse'} panel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${panelState.collapsed 
              ? '<path d="M15 18l-6-6 6-6"/>' 
              : '<path d="M9 18l6-6-6-6"/>'}
          </svg>
        </button>
        <div class="ai-chat-panel-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>
          </svg>
          <span>AI Assistant</span>
        </div>
      </div>

      <div class="ai-chat-panel-content">
        <div class="ai-chat-messages" id="ai-chat-messages">
          <div class="ai-chat-message ai-message">
            <div class="ai-message-content">
              <strong>🤖 AI Assistant</strong>
              <p>Hello! I'm your AI assistant powered by Google Gemini. I can help you with:</p>
              <ul>
                <li>Information about stocks, commodities, and services on this page</li>
                <li>Answering questions about the Digital India Portal</li>
                <li>General assistance and guidance</li>
              </ul>
              <p>Try asking: "What stocks are visible?" or "Tell me about the services"</p>
            </div>
          </div>
        </div>

        <div class="ai-chat-input-container">
          <textarea 
            id="ai-chat-input" 
            placeholder="Ask me anything..."
            rows="2"
          ></textarea>
          <button id="ai-chat-send-btn" class="ai-chat-send-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    return panel;
  }

  // Add panel styles
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .ai-chat-panel {
        position: fixed;
        right: 0;
        top: 0;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        transition: width 0.3s ease;
      }

      .ai-chat-panel.collapsed {
        width: 50px !important;
      }

      .ai-chat-panel.collapsed .ai-chat-panel-title span,
      .ai-chat-panel.collapsed .ai-chat-panel-content {
        display: none;
      }

      .ai-chat-resize-handle {
        position: absolute;
        left: 0;
        top: 0;
        width: 5px;
        height: 100%;
        cursor: ew-resize;
        background: rgba(255, 255, 255, 0.1);
        transition: background 0.2s;
      }

      .ai-chat-resize-handle:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .ai-chat-panel.collapsed .ai-chat-resize-handle {
        cursor: default;
        background: transparent;
      }

      .ai-chat-panel-header {
        display: flex;
        align-items: center;
        padding: 15px;
        background: rgba(0, 0, 0, 0.2);
        color: white;
        flex-shrink: 0;
      }

      .ai-chat-collapse-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        margin-right: 10px;
        transition: background 0.2s;
        flex-shrink: 0;
      }

      .ai-chat-collapse-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .ai-chat-panel-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        font-size: 16px;
      }

      .ai-chat-panel-content {
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
        width: 8px;
      }

      .ai-chat-messages::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
      }

      .ai-chat-messages::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
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
        border-radius: 12px;
        max-width: 100%;
        word-wrap: break-word;
      }

      .ai-message-content {
        background: rgba(255, 255, 255, 0.95);
        color: #333;
      }

      .user-message-content {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        margin-left: auto;
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
        background: rgba(0, 0, 0, 0.2);
        display: flex;
        gap: 10px;
        flex-shrink: 0;
      }

      #ai-chat-input {
        flex: 1;
        padding: 12px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.95);
        color: #333;
        font-size: 14px;
        font-family: inherit;
        resize: none;
        outline: none;
        transition: border-color 0.2s;
      }

      #ai-chat-input:focus {
        border-color: rgba(255, 255, 255, 0.6);
      }

      .ai-chat-send-btn {
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 8px;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #667eea;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .ai-chat-send-btn:hover {
        background: white;
        transform: scale(1.05);
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

      /* Adjust main content */
      body.ai-panel-open {
        margin-right: ${panelState.width}px;
        transition: margin-right 0.3s ease;
      }

      body.ai-panel-collapsed {
        margin-right: ${COLLAPSED_WIDTH}px;
        transition: margin-right 0.3s ease;
      }

      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .ai-chat-panel:not(.collapsed) {
          width: 100% !important;
        }

        body.ai-panel-open {
          margin-right: 0;
        }

        .ai-chat-resize-handle {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Adjust main content width
  function adjustMainContent() {
    document.body.classList.remove('ai-panel-open', 'ai-panel-collapsed');
    
    if (panelState.collapsed) {
      document.body.classList.add('ai-panel-collapsed');
    } else {
      document.body.classList.add('ai-panel-open');
      document.body.style.marginRight = panelState.width + 'px';
    }
  }

  // Toggle collapse/expand
  function toggleCollapse(panel) {
    panelState.collapsed = !panelState.collapsed;
    sessionStorage.setItem(STORAGE_KEYS.collapsed, panelState.collapsed);

    if (panelState.collapsed) {
      panel.classList.add('collapsed');
      panel.style.width = COLLAPSED_WIDTH + 'px';
    } else {
      panel.classList.remove('collapsed');
      panel.style.width = panelState.width + 'px';
    }

    // Update collapse button icon
    const collapseBtn = panel.querySelector('.ai-chat-collapse-btn');
    collapseBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${panelState.collapsed 
          ? '<path d="M15 18l-6-6 6-6"/>' 
          : '<path d="M9 18l6-6-6-6"/>'}
      </svg>
    `;
    collapseBtn.title = panelState.collapsed ? 'Expand panel' : 'Collapse panel';

    adjustMainContent();
  }

  // Setup resize functionality
  function setupResize(panel) {
    const handle = panel.querySelector('.ai-chat-resize-handle');

    handle.addEventListener('mousedown', (e) => {
      if (panelState.collapsed) return;
      isResizing = true;
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing || panelState.collapsed) return;

      const newWidth = window.innerWidth - e.clientX;
      
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        panelState.width = newWidth;
        panel.style.width = newWidth + 'px';
        document.body.style.marginRight = newWidth + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        sessionStorage.setItem(STORAGE_KEYS.width, panelState.width);
      }
    });
  }

  // Gather page context using hotfix
  function gatherContext() {
    try {
      // Use globalThis to access the hotfix function
      if (typeof globalThis.gatherPageContextFixed === 'function') {
        return globalThis.gatherPageContextFixed();
      }
      
      // Fallback context
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

  // Send message to AI
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

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Disable input
    input.disabled = true;
    sendBtn.disabled = true;

    try {
      // Gather context
      const context = gatherContext();

      // Send to API
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

      // Remove loading indicator
      messagesContainer.removeChild(loadingMsg);

      // Add AI response
      const aiMsg = document.createElement('div');
      aiMsg.className = 'ai-chat-message ai-message';
      aiMsg.innerHTML = `
        <div class="ai-message-content">
          <strong>🤖 AI Assistant</strong>
          <p>${formatResponse(data.response)}</p>
        </div>
      `;
      messagesContainer.appendChild(aiMsg);

      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

    } catch (error) {
      console.error('Error sending message:', error);

      // Remove loading indicator
      messagesContainer.removeChild(loadingMsg);

      // Add error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'ai-chat-message ai-message';
      errorMsg.innerHTML = `
        <div class="ai-message-content">
          <strong>🤖 AI Assistant</strong>
          <p>Sorry, I encountered an error. Please try again.</p>
        </div>
      `;
      messagesContainer.appendChild(errorMsg);
    } finally {
      // Re-enable input
      input.disabled = false;
      sendBtn.disabled = false;
      input.value = '';
      input.focus();
    }
  }

  // Format AI response
  function formatResponse(text) {
    // Convert markdown-style formatting to HTML
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
  function setupEventListeners(panel) {
    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send-btn');
    const collapseBtn = panel.querySelector('.ai-chat-collapse-btn');

    // Send button click
    sendBtn.addEventListener('click', () => {
      const message = input.value.trim();
      if (message) {
        sendMessage(message);
      }
    });

    // Enter key to send (Shift+Enter for new line)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const message = input.value.trim();
        if (message) {
          sendMessage(message);
        }
      }
    });

    // Collapse button
    collapseBtn.addEventListener('click', () => {
      toggleCollapse(panel);
    });

    // Keyboard shortcut: Ctrl+B to toggle
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        toggleCollapse(panel);
      }
    });
  }

  // Initialize panel
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Add styles
    addStyles();

    // Create panel
    const panel = createPanel();

    // Setup resize
    setupResize(panel);

    // Setup event listeners
    setupEventListeners(panel);

    // Adjust main content
    adjustMainContent();

    console.log('AI Chat Panel initialized (v1.0)');
  }

  // Start initialization
  init();

})();
