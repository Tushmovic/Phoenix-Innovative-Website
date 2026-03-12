// chatbot.js - Improved version with better error handling and API integration

// ===== VISIBILITY FIX - Ensure floating buttons are always visible =====
(function() {
    // Add immediate style to force visibility
    const style = document.createElement('style');
    style.textContent = `
        .floating-buttons { 
            visibility: visible !important; 
            opacity: 1 !important; 
            display: flex !important; 
            position: fixed !important;
            bottom: 30px !important;
            right: 30px !important;
            z-index: 9999999999 !important;
        }
        .float-whatsapp, .float-chatbot { 
            visibility: visible !important; 
            opacity: 1 !important; 
            display: flex !important; 
        }
        @media (max-width: 768px) {
            .floating-buttons {
                bottom: 15px !important;
                right: 15px !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Force visibility immediately
    const forceVisibility = function() {
        const floatingButtons = document.querySelector('.floating-buttons');
        const whatsappBtn = document.querySelector('.float-whatsapp');
        const chatbotBtn = document.querySelector('.float-chatbot');
        
        if (floatingButtons) {
            floatingButtons.style.setProperty('visibility', 'visible', 'important');
            floatingButtons.style.setProperty('opacity', '1', 'important');
            floatingButtons.style.setProperty('display', 'flex', 'important');
        }
        
        if (whatsappBtn) {
            whatsappBtn.style.setProperty('visibility', 'visible', 'important');
            whatsappBtn.style.setProperty('opacity', '1', 'important');
            whatsappBtn.style.setProperty('display', 'flex', 'important');
        }
        
        if (chatbotBtn) {
            chatbotBtn.style.setProperty('visibility', 'visible', 'important');
            chatbotBtn.style.setProperty('opacity', '1', 'important');
            chatbotBtn.style.setProperty('display', 'flex', 'important');
        }
    };
    
    // Run immediately
    forceVisibility();
    
    // Run again after a tiny delay
    setTimeout(forceVisibility, 100);
    setTimeout(forceVisibility, 500);
})();

// ===== MAIN CHATBOT FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    const notificationBadge = document.getElementById('chatNotification');
    
    // Check if elements exist
    if (!chatbotWindow || !chatbotToggle) {
        console.warn('Chatbot elements not found');
        return;
    }
    
    // Force buttons visible again after DOM is loaded
    const floatingButtons = document.querySelector('.floating-buttons');
    if (floatingButtons) {
        floatingButtons.style.setProperty('visibility', 'visible', 'important');
        floatingButtons.style.setProperty('opacity', '1', 'important');
        floatingButtons.style.setProperty('display', 'flex', 'important');
    }
    
    let isOpen = false;
    
    // Toggle chatbot window
    function toggleChatbot(e) {
        if (e) e.stopPropagation();
        isOpen = !isOpen;
        
        if (isOpen) {
            chatbotWindow.classList.add('active');
            if (chatInput) chatInput.focus();
            if (notificationBadge) notificationBadge.style.display = 'none';
        } else {
            chatbotWindow.classList.remove('active');
        }
        
        // Ensure buttons remain visible after toggle
        setTimeout(() => {
            const whatsappBtn = document.querySelector('.float-whatsapp');
            const chatbotBtn = document.querySelector('.float-chatbot');
            if (whatsappBtn) {
                whatsappBtn.style.setProperty('visibility', 'visible', 'important');
                whatsappBtn.style.setProperty('opacity', '1', 'important');
            }
            if (chatbotBtn) {
                chatbotBtn.style.setProperty('visibility', 'visible', 'important');
                chatbotBtn.style.setProperty('opacity', '1', 'important');
            }
        }, 10);
    }
    
    // Event listeners
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', toggleChatbot);
    }
    
    if (closeChatbot) {
        closeChatbot.addEventListener('click', toggleChatbot);
    }
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (isOpen && 
            !chatbotWindow.contains(e.target) && 
            !chatbotToggle.contains(e.target)) {
            toggleChatbot();
        }
    });
    
    // Send message function
    async function sendMessage() {
        if (!chatInput || !chatMessages) return;
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        const typingId = showTypingIndicator();
        
        try {
            // Call the API endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Remove typing indicator
            removeTypingIndicator(typingId);
            
            // Add bot response
            addMessage(data.reply || 'Thank you for your message. Our team will contact you soon.', 'bot');
            
            // Show notification if window is closed
            if (!isOpen && notificationBadge) {
                notificationBadge.style.display = 'flex';
                // Auto-hide notification after 5 seconds
                setTimeout(() => {
                    if (notificationBadge) notificationBadge.style.display = 'none';
                }, 5000);
            }
            
        } catch (error) {
            console.error('Chatbot error:', error);
            removeTypingIndicator(typingId);
            
            // Fallback response
            let fallbackResponse = "Thank you for your message. For immediate assistance, please call +234 913 592 6075 or email phoenixinnovative2025@gmail.com";
            
            // Simple keyword matching as fallback
            const lowerMsg = message.toLowerCase();
            if (lowerMsg.includes('service')) {
                fallbackResponse = "We offer Renewable Energy, Network Infrastructure, ISP Services, CCTV Systems, Software Development, and IT Consulting.";
            } else if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
                fallbackResponse = "Please contact our sales team for a customized quote based on your specific needs.";
            } else if (lowerMsg.includes('contact') || lowerMsg.includes('phone')) {
                fallbackResponse = "You can reach us at +234 913 592 6075 or email phoenixinnovative2025@gmail.com";
            } else if (lowerMsg.includes('location') || lowerMsg.includes('address')) {
                fallbackResponse = "We are based in Abuja, Nigeria, and serve clients across the country.";
            }
            
            addMessage(fallbackResponse, 'bot');
        }
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `<div class="${sender}-message">${text}</div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message';
        typingDiv.id = id;
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }
    
    // Remove typing indicator
    function removeTypingIndicator(id) {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }
    
    // Send message on button click
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    // Send message on Enter key
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Show notification after 30 seconds if chatbot not opened
    setTimeout(() => {
        if (!isOpen && notificationBadge) {
            notificationBadge.style.display = 'flex';
        }
    }, 30000);
});

