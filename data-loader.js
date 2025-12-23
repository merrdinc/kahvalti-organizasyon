// ===== DATA LOADER FOR HOMEPAGE =====
// This script loads data from localStorage and populates the homepage

document.addEventListener('DOMContentLoaded', function() {
    loadSiteData();
});

function loadSiteData() {
    const data = getSiteData();

    if (data) {
        loadGeneralSettings(data.general);
        loadHeroSection(data.hero);
        loadAboutSection(data.about, data.general);
        loadServicesSection(data.services, data.general);
        loadGallerySection(data.gallery, data.general);
        loadContactSection(data.contact, data.general);
        loadFooterSection(data.footer);
    }
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
    const heroBg = document.querySelector('.hero-bg');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');

    if (heroTitle) heroTitle.textContent = hero.title;
    if (heroSubtitle) heroSubtitle.textContent = hero.subtitle;
    if (heroBg && hero.backgroundImage) {
        heroBg.style.backgroundImage = `url('${hero.backgroundImage}')`;
    }

    // Update hero buttons
    if (heroButtons.length >= 2) {
        if (hero.button1) heroButtons[0].textContent = hero.button1;
        if (hero.button2) heroButtons[1].textContent = hero.button2;
    }
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
    }

    // Update WhatsApp button
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (whatsappButton && contact.whatsapp) {
        whatsappButton.href = `https://wa.me/${contact.whatsapp}`;
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
