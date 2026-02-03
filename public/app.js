// Civic AI Assistant - Enhanced Frontend JavaScript with Chat Rooms & Animations

let currentLanguage = 'en';
let services = [];
let chatSessionId = null;
let currentRoom = 'general';
let isVoiceRecording = false;
let typingTimeout = null;

// Chat room configurations
const chatRooms = {
    general: {
        name: 'General Help',
        description: 'Ask anything about civic services',
        icon: 'fas fa-comments',
        color: '#007bff'
    },
    healthcare: {
        name: 'Healthcare Services',
        description: 'Medical services & insurance',
        icon: 'fas fa-heartbeat',
        color: '#28a745'
    },
    employment: {
        name: 'Employment Help',
        description: 'Jobs & unemployment benefits',
        icon: 'fas fa-briefcase',
        color: '#ffc107'
    },
    housing: {
        name: 'Housing Assistance',
        description: 'Affordable housing & rentals',
        icon: 'fas fa-home',
        color: '#17a2b8'
    },
    education: {
        name: 'Education Resources',
        description: 'Schools & learning programs',
        icon: 'fas fa-graduation-cap',
        color: '#6f42c1'
    },
    emergency: {
        name: 'Emergency Services',
        description: 'Urgent assistance & crisis help',
        icon: 'fas fa-exclamation-triangle',
        color: '#dc3545'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadServices();
    setupAccessibility();
    animateOnScroll();
});

function initializeApp() {
    // Add welcome animation
    setTimeout(() => {
        showNotification('Welcome to Civic AI Assistant! 🎉', 'success');
    }, 1000);
    
    // Initialize chat rooms
    setupChatRooms();
    
    // Add typing animation to inputs
    setupTypingAnimations();
}

function setupEventListeners() {
    // Chat room switching
    document.querySelectorAll('.chat-room-item').forEach(item => {
        item.addEventListener('click', function() {
            switchChatRoom(this.dataset.room);
        });
    });
    
    // Language selector
    document.getElementById('languageSelect').addEventListener('change', function() {
        currentLanguage = this.value;
        showNotification(`Language changed to ${this.options[this.selectedIndex].text}`, 'info');
        updateUILanguage();
    });
    
    // Auto-resize chat input
    const chatInput = document.getElementById('messageInput');
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

function setupChatRooms() {
    const roomsList = document.getElementById('chatRoomsList');
    
    // Add click handlers and animations
    document.querySelectorAll('.chat-room-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('animate__animated', 'animate__fadeInLeft');
        
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(10px)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(0)';
            }
        });
    });
}

function switchChatRoom(roomId) {
    // Update active room
    document.querySelectorAll('.chat-room-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`[data-room="${roomId}"]`).classList.add('active');
    
    currentRoom = roomId;
    const room = chatRooms[roomId];
    
    // Update chat header
    document.getElementById('currentRoomName').textContent = room.name;
    document.getElementById('currentRoomDesc').textContent = room.description;
    
    // Clear chat and add welcome message
    clearChat();
    addWelcomeMessage(room);
    
    // Show room switch notification
    showNotification(`Switched to ${room.name}`, 'info');
    
    // Reset session for new room
    chatSessionId = null;
}

function addWelcomeMessage(room) {
    const welcomeMessages = {
        general: "Welcome to General Help! I can assist you with any civic services questions.",
        healthcare: "Welcome to Healthcare Services! Ask me about medical services, insurance, or health programs.",
        employment: "Welcome to Employment Help! I can help with job searches, unemployment benefits, and career resources.",
        housing: "Welcome to Housing Assistance! Let me help you find affordable housing and rental assistance.",
        education: "Welcome to Education Resources! Ask about schools, programs, and educational opportunities.",
        emergency: "Welcome to Emergency Services! For immediate emergencies, call 911. I can help with crisis resources."
    };
    
    const suggestions = {
        general: ['Find services near me', 'How do I apply for benefits?', 'Contact information', 'Office hours'],
        healthcare: ['Find doctors near me', 'Health insurance help', 'Vaccination clinics', 'Mental health services'],
        employment: ['Job search assistance', 'Unemployment benefits', 'Career training', 'Resume help'],
        housing: ['Affordable housing', 'Rental assistance', 'Housing vouchers', 'Emergency shelter'],
        education: ['School enrollment', 'Adult education', 'Library services', 'Scholarship programs'],
        emergency: ['Crisis hotlines', 'Emergency shelters', 'Food assistance', 'Disaster relief']
    };
    
    setTimeout(() => {
        addMessageToChat('assistant', welcomeMessages[currentRoom], suggestions[currentRoom]);
    }, 500);
}

// Enhanced chat functionality
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message with animation
    addMessageToChat('user', message);
    input.value = '';
    input.style.height = 'auto';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Send to backend with room context
    const requestData = {
        message: message,
        language: currentLanguage,
        room: currentRoom,
        location: { city: 'Sample City', state: 'CA' }
    };
    
    fetch('/api/chat/' + (chatSessionId ? `continue/${chatSessionId}` : 'start'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        hideTypingIndicator();
        
        if (data.sessionId) {
            chatSessionId = data.sessionId;
        }
        
        const response = data.response || 'I apologize, but I encountered an error. Please try again.';
        addMessageToChat('assistant', response, data.suggestions);
        
        // Add related services if available
        if (data.relatedServices && data.relatedServices.length > 0) {
            addServicesCarousel(data.relatedServices);
        }
    })
    .catch(error => {
        console.error('Chat error:', error);
        hideTypingIndicator();
        addMessageToChat('assistant', 'I apologize, but I\'m having trouble connecting right now. Please try again later.');
    });
}

