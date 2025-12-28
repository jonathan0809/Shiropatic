// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ?
        '<i class="fas fa-times"></i>' :
        '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const toggleIcon = question.querySelector('.faq-toggle i');

        // Close other open FAQs
        document.querySelectorAll('.faq-answer').forEach(item => {
            if (item !== answer && item.classList.contains('open')) {
                item.classList.remove('open');
                item.previousElementSibling.querySelector('.faq-toggle i').className =
                    'fas fa-chevron-down';
            }
        });

        // Toggle current FAQ
        answer.classList.toggle('open');

        // Update toggle icon
        if (answer.classList.contains('open')) {
            toggleIcon.className = 'fas fa-chevron-up';
        } else {
            toggleIcon.className = 'fas fa-chevron-down';
        }
    });
});

// Social Media Tab Switching
document.querySelectorAll('.social-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');

        // Remove active class from all tabs
        document.querySelectorAll('.social-tab').forEach(t => {
            t.classList.remove('active');
        });

        // Add active class to clicked tab
        tab.classList.add('active');

        // Hide all content
        document.querySelectorAll('.social-content').forEach(content => {
            content.classList.remove('active');
        });

        // Show selected content
        document.getElementById(`${tabId}-content`).classList.add('active');

        // Reload embeds when switching tabs
        setTimeout(() => {
            if (window.instgrm) {
                instgrm.Embeds.process();
            }
            if (window.tiktokEmbed) {
                // TikTok embeds should auto-load
            }
        }, 100);
    });
});

// Initialize Map
function initMap() {
    const mapElement = document.getElementById('map');

    const iframe = document.createElement('iframe');
    iframe.src =
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.8249757174035!2d140.7115609!3d-2.5636911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x686c59007809a82f%3A0x84fa2330136eb181!2sShiropractic!5e0!3m2!1sen!2sid!4v1766731355464!5m2!1sen!2sid';
    iframe.width = '100%';
    iframe.height = '500';
    iframe.style.border = '0';
    iframe.allowfullscreen = '';
    iframe.loading = 'lazy';
    iframe.referrerpolicy = 'no-referrer-when-downgrade';

    mapElement.innerHTML = '';
    mapElement.appendChild(iframe);

    const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                mapElement.classList.add('visible');
                mapObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    mapObserver.observe(mapElement);
}

// Fade-in animation on scroll
function setupScrollAnimations() {
    const fadeElements = document.querySelectorAll(
        '.hero-content, .faq-item, .social-card, .map-embed-container, .feature-card, .video-hero-content, .video-hero-player'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Social Media Embed Loader
function loadSocialEmbeds() {
    // Load Instagram embeds
    if (window.instgrm) {
        instgrm.Embeds.process();
        console.log('Instagram embeds loaded successfully');
    } else {
        const instagramScript = document.createElement('script');
        instagramScript.async = true;
        instagramScript.src = 'https://www.instagram.com/embed.js';
        instagramScript.onload = function () {
            if (window.instgrm) {
                instgrm.Embeds.process();
                console.log('Instagram embeds script loaded dynamically');
            } else {
                console.log('Instagram embed script failed to load');
                showSocialFallback('.instagram-fallback');
            }
        };
        instagramScript.onerror = function () {
            console.log('Failed to load Instagram embed script');
            showSocialFallback('.instagram-fallback');
        };
        document.body.appendChild(instagramScript);
    }

    // Load TikTok embeds
    if (window.tiktokEmbed) {
        console.log('TikTok embeds already loaded');
    } else {
        const tiktokScript = document.createElement('script');
        tiktokScript.async = true;
        tiktokScript.src = 'https://www.tiktok.com/embed.js';
        tiktokScript.onload = function () {
            console.log('TikTok embed script loaded');
            setTimeout(() => {
                const tiktokBlocks = document.querySelectorAll('.tiktok-embed');
                let hasTikTokContent = false;

                tiktokBlocks.forEach(block => {
                    if (block.offsetHeight > 100) {
                        hasTikTokContent = true;
                    }
                });

                if (!hasTikTokContent) {
                    console.log('TikTok embeds not rendered, showing fallback');
                    showSocialFallback('.tiktok-fallback');
                }
            }, 2000);
        };
        tiktokScript.onerror = function () {
            console.log('Failed to load TikTok embed script');
            showSocialFallback('.tiktok-fallback');
        };
        document.body.appendChild(tiktokScript);
    }

    // Set timeout to check if embeds loaded
    setTimeout(() => {
        const instagramBlocks = document.querySelectorAll('.instagram-media');
        let hasInstagramContent = false;

        instagramBlocks.forEach(block => {
            if (block.innerHTML && block.innerHTML.trim().length > 100) {
                hasInstagramContent = true;
            }
        });

        if (!hasInstagramContent) {
            console.log('Instagram embeds not populated, showing fallback');
            showSocialFallback('.instagram-fallback');
        }
    }, 3000);
}

// Show fallback for social media content
function showSocialFallback(selector) {
    document.querySelectorAll(selector).forEach(fallback => {
        fallback.style.display = 'block';
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initMap();
    setupScrollAnimations();

    // Add visible class to first hero section
    const firstHero = document.querySelector('.hero-content');
    if (firstHero) {
        firstHero.classList.add('visible');
    }

    // Load social media embeds
    loadSocialEmbeds();
});

// Header scroll effect
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        header.style.padding = '0';
        document.querySelector('nav').style.padding = '15px 0';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.padding = '';
        document.querySelector('nav').style.padding = '20px 0';
    }
});