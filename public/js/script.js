// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Services Dropdown
    initServicesDropdown();
    
    // Initialize About Dropdown
    initAboutDropdown();
    
    // Add simple fix for dropdown persistence
    setupDropdownPersistence();
});

function setupDropdownPersistence() {
    // This simple function ensures dropdowns stay open when moving to them
    // CSS already handles most of this with the gap solution
    
    console.log('Dropdown persistence initialized');
    
    // Just ensure dropdowns stay open when hovering over their content
    document.querySelectorAll('.services-dropdown-preview, .about-dropdown-preview').forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            // Keep dropdown visible
            this.style.display = 'block';
        });
        
        dropdown.addEventListener('mouseleave', function(e) {
            // Let CSS handle hiding with delay
            const relatedTarget = e.relatedTarget;
            const parent = this.closest('.services-hover-dropdown, .about-hover-dropdown');
            
            // Check if mouse is moving back to parent or gap
            if (relatedTarget && parent && 
                (relatedTarget.closest('.services-hover-dropdown') === parent ||
                 relatedTarget.closest('.about-hover-dropdown') === parent ||
                 relatedTarget.classList.contains('dropdown-gap') ||
                 (relatedTarget.parentElement && relatedTarget.parentElement.classList.contains('dropdown-gap')))) {
                // Don't hide - mouse is still in the dropdown area
                return;
            }
        });
    });
}

function initServicesDropdown() {
    // Get all DOM elements for services
    const serviceItems = document.querySelectorAll('.service-item');
    
    if (serviceItems.length === 0) {
        console.warn('Service items not found. Skipping initialization.');
        return;
    }
    
    // Hide all service preview groups initially
    function hideAllServicePreviews() {
        document.querySelectorAll('.service-preview-group').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    // Function to show specific service previews
    function showServicePreview(serviceId) {
        hideAllServicePreviews();
        
        // Show the two preview columns for this service
        const preview1 = document.getElementById(`preview-${serviceId}`);
        const preview2 = document.getElementById(`preview-${serviceId}-2`);
        
        if (preview1) preview1.style.display = 'block';
        if (preview2) preview2.style.display = 'block';
    }
    
    let activeServiceItem = null;
    
    // Function to update preview - MODIFIED to use the new preview groups
    function updatePreview(serviceItem) {
        const serviceId = serviceItem.dataset.service || '';
        
        // Show the corresponding preview groups
        if (serviceId) {
            showServicePreview(serviceId);
        }
        
        // Update active state
        setActiveService(serviceItem);
    }
    
    // Set active service item
    function setActiveService(serviceItem) {
        // Remove active class from all items
        serviceItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to hovered item
        serviceItem.classList.add('active');
        activeServiceItem = serviceItem;
    }
    
    // Initialize with first service
    function initializePreview() {
        const firstService = serviceItems[0];
        if (firstService && firstService.dataset.service) {
            showServicePreview(firstService.dataset.service);
            setActiveService(firstService);
        }
    }
    
    // Add event listeners
    function setupEventListeners() {
        serviceItems.forEach(item => {
            // Mouse enter event
            item.addEventListener('mouseenter', function() {
                updatePreview(this);
            });
            
            // Click event for mobile
            item.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    updatePreview(this);
                    
                    const previewArea = document.querySelector('.service-preview-area');
                    if (previewArea) {
                        previewArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            });
        });
    }
    
    // Preload images - UPDATED to use the new preview group images
    function preloadImages() {
        const imageUrls = new Set();
        
        // Get all images from service preview groups
        document.querySelectorAll('.service-preview-group img').forEach(img => {
            if (img.src) imageUrls.add(img.src);
        });
        
        // Preload images
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    // Initialize everything
    preloadImages();
    initializePreview();
    setupEventListeners();
    
    console.log('Services dropdown initialized successfully.');
}

function initAboutDropdown() {
    // Get all DOM elements for about
    const aboutItems = document.querySelectorAll('.about-item');
    
    if (aboutItems.length === 0) {
        console.warn('About items not found. Skipping initialization.');
        return;
    }
    
    // Hide all about preview groups initially
    function hideAllAboutPreviews() {
        document.querySelectorAll('.about-preview-group').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    // Function to show specific about previews
    function showAboutPreview(aboutId) {
        hideAllAboutPreviews();
        
        // Show the two preview columns for this about item
        const preview1 = document.getElementById(`preview-${aboutId}`);
        const preview2 = document.getElementById(`preview-${aboutId}-2`);
        
        if (preview1) preview1.style.display = 'block';
        if (preview2) preview2.style.display = 'block';
    }
    
    let activeAboutItem = null;
    
    // Function to update preview - MODIFIED to use the new preview groups
    function updatePreview(aboutItem) {
        const aboutId = aboutItem.dataset.about || '';
        
        // Show the corresponding preview groups
        if (aboutId) {
            showAboutPreview(aboutId);
        }
        
        // Update active state
        setActiveAbout(aboutItem);
    }
    
    // Set active about item
    function setActiveAbout(aboutItem) {
        // Remove active class from all items
        aboutItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to hovered item
        aboutItem.classList.add('active');
        activeAboutItem = aboutItem;
    }
    
    // Initialize with first about item
    function initializePreview() {
        const firstAbout = aboutItems[0];
        if (firstAbout && firstAbout.dataset.about) {
            showAboutPreview(firstAbout.dataset.about);
            setActiveAbout(firstAbout);
        }
    }
    
    // Add event listeners
    function setupEventListeners() {
        aboutItems.forEach(item => {
            // Mouse enter event
            item.addEventListener('mouseenter', function() {
                updatePreview(this);
            });
            
            // Click event for mobile
            item.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    updatePreview(this);
                    
                    const previewArea = document.querySelector('.about-preview-area');
                    if (previewArea) {
                        previewArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            });
        });
    }
    
    // Preload images - UPDATED to use the new preview group images
    function preloadImages() {
        const imageUrls = new Set();
        
        // Get all images from about preview groups
        document.querySelectorAll('.about-preview-group img').forEach(img => {
            if (img.src) imageUrls.add(img.src);
        });
        
        // Preload images
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    // Initialize everything
    preloadImages();
    initializePreview();
    setupEventListeners();
    
    console.log('About dropdown initialized successfully.');
}