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
    // Get all DOM elements
    const serviceItems = document.querySelectorAll('.service-item');
    const previewImage = document.getElementById('servicePreviewImage');
    const previewTitle = document.getElementById('servicePreviewTitle');
    const previewDescription = document.getElementById('servicePreviewDescription');
    const servicesDropdown = document.querySelector('.services-hover-dropdown');
    let activeServiceItem = null;
    
    // Default service data (fallback in case data attributes aren't set)
    const defaultServices = {
        'renewable-energy': {
            image: '/images/services/renewable-energy.jpg',
            title: 'Renewable Energy & Solar',
            description: 'Harness the power of nature with our comprehensive renewable energy solutions. We design and install solar systems that reduce energy costs and environmental impact while providing reliable power for your operations.'
        },
        'network-infrastructure': {
            image: '/images/services/network-infrastructure.jpg',
            title: 'Network Infrastructure',
            description: 'Build robust and scalable network infrastructure with our expert solutions. From cabling to core networking equipment, we ensure reliable connectivity and optimal performance for your business operations.'
        },
        'isp-internet': {
            image: '/images/services/isp-internet.jpg',
            title: 'ISP & Internet Services',
            description: 'Get reliable, high-speed internet connectivity with our ISP services. We provide dedicated business internet solutions with guaranteed uptime, security, and technical support to keep your business connected.'
        },
        'cctv-security': {
            image: '/images/services/cctv-security.jpg',
            title: 'CCTV & Security Systems',
            description: 'Protect your assets with our advanced CCTV and security solutions. We design and install comprehensive surveillance systems with remote monitoring, analytics, and 24/7 support for complete peace of mind.'
        },
        'web-development': {
            image: '/images/services/web-development.jpg',
            title: 'Web Development',
            description: 'Create a powerful online presence with our custom web development services. We build responsive, secure, and scalable websites and web applications that drive engagement and business growth.'
        },
        'it-consulting': {
            image: '/images/services/it-consulting.jpg',
            title: 'IT Consulting & Procurement',
            description: 'Optimize your IT strategy with our expert consulting services. We provide technology assessment, procurement solutions, and strategic planning to align your IT investments with business objectives.'
        }
    };
    
    // Initialize with first service
    function initializePreview() {
        if (serviceItems.length > 0) {
            const firstService = serviceItems[0];
            const serviceId = firstService.dataset.service || 'renewable-energy';
            
            // Use data attributes or fallback to default data
            const imageSrc = firstService.dataset.image || defaultServices[serviceId]?.image || '';
            const title = firstService.dataset.title || defaultServices[serviceId]?.title || '';
            const description = firstService.dataset.description || defaultServices[serviceId]?.description || '';
            
            updatePreview(imageSrc, title, description);
            setActiveService(firstService);
        }
    }
    
    // Update preview with new service data
    function updatePreview(imageSrc, title, description) {
        if (!previewImage || !previewTitle || !previewDescription) return;
        
        // Add fade effect for image
        if (previewImage) {
            previewImage.classList.remove('fade-in');
            void previewImage.offsetWidth; // Trigger reflow
            previewImage.classList.add('fade-in');
            
            // Update image with smooth transition
            previewImage.style.opacity = '0.7';
            setTimeout(() => {
                previewImage.src = imageSrc;
                previewImage.alt = title;
                previewImage.style.opacity = '1';
            }, 150);
        }
        
        // Update title and description
        if (previewTitle) {
            previewTitle.style.opacity = '0.8';
            setTimeout(() => {
                previewTitle.textContent = title;
                previewTitle.style.opacity = '1';
            }, 150);
        }
        
        if (previewDescription) {
            previewDescription.style.opacity = '0.8';
            setTimeout(() => {
                previewDescription.textContent = description;
                previewDescription.style.opacity = '1';
            }, 150);
        }
    }
    
    // Set active service item
    function setActiveService(serviceItem) {
        // Remove active class from all items
        serviceItems.forEach(item => {
            item.classList.remove('active');
            item.style.backgroundColor = '';
            item.style.borderLeftColor = '';
        });
        
        // Add active class to clicked/hovered item
        if (serviceItem) {
            serviceItem.classList.add('active');
            serviceItem.style.backgroundColor = '#f0f7ff';
            serviceItem.style.borderLeftColor = '#0d6efd';
            activeServiceItem = serviceItem;
        }
    }
    
    // Handle service item hover
    function handleServiceHover(event) {
        const serviceItem = event.currentTarget;
        const serviceId = serviceItem.dataset.service || '';
        
        // Get data from attributes or use defaults
        let imageSrc, title, description;
        
        if (serviceItem.dataset.image && serviceItem.dataset.title && serviceItem.dataset.description) {
            // Use data attributes if available
            imageSrc = serviceItem.dataset.image;
            title = serviceItem.dataset.title;
            description = serviceItem.dataset.description;
        } else if (serviceId && defaultServices[serviceId]) {
            // Use default data
            imageSrc = defaultServices[serviceId].image;
            title = defaultServices[serviceId].title;
            description = defaultServices[serviceId].description;
        } else {
            // Fallback to first service
            imageSrc = defaultServices['renewable-energy'].image;
            title = defaultServices['renewable-energy'].title;
            description = defaultServices['renewable-energy'].description;
        }
        
        updatePreview(imageSrc, title, description);
        setActiveService(serviceItem);
    }
    
    // Handle service item mouse leave
    function handleServiceMouseLeave(event) {
        // Only reset if mouse leaves the entire services list
        const relatedTarget = event.relatedTarget;
        
        // Check if we're moving to another service item
        if (relatedTarget && relatedTarget.classList && relatedTarget.classList.contains('service-item')) {
            return; // Don't reset if moving to another service
        }
        
        // Check if we're moving to the preview area
        if (relatedTarget && (
            relatedTarget.closest('.service-preview-area') || 
            relatedTarget.classList.contains('service-preview-image') ||
            relatedTarget.classList.contains('service-preview-title') ||
            relatedTarget.classList.contains('service-preview-description')
        )) {
            return; // Don't reset if moving to preview area
        }
        
        // Reset to active service after delay
        setTimeout(() => {
            if (!document.querySelector('.service-item:hover') && activeServiceItem) {
                const serviceId = activeServiceItem.dataset.service || '';
                
                if (activeServiceItem.dataset.image && activeServiceItem.dataset.title && activeServiceItem.dataset.description) {
                    updatePreview(
                        activeServiceItem.dataset.image,
                        activeServiceItem.dataset.title,
                        activeServiceItem.dataset.description
                    );
                } else if (serviceId && defaultServices[serviceId]) {
                    updatePreview(
                        defaultServices[serviceId].image,
                        defaultServices[serviceId].title,
                        defaultServices[serviceId].description
                    );
                }
                setActiveService(activeServiceItem);
            }
        }, 100);
    }
    
    // Handle dropdown mouse leave
    function handleDropdownMouseLeave(event) {
        const relatedTarget = event.relatedTarget;
        
        // Check if we're moving to a service item or preview area
        if (relatedTarget && (
            relatedTarget.closest('.services-list') ||
            relatedTarget.closest('.service-preview-area') ||
            relatedTarget.classList.contains('service-item')
        )) {
            return; // Still inside dropdown
        }
        
        // Reset to active service
        if (activeServiceItem) {
            const serviceId = activeServiceItem.dataset.service || '';
            
            if (activeServiceItem.dataset.image && activeServiceItem.dataset.title && activeServiceItem.dataset.description) {
                updatePreview(
                    activeServiceItem.dataset.image,
                    activeServiceItem.dataset.title,
                    activeServiceItem.dataset.description
                );
            } else if (serviceId && defaultServices[serviceId]) {
                updatePreview(
                    defaultServices[serviceId].image,
                    defaultServices[serviceId].title,
                    defaultServices[serviceId].description
                );
            }
            setActiveService(activeServiceItem);
        }
    }
    
    // Add event listeners
    function setupEventListeners() {
        // Add hover event to each service item
        serviceItems.forEach(item => {
            item.addEventListener('mouseenter', handleServiceHover);
            item.addEventListener('mouseleave', handleServiceMouseLeave);
            
            // Also handle click for mobile/touch devices
            item.addEventListener('click', function(event) {
                // Only prevent default if it's a touch device and we want to show preview
                if (window.innerWidth <= 992) {
                    event.preventDefault();
                    handleServiceHover(event);
                    
                    // Scroll preview into view on mobile
                    const previewArea = document.querySelector('.service-preview-area');
                    if (previewArea) {
                        previewArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            });
        });
        
        // Add mouse leave event to dropdown
        const dropdownMenu = document.querySelector('.services-dropdown-preview');
        if (dropdownMenu) {
            dropdownMenu.addEventListener('mouseleave', handleDropdownMouseLeave);
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            // Reset active state on mobile
            if (window.innerWidth <= 992 && activeServiceItem) {
                setActiveService(activeServiceItem);
            }
        });
    }
    
    // Preload images for smoother transitions
    function preloadImages() {
        const imageUrls = new Set();
        
        // Collect unique image URLs from data attributes
        serviceItems.forEach(item => {
            if (item.dataset.image) {
                imageUrls.add(item.dataset.image);
            }
        });
        
        // Also add default images
        Object.values(defaultServices).forEach(service => {
            if (service.image) {
                imageUrls.add(service.image);
            }
        });
        
        // Preload images
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    // Initialize everything
    function init() {
        if (serviceItems.length === 0 || !previewImage || !previewTitle || !previewDescription) {
            console.warn('Services dropdown elements not found. Skipping initialization.');
            return;
        }
        
        preloadImages();
        initializePreview();
        setupEventListeners();
        
        console.log('Services dropdown initialized successfully.');
    }
    
    // Start initialization
    init();
});