function addMessageToChat(role, content, suggestions = null) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    // Create avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    // Create content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `<strong>${role === 'user' ? 'You' : 'AI Assistant'}:</strong> ${content}`;
    
    // Add suggestions if provided
    if (suggestions && suggestions.length > 0) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'suggestion-chips';
        
        suggestions.forEach(suggestion => {
            const chip = document.createElement('span');
            chip.className = 'suggestion-chip';
            chip.textContent = suggestion;
            chip.onclick = () => quickMessage(suggestion);
            suggestionsDiv.appendChild(chip);
        });
        
        contentDiv.appendChild(suggestionsDiv);
    }
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    // Add animation class
    messageDiv.classList.add('animate__animated');
    messageDiv.classList.add(role === 'user' ? 'animate__fadeInRight' : 'animate__fadeInLeft');
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Add voice playback for assistant messages
    if (role === 'assistant' && document.getElementById('voiceEnabled').checked) {
        addVoicePlayback(contentDiv, content);
    }
}

function addVoicePlayback(contentDiv, text) {
    const voiceBtn = document.createElement('button');
    voiceBtn.className = 'btn btn-sm btn-outline-primary ms-2';
    voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    voiceBtn.onclick = () => speakText(text);
    contentDiv.appendChild(voiceBtn);
}

function addServicesCarousel(services) {
    const messagesContainer = document.getElementById('chatMessages');
    const carouselDiv = document.createElement('div');
    carouselDiv.className = 'message assistant';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = '<strong>Related Services:</strong>';
    
    const servicesContainer = document.createElement('div');
    servicesContainer.className = 'd-flex gap-2 mt-2 overflow-auto';
    
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'card border-0 shadow-sm';
        serviceCard.style.minWidth = '200px';
        serviceCard.innerHTML = `
            <div class="card-body p-2">
                <h6 class="card-title mb-1">${service.name}</h6>
                <p class="card-text small text-muted">${service.description.substring(0, 60)}...</p>
                <button class="btn btn-sm btn-primary" onclick="showServiceDetails('${service._id}')">
                    View Details
                </button>
            </div>
        `;
        servicesContainer.appendChild(serviceCard);
    });
    
    contentDiv.appendChild(servicesContainer);
    carouselDiv.appendChild(avatarDiv);
    carouselDiv.appendChild(contentDiv);
    
    carouselDiv.classList.add('animate__animated', 'animate__fadeInUp');
    messagesContainer.appendChild(carouselDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator.classList.add('show');
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator.classList.remove('show');
}

function quickMessage(message) {
    document.getElementById('messageInput').value = message;
    sendMessage();
}

