// animations.js - Advanced transitions and animations

document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initParallaxEffects();
    initTextReveal();
    initMagneticButtons();
    initCounterAnimation();
    initSplitScreenAnimation();
    initVideoBackgrounds();
    initPageTransition();
    initSmoothScroll();
});

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
    const sections = document.querySelectorAll('.reveal-section');
    const staggerElements = document.querySelectorAll('.stagger-children');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it's a stagger container, animate children
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    staggerElements.forEach(element => observer.observe(element));
    
    // Also observe individual elements with reveal class
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ===== PARALLAX EFFECT =====
function initParallaxEffects() {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxSections.forEach(section => {
            const speed = section.dataset.speed || 0.5;
            const yPos = -(scrollY * speed);
            section.style.backgroundPositionY = `${yPos}px`;
        });
    });
}

// ===== TEXT REVEAL ANIMATION =====
function initTextReveal() {
    const textElements = document.querySelectorAll('.text-reveal');
    
    textElements.forEach(element => {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = words.map(word => 
            `<span style="display: inline-block; margin-right: 0.25rem;">${word}</span>`
        ).join(' ');
        
        const spans = element.querySelectorAll('span');
        
        spans.forEach((span, index) => {
            span.style.animationDelay = `${index * 0.1}s`;
        });
    });
}

// ===== MAGNETIC BUTTONS =====
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-button');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ===== COUNTER ANIMATION =====
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target) || 0;
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50; // 50 steps
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

// ===== SPLIT SCREEN ANIMATION =====
function initSplitScreenAnimation() {
    const splitContainers = document.querySelectorAll('.split-screen-container');
    
    splitContainers.forEach(container => {
        const leftContent = container.querySelector('.split-left');
        const rightContent = container.querySelector('.split-right');
        
        if (leftContent && rightContent) {
            leftContent.classList.add('split-screen-left');
            rightContent.classList.add('split-screen-right');
        }
    });
}

// ===== VIDEO BACKGROUNDS =====
function initVideoBackgrounds() {
    const videos = document.querySelectorAll('.video-background video');
    
    videos.forEach(video => {
        // Ensure video plays
        video.play().catch(e => console.log('Video autoplay prevented:', e));
        
        // Loop video
        video.addEventListener('ended', () => {
            video.play();
        });
    });
}

// ===== PAGE TRANSITION =====
function initPageTransition() {
    // Add page transition class to body
    document.body.classList.add('page-transition');
    
    // Handle internal links with smooth transition
    document.querySelectorAll('a:not([target="_blank"])').forEach(link => {
        const href = link.getAttribute('href');
        
        if (href && !href.startsWith('#') && !href.startsWith('http')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Add exit animation
                document.body.style.animation = 'pageExit 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            });
        }
    });
}

// Add keyframe for page exit
const style = document.createElement('style');
style.textContent = `
@keyframes pageExit {
    0% {
        opacity: 1;
        transform: scale(1) translateY(0);
        filter: blur(0);
    }
    100% {
        opacity: 0;
        transform: scale(0.98) translateY(-20px);
        filter: blur(8px);
    }
}`;
document.head.appendChild(style);

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== CURSOR EFFECT (Optional) =====
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// Optional cursor styles - add to CSS if you want this effect
const cursorStyles = `
.custom-cursor {
    width: 20px;
    height: 20px;
    border: 2px solid var(--phoenix-sunset);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s, width 0.2s, height 0.2s;
    transform: translate(-50%, -50%);
}

.cursor-hover {
    width: 40px;
    height: 40px;
    border-color: var(--phoenix-electric);
    background: rgba(67, 97, 238, 0.1);
}`;