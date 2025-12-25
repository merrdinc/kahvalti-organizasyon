// ===== DATA LOADER FOR HOMEPAGE =====
// This script loads data from localStorage and populates the homepage

document.addEventListener('DOMContentLoaded', function() {
    loadSiteData();
});

function loadSiteData() {
    const data = getSiteData();

    if (data) {
        loadColorSettings(data.general);
        loadGeneralSettings(data.general);
        loadHeroSection(data.hero);
        loadAboutSection(data.about, data.general);
        loadServicesSection(data.services, data.general);
        loadGallerySection(data.gallery, data.general);
        loadContactSection(data.contact, data.general);
        loadFooterSection(data.footer);
    }
}

// ===== LOAD COLOR SETTINGS =====
function loadColorSettings(general) {
    if (!general || !general.colors) return;

    const colors = general.colors;
    const root = document.documentElement;

    if (colors.primary) root.style.setProperty('--primary-color', colors.primary);
    if (colors.secondary) root.style.setProperty('--secondary-color', colors.secondary);
    if (colors.accent) root.style.setProperty('--accent-color', colors.accent);
    if (colors.background) root.style.setProperty('--light-bg', colors.background);
    if (colors.text) root.style.setProperty('--text-dark', colors.text);
}

function getSiteData() {
    const storedData = localStorage.getItem('siteData');
    if (storedData) {
        return JSON.parse(storedData);
    }
    return null;
}

// ===== LOAD GENERAL SETTINGS =====
function loadGeneralSettings(general) {
    if (!general) return;

    // Update page title
    if (general.siteTitle) {
        document.title = general.siteTitle;
    }

    // Update logo/site name
    const logoElement = document.querySelector('.logo h1');
    const logoContainer = document.querySelector('.logo');

    if (logoContainer) {
        if (general.siteLogo && general.siteLogo.trim() !== '') {
            // Use image logo
            logoContainer.innerHTML = `<img src="${general.siteLogo}" alt="${general.siteName || 'Logo'}" class="logo-image">`;
        } else if (general.siteName && logoElement) {
            // Use text logo
            logoElement.textContent = general.siteName;
        }
    }

    // Update navigation menu
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && general.menu && general.menu.length > 0) {
        const menuLinks = navMenu.querySelectorAll('a');
        const menuItems = general.menu;

        menuLinks.forEach((link, index) => {
            if (menuItems[index]) {
                link.textContent = menuItems[index];
            }
        });
    }
}

// ===== LOAD HERO SECTION =====
function loadHeroSection(hero) {
    if (!hero) return;

    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroSection = document.querySelector('.hero');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');

    if (heroTitle) heroTitle.textContent = hero.title;
    if (heroSubtitle) heroSubtitle.textContent = hero.subtitle;

    // Update hero buttons
    if (heroButtons.length >= 2) {
        if (hero.button1) heroButtons[0].textContent = hero.button1;
        if (hero.button2) heroButtons[1].textContent = hero.button2;
    }

    // Handle hero slider with multiple images
    if (hero.slides && hero.slides.length > 0) {
        initHeroSlider(hero);
    } else if (hero.backgroundImage) {
        // Fallback to single image
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.backgroundImage = `url('${hero.backgroundImage}')`;
        }
    }

    // Apply overlay style
    applyOverlayStyle(hero.overlayStyle || 'dark');

    // Initialize particles if enabled
    if (hero.particles && hero.particles !== 'none') {
        initParticles(hero.particles);
    }
}

// ===== HERO SLIDER =====
let heroSlideIndex = 0;
let heroSliderInterval;

function initHeroSlider(hero) {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Remove existing hero backgrounds
    const existingBgs = heroSection.querySelectorAll('.hero-bg, .hero-slide');
    existingBgs.forEach(bg => bg.remove());

    // Create slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'hero-slider-container';

    // Add slides
    hero.slides.forEach((slide, index) => {
        const slideEl = document.createElement('div');
        slideEl.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        slideEl.style.backgroundImage = `url('${slide.url}')`;
        slideEl.dataset.effect = hero.sliderEffect || 'fade';
        sliderContainer.appendChild(slideEl);
    });

    // Insert slider before overlay
    const heroOverlay = heroSection.querySelector('.hero-overlay');
    heroSection.insertBefore(sliderContainer, heroOverlay);

    // Start auto-slide
    const speed = (hero.sliderSpeed || 5) * 1000;
    if (heroSliderInterval) clearInterval(heroSliderInterval);

    if (hero.slides.length > 1) {
        heroSliderInterval = setInterval(() => {
            changeHeroSlide(hero.sliderEffect || 'fade');
        }, speed);
    }
}