function clearChat() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = '';
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Enhanced voice functionality
function toggleVoiceInput() {
    const voiceBtn = document.getElementById('voiceBtn');
    
    if (isVoiceRecording) {
        stopVoiceRecording();
    } else {
        startVoiceRecording();
    }
}

function startVoiceRecording() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = currentLanguage;
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = function() {
            isVoiceRecording = true;
            const voiceBtn = document.getElementById('voiceBtn');
            voiceBtn.classList.add('recording');
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            showNotification('Listening... Speak now!', 'info');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('messageInput').value = transcript;
            showNotification('Voice input captured!', 'success');
        };
        
        recognition.onerror = function(event) {
            showNotification('Voice recognition error. Please try again.', 'error');
            stopVoiceRecording();
        };
        
        recognition.onend = function() {
            stopVoiceRecording();
        };
        
        recognition.start();
    } else {
        showNotification('Voice recognition is not supported in your browser.', 'error');
    }
}

function stopVoiceRecording() {
    isVoiceRecording = false;
    const voiceBtn = document.getElementById('voiceBtn');
    voiceBtn.classList.remove('recording');
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Enhanced services functionality
function loadServices() {
    showServicesLoading(true);
    
    fetch('/api/services')
        .then(response => response.json())
        .then(data => {
            services = data.services || [];
            displayServices(services);
            showServicesLoading(false);
        })
        .catch(error => {
            console.error('Error loading services:', error);
            services = getSampleServices();
            displayServices(services);
            showServicesLoading(false);
        });
}

function showServicesLoading(show) {
    const loading = document.getElementById('servicesLoading');
    const servicesList = document.getElementById('servicesList');
    
    if (show) {
        loading.style.display = 'block';
        servicesList.style.display = 'none';
    } else {
        loading.style.display = 'none';
        servicesList.style.display = 'block';
    }
}

function displayServices(servicesToShow) {
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '';
    
    if (servicesToShow.length === 0) {
        servicesList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h5>No services found</h5>
                <p class="text-muted">Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    servicesToShow.forEach((service, index) => {
        const serviceCard = createServiceCard(service);
        serviceCard.style.animationDelay = `${index * 0.1}s`;
        servicesList.appendChild(serviceCard);
    });
}

function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card animate__animated animate__fadeInUp';
    
    const categoryColors = {
        healthcare: '#28a745',
        education: '#007bff',
        employment: '#ffc107',
        housing: '#17a2b8',
        legal: '#6f42c1',
        transportation: '#fd7e14',
        emergency: '#dc3545'
    };
    
    const categoryColor = categoryColors[service.category] || '#6c757d';
    
    card.innerHTML = `
        <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="category-badge" style="background: ${categoryColor}">
                ${getCategoryIcon(service.category)} ${service.category.replace('-', ' ').toUpperCase()}
            </div>
            <div class="text-end">
                <div class="small text-muted">Rating</div>
                <div class="text-warning">
                    ${'★'.repeat(Math.floor(service.rating?.average || 4))}${'☆'.repeat(5 - Math.floor(service.rating?.average || 4))}
                </div>
            </div>
        </div>
        
        <h5 class="mb-3">${service.name}</h5>
        <p class="text-muted mb-3">${service.description}</p>
        
        <div class="row mb-3">
            <div class="col-md-6">
                <div class="mb-2">
                    <strong><i class="fas fa-building me-2"></i>Department:</strong>
                    <div class="small text-muted">${service.department}</div>
                </div>
                ${service.contact.phone ? `
                    <div class="mb-2">
                        <strong><i class="fas fa-phone me-2"></i>Phone:</strong>
                        <div class="small"><a href="tel:${service.contact.phone}">${service.contact.phone}</a></div>
                    </div>
                ` : ''}
                ${service.contact.email ? `
                    <div class="mb-2">
                        <strong><i class="fas fa-envelope me-2"></i>Email:</strong>
                        <div class="small"><a href="mailto:${service.contact.email}">${service.contact.email}</a></div>
                    </div>
                ` : ''}
            </div>
            <div class="col-md-6">
                ${service.contact.address ? `
                    <div class="mb-2">
                        <strong><i class="fas fa-map-marker-alt me-2"></i>Location:</strong>
                        <div class="small text-muted">${service.contact.address.city}, ${service.contact.address.state}</div>
                    </div>
                ` : ''}
                ${service.languages ? `
                    <div class="mb-2">
                        <strong><i class="fas fa-language me-2"></i>Languages:</strong>
                        <div class="small text-muted">${service.languages.join(', ')}</div>
                    </div>
                ` : ''}
                ${service.hours ? `
                    <div class="mb-2">
                        <strong><i class="fas fa-clock me-2"></i>Hours:</strong>
                        <div class="small text-muted">${service.hours.monday || 'Contact for hours'}</div>
                    </div>
                ` : ''}
            </div>
        </div>
        
        ${service.accessibility ? createAccessibilityBadges(service.accessibility) : ''}
        
        <div class="d-flex gap-2 mt-3">
            <button class="btn btn-primary btn-sm" onclick="showServiceDetails('${service._id}')">
                <i class="fas fa-info-circle me-1"></i>View Details
            </button>
            <button class="btn btn-outline-primary btn-sm" onclick="askAboutService('${service.name}')">
                <i class="fas fa-comments me-1"></i>Ask AI
            </button>
            <button class="btn btn-outline-secondary btn-sm" onclick="shareService('${service.name}')">
                <i class="fas fa-share me-1"></i>Share
            </button>
        </div>
    `;
    
    return card;
}

function getCategoryIcon(category) {
    const icons = {
        healthcare: '🏥',
        education: '🎓',
        employment: '💼',
        housing: '🏠',
        legal: '⚖️',
        transportation: '🚌',
        emergency: '🚨'
    };
    return icons[category] || '🏛️';
}

function createAccessibilityBadges(accessibility) {
    let badges = '<div class="mt-2">';
    if (accessibility.wheelchairAccessible) {
        badges += '<span class="badge bg-success me-1"><i class="fas fa-wheelchair me-1"></i>Wheelchair Accessible</span>';
    }
    if (accessibility.signLanguage) {
        badges += '<span class="badge bg-info me-1"><i class="fas fa-sign-language me-1"></i>Sign Language</span>';
    }
    if (accessibility.braille) {
        badges += '<span class="badge bg-warning me-1"><i class="fas fa-braille me-1"></i>Braille</span>';
    }
    badges += '</div>';
    return badges;
}

function filterServices() {
    const searchTerm = document.getElementById('serviceSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let filteredServices = services.filter(service => {
        const matchesSearch = !searchTerm || 
            service.name.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm) ||
            service.department.toLowerCase().includes(searchTerm) ||
            (service.tags && service.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        
        const matchesCategory = !categoryFilter || service.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    displayServices(filteredServices);
    
    // Show filter results notification
    if (searchTerm || categoryFilter) {
        showNotification(`Found ${filteredServices.length} services`, 'info');
    }
}

function showServiceDetails(serviceId) {
    const service = services.find(s => s._id === serviceId);
    if (service) {
        // Create modal or detailed view
        showNotification(`Showing details for ${service.name}`, 'info');
        // In a real app, this would open a detailed modal
    }
}

function askAboutService(serviceName) {
    document.getElementById('messageInput').value = `Tell me more about ${serviceName}`;
    scrollToSection('chat');
    setTimeout(() => {
        sendMessage();
    }, 500);
}

function shareService(serviceName) {
    if (navigator.share) {
        navigator.share({
            title: 'Civic AI Assistant',
            text: `Check out this service: ${serviceName}`,
            url: window.location.href
        });
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(`Check out this service: ${serviceName} - ${window.location.href}`);
        showNotification('Service link copied to clipboard!', 'success');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]} me-2"></i>${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    container.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Accessibility functions
function setupAccessibility() {
    const preferences = JSON.parse(localStorage.getItem('accessibilityPreferences') || '{}');
    
    Object.keys(preferences).forEach(key => {
        if (preferences[key]) {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = true;
                // Apply the setting
                switch(key) {
                    case 'highContrast':
                        toggleHighContrast();
                        break;
                    case 'largeText':
                        toggleLargeText();
                        break;
                    case 'screenReader':
                        toggleScreenReader();
                        break;
                    case 'voiceEnabled':
                        toggleVoice();
                        break;
                }
            }
        }
    });
}

function toggleHighContrast() {
    const isEnabled = document.getElementById('highContrast').checked;
    document.body.classList.toggle('high-contrast', isEnabled);
    saveAccessibilityPreference('highContrast', isEnabled);
    showNotification(`High contrast ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
}

function toggleLargeText() {
    const isEnabled = document.getElementById('largeText').checked;
    document.body.classList.toggle('large-text', isEnabled);
    saveAccessibilityPreference('largeText', isEnabled);
    showNotification(`Large text ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
}

function toggleScreenReader() {
    const isEnabled = document.getElementById('screenReader').checked;
    saveAccessibilityPreference('screenReader', isEnabled);
    showNotification(`Screen reader support ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
}

function toggleVoice() {
    const isEnabled = document.getElementById('voiceEnabled').checked;
    saveAccessibilityPreference('voiceEnabled', isEnabled);
    showNotification(`Voice assistance ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
}

function saveAccessibilityPreference(key, value) {
    const preferences = JSON.parse(localStorage.getItem('accessibilityPreferences') || '{}');
    preferences[key] = value;
    localStorage.setItem('accessibilityPreferences', JSON.stringify(preferences));
}

// Animation and UI enhancements
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    });
    
    document.querySelectorAll('.service-card, .accessibility-features').forEach(el => {
        observer.observe(el);
    });
}

