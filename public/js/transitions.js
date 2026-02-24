// transitions.js - Section-specific transitions

document.addEventListener('DOMContentLoaded', function() {
    initHeroTransitions();
    initCardTransitions();
    initGalleryTransitions();
    initTimelineTransitions();
});

// ===== HERO SECTION TRANSITIONS =====
function initHeroTransitions() {
    const heroContent = document.querySelector('.hero-content .container');
    
    if (heroContent) {
        const elements = heroContent.querySelectorAll('h1, p, a');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.5, 0, 0, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 300 + (index * 200));
        });
    }
}

// ===== CARD TRANSITIONS =====
function initCardTransitions() {
    const cards = document.querySelectorAll('.service-image-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('card-ripple');
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });
}

// Add ripple styles
const rippleStyles = `
.card-ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 107, 53, 0.3);
    animation: ripple 1s ease-out;
    pointer-events: none;
    z-index: 1;
}

@keyframes ripple {
    0% {
        width: 0;
        height: 0;
        opacity: 0.5;
    }
    100% {
        width: 500px;
        height: 500px;
        opacity: 0;
    }
}`;

document.head.insertAdjacentHTML('beforeend', `<style>${rippleStyles}</style>`);

// ===== GALLERY TRANSITIONS =====
function initGalleryTransitions() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            galleryItems.forEach(other => {
                if (other !== item) {
                    other.style.opacity = '0.3';
                }
            });
        });
        
        item.addEventListener('mouseleave', () => {
            galleryItems.forEach(other => {
                other.style.opacity = '1';
            });
        });
    });
}

// ===== TIMELINE TRANSITIONS =====
function initTimelineTransitions() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('timeline-visible');
            }
        });
    }, { threshold: 0.5 });
    
    timelineItems.forEach(item => observer.observe(item));
}

// Add timeline styles
const timelineStyles = `
.timeline-item {
    opacity: 0;
    transform: translateX(-30px);
    transition: all 0.6s ease;
}

.timeline-item:nth-child(even) {
    transform: translateX(30px);
}

.timeline-item.timeline-visible {
    opacity: 1;
    transform: translateX(0);
}`;

document.head.insertAdjacentHTML('beforeend', `<style>${timelineStyles}</style>`);