function changeHeroSlide(effect) {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    const currentSlide = slides[heroSlideIndex];
    heroSlideIndex = (heroSlideIndex + 1) % slides.length;
    const nextSlide = slides[heroSlideIndex];

    // Apply effect class
    currentSlide.classList.remove('active');
    currentSlide.classList.add('exiting');

    nextSlide.classList.add('active', 'entering');

    setTimeout(() => {
        currentSlide.classList.remove('exiting');
        nextSlide.classList.remove('entering');
    }, 1000);
}

// ===== OVERLAY STYLES =====
function applyOverlayStyle(style) {
    const overlay = document.querySelector('.hero-overlay');
    if (!overlay) return;

    // Remove existing style classes
    overlay.classList.remove('overlay-dark', 'overlay-light', 'overlay-gradient', 'overlay-none');

    switch(style) {
        case 'dark':
            overlay.style.background = 'rgba(0, 0, 0, 0.5)';
            break;
        case 'light':
            overlay.style.background = 'rgba(255, 255, 255, 0.3)';
            break;
        case 'gradient':
            overlay.style.background = 'linear-gradient(135deg, rgba(212, 105, 79, 0.7), rgba(179, 108, 5, 0.6))';
            break;
        case 'none':
            overlay.style.background = 'transparent';
            break;
        default:
            overlay.style.background = 'linear-gradient(135deg, rgba(212, 105, 79, 0.7), rgba(179, 108, 5, 0.6))';
    }
}

// ===== PARTICLE EFFECTS =====
function initParticles(type) {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Remove existing particles
    const existingParticles = heroSection.querySelector('.particles-container');
    if (existingParticles) existingParticles.remove();

    if (type === 'none') return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `particle particle-${type}`;

        // Random positioning and animation delay
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';

        if (type === 'stars') {
            particle.innerHTML = '★';
            particle.style.fontSize = (Math.random() * 10 + 5) + 'px';
        } else if (type === 'bubbles') {
            particle.style.width = particle.style.height = (Math.random() * 20 + 10) + 'px';
        } else if (type === 'snow') {
            particle.innerHTML = '❄';
            particle.style.fontSize = (Math.random() * 15 + 8) + 'px';
        }

        particlesContainer.appendChild(particle);
    }

    heroSection.appendChild(particlesContainer);
}

// ===== LOAD ABOUT SECTION =====
function loadAboutSection(about, general) {
    if (!about) return;

    // Update section label and title
    if (general && general.labels) {
        const sectionTag = document.querySelector('#about .section-tag');
        if (sectionTag && general.labels.about) {
            sectionTag.textContent = general.labels.about;
        }
    }

    if (general && general.titles) {
        const sectionTitle = document.querySelector('#about .section-title');
        if (sectionTitle && general.titles.about) {
            sectionTitle.textContent = general.titles.about;
        }
    }

    const aboutTitle = document.querySelector('.about-text h3');
    const aboutParagraphs = document.querySelectorAll('.about-text p');
    const aboutImage = document.querySelector('.about-image img');
    const featuresList = document.querySelector('.features-list');

    if (aboutTitle) aboutTitle.textContent = about.title;

    if (aboutParagraphs.length >= 2) {
        aboutParagraphs[0].textContent = about.text1;
        aboutParagraphs[1].textContent = about.text2;
    }

    if (aboutImage && about.image) {
        aboutImage.src = about.image;
    }

    // Update features list
    if (featuresList && about.features && about.features.length > 0) {
        featuresList.innerHTML = '';
        about.features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
            featuresList.appendChild(li);
        });
    }
}

// ===== LOAD SERVICES SECTION =====
function loadServicesSection(services, general) {
    if (!services || services.length === 0) return;

    // Update section label and title
    if (general && general.labels) {
        const sectionTag = document.querySelector('#services .section-tag');
        if (sectionTag && general.labels.services) {
            sectionTag.textContent = general.labels.services;
        }
    }

    if (general && general.titles) {
        const sectionTitle = document.querySelector('#services .section-title');
        if (sectionTitle && general.titles.services) {
            sectionTitle.textContent = general.titles.services;
        }
    }

    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = '';

    services.forEach((service, index) => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card reveal-from-back';
        serviceCard.style.transitionDelay = `${index * 0.1}s`;

        const featuresList = service.features
            .map(feature => `<li>${feature}</li>`)
            .join('');

        serviceCard.innerHTML = `
            <div class="service-image">
                <img src="${service.image}" alt="${service.title}">
                <div class="service-overlay">
                    <i class="${service.icon}"></i>
                </div>
            </div>
            <div class="service-content">
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <ul>
                    ${featuresList}
                </ul>
            </div>
        `;

        servicesGrid.appendChild(serviceCard);
    });

    // Re-initialize reveal animations for new elements
    initializeRevealAnimations();
}

