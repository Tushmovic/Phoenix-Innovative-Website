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
    
    // Add dropdown isolation fix
    setupDropdownIsolation();
});

function setupDropdownIsolation() {
    const servicesDropdown = document.querySelector('.services-hover-dropdown');
    const aboutDropdown = document.querySelector('.about-hover-dropdown');
    const servicesMenu = servicesDropdown?.querySelector('.dropdown-menu');
    const aboutMenu = aboutDropdown?.querySelector('.dropdown-menu');
    
    if (!servicesDropdown || !aboutDropdown) return;
    
    // Track which dropdown is currently active
    let activeDropdown = null;
    
    // Services dropdown events
    servicesDropdown.addEventListener('mouseenter', function() {
        activeDropdown = 'services';
        // Ensure Services menu is on top
        if (servicesMenu) {
            servicesMenu.style.zIndex = '1001';
        }
        if (aboutMenu) {
            aboutMenu.style.zIndex = '1000';
        }
    });
    
    servicesDropdown.addEventListener('mouseleave', function(e) {
        // Check if mouse is moving to Services menu or gap
        const relatedTarget = e.relatedTarget;
        const isMovingToServicesMenu = relatedTarget && (
            relatedTarget === servicesMenu || 
            relatedTarget.closest('.services-dropdown-preview')
        );
        const isMovingToGap = relatedTarget && (
            relatedTarget.classList?.contains('dropdown-gap') ||
            relatedTarget.closest?.('.dropdown-gap')
        );
        
        if (!isMovingToServicesMenu && !isMovingToGap) {
            // Mouse is leaving Services area completely
            setTimeout(() => {
                if (!servicesDropdown.matches(':hover') && 
                    !(servicesMenu && servicesMenu.matches(':hover'))) {
                    activeDropdown = null;
                }
            }, 50);
        }
    });
    
    // Services menu events
    if (servicesMenu) {
        servicesMenu.addEventListener('mouseleave', function(e) {
            // Check if mouse is moving back to Services dropdown or gap
            const relatedTarget = e.relatedTarget;
            const isMovingToServices = relatedTarget && (
                relatedTarget.closest('.services-hover-dropdown')
            );
            const isMovingToGap = relatedTarget && (
                relatedTarget.classList?.contains('dropdown-gap') ||
                relatedTarget.closest?.('.dropdown-gap')
            );
            
            if (!isMovingToServices && !isMovingToGap) {
                // Mouse is leaving Services menu completely
                setTimeout(() => {
                    if (!servicesMenu.matches(':hover') && 
                        !servicesDropdown.matches(':hover')) {
                        activeDropdown = null;
                    }
                }, 50);
            }
        });
    }
    
    // About dropdown events
    aboutDropdown.addEventListener('mouseenter', function() {
        activeDropdown = 'about';
        // Ensure About menu is on top
        if (aboutMenu) {
            aboutMenu.style.zIndex = '1001';
        }
        if (servicesMenu) {
            servicesMenu.style.zIndex = '1000';
        }
    });
    
    aboutDropdown.addEventListener('mouseleave', function(e) {
        // Check if mouse is moving to About menu or gap
        const relatedTarget = e.relatedTarget;
        const isMovingToAboutMenu = relatedTarget && (
            relatedTarget === aboutMenu || 
            relatedTarget.closest('.about-dropdown-preview')
        );
        const isMovingToGap = relatedTarget && (
            relatedTarget.classList?.contains('dropdown-gap') ||
            relatedTarget.closest?.('.dropdown-gap')
        );
        
        if (!isMovingToAboutMenu && !isMovingToGap) {
            // Mouse is leaving About area completely
            setTimeout(() => {
                if (!aboutDropdown.matches(':hover') && 
                    !(aboutMenu && aboutMenu.matches(':hover'))) {
                    activeDropdown = null;
                }
            }, 50);
        }
    });
    
    // About menu events
    if (aboutMenu) {
        aboutMenu.addEventListener('mouseleave', function(e) {
            // Check if mouse is moving back to About dropdown or gap
            const relatedTarget = e.relatedTarget;
            const isMovingToAbout = relatedTarget && (
                relatedTarget.closest('.about-hover-dropdown')
            );
            const isMovingToGap = relatedTarget && (
                relatedTarget.classList?.contains('dropdown-gap') ||
                relatedTarget.closest?.('.dropdown-gap')
            );
            
            if (!isMovingToAbout && !isMovingToGap) {
                // Mouse is leaving About menu completely
                setTimeout(() => {
                    if (!aboutMenu.matches(':hover') && 
                        !aboutDropdown.matches(':hover')) {
                        activeDropdown = null;
                    }
                }, 50);
            }
        });
    }
    
    console.log('Dropdown isolation initialized');
}

