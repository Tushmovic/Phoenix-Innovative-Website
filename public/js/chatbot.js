// chatbot.js
document.addEventListener('DOMContentLoaded', function() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    const notificationBadge = document.getElementById('chatNotification');
    
    let isOpen = false;
    
    // Toggle chatbot window
    function toggleChatbot() {
        isOpen = !isOpen;
        chatbotWindow.style.display = isOpen ? 'flex' : 'none';
        
        if (isOpen) {
            chatInput.focus();
            if (notificationBadge) {
                notificationBadge.style.display = 'none';
            }
        }
    }
    
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', toggleChatbot);
    }
    
    if (closeChatbot) {
        closeChatbot.addEventListener('click', toggleChatbot);
    }
    
    // Send message function
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        const typingId = showTypingIndicator();
        
        try {
            // Simulate AI response (replace with actual API call)
            setTimeout(() => {
                removeTypingIndicator(typingId);
                
                let response = "Thank you for your message. Our team will get back to you soon. For immediate assistance, please call +234 913 592 6075.";
                
                if (message.toLowerCase().includes('service')) {
                    response = "We offer Renewable Energy, Network Infrastructure, ISP Services, CCTV Systems, Software Development, and IT Consulting. Which service are you interested in?";
                } else if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
                    response = "Pricing varies based on your specific needs. Please contact our sales team for a customized quote.";
                } else if (message.toLowerCase().includes('contact')) {
                    response = "You can reach us at +234 913 592 6075 or email phoenixinnovative2025@gmail.com";
                } else if (message.toLowerCase().includes('location')) {
                    response = "We are based in Abuja, Nigeria, and serve clients across the country.";
                }
                
                addMessage(response, 'bot');
                
                // Show notification if window is closed
                if (!isOpen && notificationBadge) {
                    notificationBadge.style.display = 'flex';
                }
            }, 1500);
            
        } catch (error) {
            removeTypingIndicator(typingId);
            addMessage('Sorry, I\'m having trouble connecting. Please try again.', 'bot');
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