function setupTypingAnimations() {
    const inputs = document.querySelectorAll('input[type="text"], textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('animate__animated', 'animate__pulse');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('animate__animated', 'animate__pulse');
        });
    });
}

function updateUILanguage() {
    // In a full implementation, this would update all UI text based on selected language
    const translations = {
        en: {
            welcome: 'Welcome to Civic AI Assistant!',
            typing: 'AI is typing...'
        },
        es: {
            welcome: '¡Bienvenido al Asistente Cívico AI!',
            typing: 'AI está escribiendo...'
        },
        fr: {
            welcome: 'Bienvenue dans l\'Assistant Civique AI!',
            typing: 'L\'IA tape...'
        }
    };
    
    // Update typing indicator text
    const typingText = document.querySelector('#typingIndicator .message-content span');
    if (typingText && translations[currentLanguage]) {
        typingText.textContent = translations[currentLanguage].typing;
    }
}

// Utility functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    // Add highlight animation
    element.classList.add('animate__animated', 'animate__pulse');
    setTimeout(() => {
        element.classList.remove('animate__animated', 'animate__pulse');
    }, 1000);
}

// Sample services data (fallback)
function getSampleServices() {
    return [
        {
            _id: '1',
            name: 'City Health Department',
            description: 'Provides public health services including vaccinations, health screenings, and disease prevention programs.',
            category: 'healthcare',
            department: 'Health Department',
            contact: {
                phone: '(555) 123-4567',
                email: 'health@city.gov',
                address: { city: 'Sample City', state: 'CA' }
            },
            languages: ['English', 'Spanish'],
            accessibility: { wheelchairAccessible: true, signLanguage: true },
            tags: ['health', 'vaccination', 'screening'],
            rating: { average: 4.5, count: 120 }
        },
        {
            _id: '2',
            name: 'Employment Development Department',
            description: 'Assists job seekers with employment services, unemployment benefits, and career development programs.',
            category: 'employment',
            department: 'Employment Development Department',
            contact: {
                phone: '(555) 234-5678',
                email: 'jobs@edd.gov',
                address: { city: 'Sample City', state: 'CA' }
            },
            languages: ['English', 'Spanish', 'Chinese'],
            accessibility: { wheelchairAccessible: true, signLanguage: true, braille: true },
            tags: ['employment', 'jobs', 'unemployment', 'benefits'],
            rating: { average: 4.2, count: 89 }
        },
        {
            _id: '3',
            name: 'Housing Authority',
            description: 'Provides affordable housing assistance, rental assistance, and housing voucher programs.',
            category: 'housing',
            department: 'Housing Authority',
            contact: {
                phone: '(555) 345-6789',
                email: 'housing@city.gov',
                address: { city: 'Sample City', state: 'CA' }
            },
            languages: ['English', 'Spanish'],
            accessibility: { wheelchairAccessible: true },
            tags: ['housing', 'affordable', 'rental assistance'],
            rating: { average: 4.0, count: 67 }
        }
    ];
}