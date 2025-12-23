// ===== DATA LOADER FOR HOMEPAGE (BACKEND VERSION) =====
const API_BASE = 'api/';

document.addEventListener('DOMContentLoaded', function() {
    loadSiteData();
});

// ===== API HELPER =====
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(API_BASE + endpoint);
        const data = await response.json();
        return data.success ? data : null;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// ===== LOAD ALL SITE DATA =====
async function loadSiteData() {
    try {
        const [heroData, aboutData, servicesData, galleryData, contactData] = await Promise.all([
            fetchAPI('hero.php'),
            fetchAPI('about.php'),
            fetchAPI('services.php'),
            fetchAPI('gallery.php'),
            fetchAPI('contact.php')
        ]);

        if (heroData) loadHeroSection(heroData.hero);
        if (aboutData) loadAboutSection(aboutData.about);
        if (servicesData) loadServicesSection(servicesData.services);
        if (galleryData) loadGallerySection(galleryData.gallery);
        if (contactData) loadContactSection(contactData.contact);
    } catch (error) {
        console.error('Load site data error:', error);
    }
}

// ===== LOAD HERO SECTION =====
function loadHeroSection(hero) {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroBg = document.querySelector('.hero-bg');

    if (heroTitle) heroTitle.textContent = hero.title;
    if (heroSubtitle) heroSubtitle.textContent = hero.subtitle;
    if (heroBg && hero.background_image) {
        heroBg.style.backgroundImage = `url('${hero.background_image}')`;
    }
}

// ===== LOAD ABOUT SECTION =====
function loadAboutSection(about) {
    const aboutTitle = document.querySelector('.about-text h3');
    const aboutParagraphs = document.querySelectorAll('.about-text p');
    const aboutImage = document.querySelector('.about-image img');

    if (aboutTitle) aboutTitle.textContent = about.title;

    if (aboutParagraphs.length >= 2) {
        aboutParagraphs[0].textContent = about.text1;
        aboutParagraphs[1].textContent = about.text2;
    }

    if (aboutImage && about.image) {
        aboutImage.src = about.image;
    }
}

// ===== LOAD SERVICES SECTION =====
function loadServicesSection(services) {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid || services.length === 0) return;

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

    // Re-initialize reveal animations
    initializeRevealAnimations();
}

// ===== LOAD GALLERY SECTION =====
function loadGallerySection(gallery) {
    const galleryTrack = document.querySelector('.gallery-track');
    if (!galleryTrack || gallery.length === 0) return;

    galleryTrack.innerHTML = '';

    gallery.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `<img src="${image.image}" alt="${image.alt_text}">`;
        galleryTrack.appendChild(galleryItem);
    });

    // Re-initialize gallery slider
    if (window.initializeGallerySlider) {
        window.initializeGallerySlider();
    }
}

// ===== LOAD CONTACT SECTION =====
function loadContactSection(contact) {
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
    }

    // Update WhatsApp button
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (whatsappButton && contact.whatsapp) {
        whatsappButton.href = `https://wa.me/${contact.whatsapp}`;
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

// Admin panel quick access (Ctrl+Shift+A)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        window.location.href = 'admin-login.html';
    }
});

console.log('%c🔐 Admin Panel', 'color: #d4694f; font-size: 14px; font-weight: bold;');
console.log('%cAdmin paneline erişmek için: Ctrl+Shift+A veya admin-login.html', 'color: #666; font-size: 12px;');