// ===== LOAD GALLERY SECTION =====
function loadGallerySection(gallery, general) {
    if (!gallery || gallery.length === 0) return;

    // Update section label and title
    if (general && general.labels) {
        const sectionTag = document.querySelector('#gallery .section-tag');
        if (sectionTag && general.labels.gallery) {
            sectionTag.textContent = general.labels.gallery;
        }
    }

    if (general && general.titles) {
        const sectionTitle = document.querySelector('#gallery .section-title');
        if (sectionTitle && general.titles.gallery) {
            sectionTitle.textContent = general.titles.gallery;
        }
    }

    const galleryTrack = document.querySelector('.gallery-track');
    if (!galleryTrack) return;

    galleryTrack.innerHTML = '';

    gallery.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `<img src="${image.url}" alt="${image.alt}">`;
        galleryTrack.appendChild(galleryItem);
    });

    // Re-initialize gallery slider
    if (window.initializeGallerySlider) {
        window.initializeGallerySlider();
    }
}

// ===== LOAD CONTACT SECTION =====
function loadContactSection(contact, general) {
    if (!contact) return;

    // Update section label and title
    if (general && general.labels) {
        const sectionTag = document.querySelector('#contact .section-tag');
        if (sectionTag && general.labels.contact) {
            sectionTag.textContent = general.labels.contact;
        }
    }

    if (general && general.titles) {
        const sectionTitle = document.querySelector('#contact .section-title');
        if (sectionTitle && general.titles.contact) {
            sectionTitle.textContent = general.titles.contact;
        }
    }

    // Update address
    const addressElement = document.querySelector('.contact-item:nth-child(1) p');
    if (addressElement && contact.address) {
        addressElement.innerHTML = contact.address.replace(/\n/g, '<br>');
    }

    // Update phone
    const phoneElement = document.querySelector('.contact-item:nth-child(2) p');
    if (phoneElement && contact.phone) {
        phoneElement.textContent = contact.phone;
    }

    // Update email
    const emailElement = document.querySelector('.contact-item:nth-child(3) p');
    if (emailElement && contact.email) {
        emailElement.textContent = contact.email;
    }

    // Update social links
    const socialLinks = document.querySelectorAll('.social-links a');
    if (socialLinks.length >= 4) {
        if (contact.facebook) socialLinks[0].href = contact.facebook;
        if (contact.instagram) socialLinks[1].href = contact.instagram;
        // Twitter (index 2) - eğer varsa
        // WhatsApp in social links (index 3)
        if (contact.whatsapp) {
            // Numarayı temizle (sadece rakamlar kalsın)
            const cleanNumber = contact.whatsapp.replace(/\D/g, '');
            socialLinks[3].href = `https://wa.me/${cleanNumber}`;
        }
    }

    // Update WhatsApp floating button
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (whatsappButton && contact.whatsapp) {
        // Numarayı temizle (sadece rakamlar kalsın)
        const cleanNumber = contact.whatsapp.replace(/\D/g, '');
        whatsappButton.href = `https://wa.me/${cleanNumber}`;
    }
}

// ===== LOAD FOOTER SECTION =====
function loadFooterSection(footer) {
    if (!footer) return;

    const footerParagraphs = document.querySelectorAll('.footer p');

    if (footerParagraphs.length >= 2) {
        if (footer.copyright) footerParagraphs[0].textContent = footer.copyright;
        if (footer.text) footerParagraphs[1].textContent = footer.text;
    }
}

// ===== RE-INITIALIZE REVEAL ANIMATIONS =====
function initializeRevealAnimations() {
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll(
        '.reveal-from-back, .reveal-fade, .reveal-from-left, .reveal-from-right'
    );

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });
}

// ===== ADMIN PANEL QUICK ACCESS =====
// Add a hidden admin panel access (press Ctrl+Shift+A)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        window.location.href = 'admin-login.html';
    }
});

console.log('%c🔐 Admin Panel', 'color: #d4694f; font-size: 14px; font-weight: bold;');
console.log('%cAdmin paneline erişmek için: Ctrl+Shift+A veya admin-login.html', 'color: #666; font-size: 12px;');
