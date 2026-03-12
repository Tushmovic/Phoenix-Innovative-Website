// floating-buttons-fix.js
// Ensures floating buttons are always visible

(function() {
    'use strict';
    
    // Function to force buttons visible
    function forceButtonsVisible() {
        const floatingButtons = document.querySelector('.floating-buttons');
        const whatsappBtn = document.querySelector('.float-whatsapp');
        const chatbotBtn = document.querySelector('.float-chatbot');
        
        if (floatingButtons) {
            floatingButtons.style.setProperty('visibility', 'visible', 'important');
            floatingButtons.style.setProperty('opacity', '1', 'important');
            floatingButtons.style.setProperty('display', 'flex', 'important');
            floatingButtons.style.setProperty('position', 'fixed', 'important');
            floatingButtons.style.setProperty('bottom', '30px', 'important');
            floatingButtons.style.setProperty('right', '30px', 'important');
            floatingButtons.style.setProperty('z-index', '9999999999', 'important');
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
    }
    
    // Run immediately
    forceButtonsVisible();
    
    // Run after DOM is fully loaded
    document.addEventListener('DOMContentLoaded', forceButtonsVisible);
    
    // Run after window loads
    window.addEventListener('load', forceButtonsVisible);
    
    // Run on scroll (in case something hides them)
    window.addEventListener('scroll', forceButtonsVisible);
    
    // Run periodically to ensure visibility
    setInterval(forceButtonsVisible, 1000);
    
    // Run on any DOM changes
    const observer = new MutationObserver(forceButtonsVisible);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    
})();