// ===== ADDITIONAL VISIBILITY CHECKS =====
// Run after window loads
window.addEventListener('load', function() {
    const whatsappBtn = document.querySelector('.float-whatsapp');
    const chatbotBtn = document.querySelector('.float-chatbot');
    
    if (whatsappBtn) {
        whatsappBtn.style.setProperty('visibility', 'visible', 'important');
        whatsappBtn.style.setProperty('opacity', '1', 'important');
    }
    if (chatbotBtn) {
        chatbotBtn.style.setProperty('visibility', 'visible', 'important');
        chatbotBtn.style.setProperty('opacity', '1', 'important');
    }
});

// Run on scroll (in case something hides them)
window.addEventListener('scroll', function() {
    const whatsappBtn = document.querySelector('.float-whatsapp');
    const chatbotBtn = document.querySelector('.float-chatbot');
    
    if (whatsappBtn && whatsappBtn.style.visibility !== 'visible') {
        whatsappBtn.style.setProperty('visibility', 'visible', 'important');
    }
    if (chatbotBtn && chatbotBtn.style.visibility !== 'visible') {
        chatbotBtn.style.setProperty('visibility', 'visible', 'important');
    }
});

// Periodic check (every 2 seconds) to ensure visibility
setInterval(function() {
    const whatsappBtn = document.querySelector('.float-whatsapp');
    const chatbotBtn = document.querySelector('.float-chatbot');
    
    if (whatsappBtn && window.getComputedStyle(whatsappBtn).visibility !== 'visible') {
        whatsappBtn.style.setProperty('visibility', 'visible', 'important');
        whatsappBtn.style.setProperty('opacity', '1', 'important');
    }
    if (chatbotBtn && window.getComputedStyle(chatbotBtn).visibility !== 'visible') {
        chatbotBtn.style.setProperty('visibility', 'visible', 'important');
        chatbotBtn.style.setProperty('opacity', '1', 'important');
    }
}, 2000);