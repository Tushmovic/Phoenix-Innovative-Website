// chatbot.js - Improved version with better error handling and API integration

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