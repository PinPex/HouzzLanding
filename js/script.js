// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });
}

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// ============================================
// ANALYTICS TRACKING
// ============================================

// Initialize Data Layer
window.dataLayer = window.dataLayer || [];

// Function to send event to GA4 via GTM
function sendGAEvent(eventName, eventData = {}) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventData);
    }
    // Also push to dataLayer for GTM
    window.dataLayer.push({
        event: eventName,
        ...eventData
    });
}

// Function to send event to Yandex Metrika
function sendYandexEvent(targetName) {
    if (typeof ym === 'function') {
        ym('XXXXXXXX', 'reachGoal', 'cta_click', {
            target: targetName
        });
    }
}

// Track all CTA clicks
document.addEventListener('DOMContentLoaded', function() {
    const ctaElements = document.querySelectorAll('[data-analytics="cta-click"]');
    
    ctaElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const ctaName = this.getAttribute('data-cta') || 'unknown';
            const ctaText = this.textContent.trim() || 'unknown';
            
            // Prepare event data
            const eventData = {
                event_category: 'CTA',
                event_label: ctaName,
                value: 1,
                cta_text: ctaText,
                cta_location: ctaName.split('-')[0] || 'unknown'
            };
            
            // Send to GA4
            sendGAEvent('cta_click', eventData);
            
            // Send to Yandex Metrika
            sendYandexEvent(ctaName);
            
            // Log for debugging
            console.log('CTA Clicked:', {
                cta: ctaName,
                text: ctaText,
                href: this.getAttribute('href')
            });
        });
    });
    
    console.log('CTA tracking initialized for ' + ctaElements.length + ' elements');
});

// Track page view
if (typeof gtag === 'function') {
    gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
}

// Track scroll depth
let maxScroll = 0;
document.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll === 25 || maxScroll === 50 || maxScroll === 75 || maxScroll === 100) {
            if (typeof gtag === 'function') {
                gtag('event', 'scroll_depth', {
                    depth: maxScroll + '%'
                });
            }
        }
    }
});

console.log('Analytics initialized successfully');