function initServicesDropdown() {
    // Get all DOM elements for services
    const serviceItems = document.querySelectorAll('.service-item');
    
    if (serviceItems.length === 0) {
        console.warn('Service items not found. Skipping initialization.');
        return;
    }
    
    // Get preview elements
    const previewImage1 = document.getElementById('servicePreviewImage1');
    const previewImage2 = document.getElementById('servicePreviewImage2');
    const previewTitle = document.getElementById('servicePreviewTitle');
    const previewTitle2 = document.getElementById('servicePreviewTitle2');
    const previewDescription = document.getElementById('servicePreviewDescription');
    const previewDescription2 = document.getElementById('servicePreviewDescription2');
    
    let activeServiceItem = null;
    
    // Function to update preview
    function updatePreview(serviceItem) {
        const serviceId = serviceItem.dataset.service || '';
        
        // Get data from attributes
        let image1Src, image2Src, title, title2, description, description2;
        
        if (serviceItem.dataset.image1 && serviceItem.dataset.image2 && 
            serviceItem.dataset.title && serviceItem.dataset.description && 
            serviceItem.dataset.description2) {
            // Use data attributes
            image1Src = serviceItem.dataset.image1;
            image2Src = serviceItem.dataset.image2;
            title = serviceItem.dataset.title;
            title2 = 'Advanced Solutions';
            description = serviceItem.dataset.description;
            description2 = serviceItem.dataset.description2;
        } else {
            return;
        }
        
        // Update images with fade effect
        if (previewImage1) {
            previewImage1.style.opacity = '0.7';
            setTimeout(() => {
                previewImage1.src = image1Src;
                previewImage1.alt = title;
                previewImage1.style.opacity = '1';
            }, 100);
        }
        
        if (previewImage2) {
            previewImage2.style.opacity = '0.7';
            setTimeout(() => {
                previewImage2.src = image2Src;
                previewImage2.alt = title + ' - Additional';
                previewImage2.style.opacity = '1';
            }, 100);
        }
        
        // Update text
        if (previewTitle) {
            previewTitle.style.opacity = '0.7';
            setTimeout(() => {
                previewTitle.textContent = title;
                previewTitle.style.opacity = '1';
            }, 100);
        }
        
        if (previewTitle2) {
            previewTitle2.style.opacity = '0.7';
            setTimeout(() => {
                previewTitle2.textContent = title2;
                previewTitle2.style.opacity = '1';
            }, 100);
        }
        
        if (previewDescription) {
            previewDescription.style.opacity = '0.7';
            setTimeout(() => {
                previewDescription.textContent = description;
                previewDescription.style.opacity = '1';
            }, 100);
        }
        
        if (previewDescription2) {
            previewDescription2.style.opacity = '0.7';
            setTimeout(() => {
                previewDescription2.textContent = description2;
                previewDescription2.style.opacity = '1';
            }, 100);
        }
        
        // Update button URLs
        const learnMoreBtn = document.querySelector('.services-dropdown-preview .col-lg-4 .btn-warning');
        if (learnMoreBtn) {
            learnMoreBtn.href = `/services/${serviceId}`;
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
        if (firstService) {
            updatePreview(firstService);
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
    
    // Preload images
    function preloadImages() {
        const imageUrls = new Set();
        
        serviceItems.forEach(item => {
            if (item.dataset.image1) imageUrls.add(item.dataset.image1);
            if (item.dataset.image2) imageUrls.add(item.dataset.image2);
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
    
    // Get preview elements
    const aboutImage1 = document.getElementById('aboutPreviewImage1');
    const aboutImage2 = document.getElementById('aboutPreviewImage2');
    const aboutTitle = document.getElementById('aboutPreviewTitle');
    const aboutTitle2 = document.getElementById('aboutPreviewTitle2');
    const aboutDescription = document.getElementById('aboutPreviewDescription');
    const aboutDescription2 = document.getElementById('aboutPreviewDescription2');
    
    let activeAboutItem = null;
    
    // Function to update preview
    function updatePreview(aboutItem) {
        const aboutId = aboutItem.dataset.about || '';
        
        // Get data from attributes
        let image1Src, image2Src, title, title2, description, description2;
        
        if (aboutItem.dataset.image1 && aboutItem.dataset.image2 && 
            aboutItem.dataset.title && aboutItem.dataset.description && 
            aboutItem.dataset.description2) {
            // Use data attributes
            image1Src = aboutItem.dataset.image1;
            image2Src = aboutItem.dataset.image2;
            title = aboutItem.dataset.title;
            title2 = 'Our Journey';
            description = aboutItem.dataset.description;
            description2 = aboutItem.dataset.description2;
        } else {
            return;
        }
        
        // Update images with fade effect
        if (aboutImage1) {
            aboutImage1.style.opacity = '0.7';
            setTimeout(() => {
                aboutImage1.src = image1Src;
                aboutImage1.alt = title;
                aboutImage1.style.opacity = '1';
            }, 100);
        }
        
        if (aboutImage2) {
            aboutImage2.style.opacity = '0.7';
            setTimeout(() => {
                aboutImage2.src = image2Src;
                aboutImage2.alt = title + ' - Additional';
                aboutImage2.style.opacity = '1';
            }, 100);
        }
        
        // Update text
        if (aboutTitle) {
            aboutTitle.style.opacity = '0.7';
            setTimeout(() => {
                aboutTitle.textContent = title;
                aboutTitle.style.opacity = '1';
            }, 100);
        }
        
        if (aboutTitle2) {
            aboutTitle2.style.opacity = '0.7';
            setTimeout(() => {
                aboutTitle2.textContent = title2;
                aboutTitle2.style.opacity = '1';
            }, 100);
        }
        
        if (aboutDescription) {
            aboutDescription.style.opacity = '0.7';
            setTimeout(() => {
                aboutDescription.textContent = description;
                aboutDescription.style.opacity = '1';
            }, 100);
        }
        
        if (aboutDescription2) {
            aboutDescription2.style.opacity = '0.7';
            setTimeout(() => {
                aboutDescription2.textContent = description2;
                aboutDescription2.style.opacity = '1';
            }, 100);
        }
        
        // Update button URLs
        const learnMoreBtn = document.querySelector('.about-dropdown-preview .col-lg-4 .btn-warning');
        if (learnMoreBtn) {
            learnMoreBtn.href = `/about/${aboutId}`;
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
        if (firstAbout) {
            updatePreview(firstAbout);
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
    
    // Preload images
    function preloadImages() {
        const imageUrls = new Set();
        
        aboutItems.forEach(item => {
            if (item.dataset.image1) imageUrls.add(item.dataset.image1);
            if (item.dataset.image2) imageUrls.add(item.dataset.image2);
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