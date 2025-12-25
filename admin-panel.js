// ===== AUTH CHECK =====
if (sessionStorage.getItem('adminLoggedIn') !== 'true' &&
    localStorage.getItem('adminRemember') !== 'true') {
    window.location.href = 'admin-login.html';
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async function() {
    await initializeData();
    loadAllData();
    setupNavigationCur();
    updateClock();
    setInterval(updateClock, 1000);
});

// ===== DEFAULT DATA =====
const defaultData = {
    general: {
        siteName: "Kahvaltı & Organizasyon",
        siteTitle: "Kahvaltı & Organizasyon - Lezzet Dolu Anlar",
        siteLogo: "",
        labels: {
            about: "Hakkımızda",
            services: "Hizmetlerimiz",
            gallery: "Galeri",
            contact: "İletişim"
        },
        titles: {
            about: "Lezzet ve Kalitenin Buluşma Noktası",
            services: "Size Özel Çözümler",
            gallery: "Çalışmalarımızdan Kareler",
            contact: "Bizimle İletişime Geçin"
        },
        menu: ["Ana Sayfa", "Hakkımızda", "Hizmetlerimiz", "Galeri", "İletişim"],
        colors: {
            primary: "#d4694f",
            secondary: "#b36c05",
            accent: "#2c3e50",
            background: "#f8f5f2",
            text: "#333333",
            gradient: "none"
        }
    },
    hero: {
        title: "Lezzet Dolu Anlarınıza Eşlik Ediyoruz",
        subtitle: "Kahvaltı ve organizasyon hizmetlerimizle özel günlerinizi unutulmaz kılıyoruz",
        slides: [
            { id: 1, url: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=1920" },
            { id: 2, url: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1920" },
            { id: 3, url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920" }
        ],
        sliderSpeed: 5,
        sliderEffect: "fade",
        overlayStyle: "dark",
        particles: "none",
        button1: "Hizmetlerimiz",
        button2: "İletişime Geçin"
    },
    about: {
        title: "Sizin İçin Buradayız",
        text1: "Yılların deneyimi ve tutkusuyla, kahvaltı ve organizasyon hizmetlerinde kalite standartlarını yeniden tanımlıyoruz. Taze malzemeler, özenli sunum ve kusursuz hizmet anlayışımızla özel günlerinizi unutulmaz kılıyoruz.",
        text2: "Doğum günlerinden düğünlere, kurumsal etkinliklerden aile toplantılarına kadar her türlü organizasyonda yanınızdayız.",
        image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800",
        features: ["Taze ve Kaliteli Malzemeler", "Profesyonel Ekip", "Özel Menü Seçenekleri", "Her Bütçeye Uygun Paketler"]
    },
    services: [
        {
            id: 1,
            title: "Serpme Kahvaltı",
            description: "Zengin çeşitleri ve taze ürünleriyle doyurucu serpme kahvaltı seçeneklerimiz.",
            image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600",
            icon: "fas fa-utensils",
            features: ["Çeşit çeşit peynirler", "Ev yapımı reçeller", "Sıcak börekler", "Taze meyve sunumları"]
        },
        {
            id: 2,
            title: "Doğum Günü & Parti",
            description: "Doğum günü ve özel günleriniz için tam paket organizasyon hizmetleri.",
            image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600",
            icon: "fas fa-birthday-cake",
            features: ["Özel dekorasyon", "Pasta ve ikramlar", "Animasyon hizmetleri", "Fotoğraf çekimi"]
        },
        {
            id: 3,
            title: "Kurumsal Organizasyon",
            description: "Şirket etkinlikleri ve toplantılarınız için profesyonel çözümler.",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
            icon: "fas fa-briefcase",
            features: ["Toplantı kahvaltıları", "Kokteyl organizasyonu", "Kurumsal etkinlikler", "Özel menü planlaması"]
        },
        {
            id: 4,
            title: "Düğün & Nişan",
            description: "Hayatınızın en özel gününde yanınızdayız, her detayı kusursuz planlıyoruz.",
            image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600",
            icon: "fas fa-ring",
            features: ["Nişan organizasyonu", "Düğün yemek servisi", "Kokteyl ikramları", "Gelin çıkma kahvaltısı"]
        }
    ],
    gallery: [
        { id: 1, url: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800", alt: "Kahvaltı 1" },
        { id: 2, url: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800", alt: "Kahvaltı 2" },
        { id: 3, url: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800", alt: "Parti" },
        { id: 4, url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800", alt: "Kurumsal" },
        { id: 5, url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800", alt: "Düğün" }
    ],
    contact: {
        address: "Örnek Mahallesi, Lezzet Sokak No:123\nİstanbul, Türkiye",
        phone: "0 555 123 45 67",
        email: "info@kahvaltiorganizasyon.com",
        whatsapp: "905321777786",
        facebook: "",
        instagram: "",
        twitter: ""
    },
    footer: {
        copyright: "© 2024 Kahvaltı & Organizasyon. Tüm hakları saklıdır.",
        text: "Lezzet dolu anlarınıza eşlik etmekten mutluluk duyarız."
    }
};

// ===== DATA MANAGEMENT =====
let cachedData = null;

async function initializeData() {
    try {
        const response = await fetch('api/load-data.php');
        const serverData = await response.json();

        if (serverData && serverData.general) {
            cachedData = serverData;
            localStorage.setItem('siteData', JSON.stringify(serverData));
        } else {
            // No data on server, use default and save to server
            cachedData = defaultData;
            localStorage.setItem('siteData', JSON.stringify(defaultData));
            await saveDataToServer(defaultData);
        }
    } catch (error) {
        console.error('Sunucu bağlantı hatası:', error);
        // Fallback to localStorage
        if (!localStorage.getItem('siteData')) {
            localStorage.setItem('siteData', JSON.stringify(defaultData));
        }
        cachedData = JSON.parse(localStorage.getItem('siteData'));
    }
}

function getData() {
    if (cachedData) return cachedData;
    return JSON.parse(localStorage.getItem('siteData')) || defaultData;
}

async function saveDataToServer(data) {
    try {
        const response = await fetch('api/save-data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Sunucuya kaydetme hatası:', error);
        return false;
    }
}

async function saveData(data) {
    // Save to localStorage first (for immediate feedback)
    localStorage.setItem('siteData', JSON.stringify(data));
    cachedData = data;

    // Then save to server
    const serverSaved = await saveDataToServer(data);

    if (serverSaved) {
        showAlert('success', 'Veriler başarıyla kaydedildi!');
    } else {
        showAlert('warning', 'Veriler kaydedildi ama sunucu hatası oluştu. Lütfen tekrar deneyin.');
    }

    updateStats();
}

// ===== NAVIGATION =====
function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item[data-section]');
    const sections = document.querySelectorAll('.admin-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Update active menu
            menuItems.forEach(m => m.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            const sectionId = this.dataset.section + '-section';
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId)?.classList.add('active');
        });
    });
}

// ===== LOAD ALL DATA =====
function loadAllData() {
    const data = getData();

    // Ensure data has all required fields
    if (!data.general) data.general = defaultData.general;
    if (!data.hero.button1) data.hero.button1 = defaultData.hero.button1;
    if (!data.hero.button2) data.hero.button2 = defaultData.hero.button2;
    if (!data.about.features) data.about.features = defaultData.about.features;
    if (!data.footer) data.footer = defaultData.footer;

    // Load General Settings
    document.getElementById('siteName').value = data.general.siteName || '';
    document.getElementById('siteTitle').value = data.general.siteTitle || '';
    document.getElementById('siteLogo').value = data.general.siteLogo || '';

    // Load Labels
    document.getElementById('labelAbout').value = data.general.labels?.about || '';
    document.getElementById('titleAbout').value = data.general.titles?.about || '';
    document.getElementById('labelServices').value = data.general.labels?.services || '';
    document.getElementById('titleServices').value = data.general.titles?.services || '';
    document.getElementById('labelGallery').value = data.general.labels?.gallery || '';
    document.getElementById('titleGallery').value = data.general.titles?.gallery || '';
    document.getElementById('labelContact').value = data.general.labels?.contact || '';
    document.getElementById('titleContact').value = data.general.titles?.contact || '';

    // Load Menu
    const menu = data.general.menu || [];
    document.getElementById('menu1').value = menu[0] || '';
    document.getElementById('menu2').value = menu[1] || '';
    document.getElementById('menu3').value = menu[2] || '';
    document.getElementById('menu4').value = menu[3] || '';
    document.getElementById('menu5').value = menu[4] || '';

    // Load Colors
    const colors = data.general.colors || defaultData.general.colors;
    document.getElementById('colorPrimary').value = colors.primary;
    document.getElementById('colorPrimaryText').value = colors.primary;
    document.getElementById('colorSecondary').value = colors.secondary;
    document.getElementById('colorSecondaryText').value = colors.secondary;
    document.getElementById('colorAccent').value = colors.accent;
    document.getElementById('colorAccentText').value = colors.accent;
    document.getElementById('colorBackground').value = colors.background;
    document.getElementById('colorBackgroundText').value = colors.background;
    document.getElementById('colorText').value = colors.text;
    document.getElementById('colorTextText').value = colors.text;
    document.getElementById('gradientStyle').value = colors.gradient || 'none';

    // Load Hero
    document.getElementById('heroTitle').value = data.hero.title;
    document.getElementById('heroSubtitle').value = data.hero.subtitle;
    document.getElementById('heroButton1').value = data.hero.button1 || '';
    document.getElementById('heroButton2').value = data.hero.button2 || '';
    document.getElementById('heroSliderSpeed').value = data.hero.sliderSpeed || 5;
    document.getElementById('heroSliderEffect').value = data.hero.sliderEffect || 'fade';
    document.getElementById('heroOverlayStyle').value = data.hero.overlayStyle || 'dark';
    document.getElementById('heroParticles').value = data.hero.particles || 'none';

    // Load Hero Slides
    loadHeroSlides();

    // Load About
    document.getElementById('aboutTitle').value = data.about.title;
    document.getElementById('aboutText1').value = data.about.text1;
    document.getElementById('aboutText2').value = data.about.text2;
    document.getElementById('aboutImage').value = data.about.image;
    document.getElementById('aboutFeatures').value = (data.about.features || []).join('\n');

    // Load Services
    loadServices();

    // Load Gallery
    loadGallery();

    // Load Contact
    document.getElementById('contactAddress').value = data.contact.address;
    document.getElementById('contactPhone').value = data.contact.phone;
    document.getElementById('contactEmail').value = data.contact.email;
    document.getElementById('contactWhatsapp').value = data.contact.whatsapp;
    document.getElementById('contactFacebook').value = data.contact.facebook || '';
    document.getElementById('contactInstagram').value = data.contact.instagram || '';
    document.getElementById('contactTwitter').value = data.contact.twitter || '';

    // Load Footer
    document.getElementById('footerCopyright').value = data.footer?.copyright || '';
    document.getElementById('footerText').value = data.footer?.text || '';

    updateStats();
}

// ===== GENERAL SETTINGS SECTION =====
document.getElementById('generalForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = getData();
    if (!data.general) data.general = {};

    data.general = {
        siteName: document.getElementById('siteName').value,
        siteTitle: document.getElementById('siteTitle').value,
        siteLogo: document.getElementById('siteLogo').value,
        labels: {
            about: document.getElementById('labelAbout').value,
            services: document.getElementById('labelServices').value,
            gallery: document.getElementById('labelGallery').value,
            contact: document.getElementById('labelContact').value
        },
        titles: {
            about: document.getElementById('titleAbout').value,
            services: document.getElementById('titleServices').value,
            gallery: document.getElementById('titleGallery').value,
            contact: document.getElementById('titleContact').value
        },
        menu: [
            document.getElementById('menu1').value,
            document.getElementById('menu2').value,
            document.getElementById('menu3').value,
            document.getElementById('menu4').value,
            document.getElementById('menu5').value
        ],
        colors: {
            primary: document.getElementById('colorPrimary').value,
            secondary: document.getElementById('colorSecondary').value,
            accent: document.getElementById('colorAccent').value,
            background: document.getElementById('colorBackground').value,
            text: document.getElementById('colorText').value,
            gradient: document.getElementById('gradientStyle').value
        }
    };

    saveData(data);
});

// ===== COLOR PICKER SYNC =====
function setupColorSync(colorId, textId) {
    const colorInput = document.getElementById(colorId);
    const textInput = document.getElementById(textId);

    if (colorInput && textInput) {
        colorInput.addEventListener('input', () => textInput.value = colorInput.value);
        textInput.addEventListener('input', () => {
            if (/^#[0-9A-Fa-f]{6}$/.test(textInput.value)) {
                colorInput.value = textInput.value;
            }
        });
    }
}

// Initialize color syncs
document.addEventListener('DOMContentLoaded', function() {
    setupColorSync('colorPrimary', 'colorPrimaryText');
    setupColorSync('colorSecondary', 'colorSecondaryText');
    setupColorSync('colorAccent', 'colorAccentText');
    setupColorSync('colorBackground', 'colorBackgroundText');
    setupColorSync('colorText', 'colorTextText');
});

// ===== HERO SLIDES MANAGEMENT =====
function loadHeroSlides() {
    const data = getData();
    const slides = data.hero.slides || defaultData.hero.slides;
    const container = document.getElementById('heroSlidesContainer');
    if (!container) return;

    container.innerHTML = '';
    slides.forEach((slide, index) => {
        const item = document.createElement('div');
        item.className = 'preview-item';
        item.innerHTML = `
            <img src="${slide.url}" alt="Slide ${index + 1}">
            <button class="preview-remove" onclick="removeHeroSlide(${slide.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(item);
    });
}

function addHeroSlide() {
    const url = prompt('Resim URL\'sini girin:');
    if (!url || !url.trim()) return;

    const data = getData();
    if (!data.hero.slides) data.hero.slides = [];

    data.hero.slides.push({
        id: Date.now(),
        url: url.trim()
    });

    saveData(data);
    loadHeroSlides();
}

function removeHeroSlide(id) {
    if (!confirm('Bu resmi silmek istediğinizden emin misiniz?')) return;

    const data = getData();
    data.hero.slides = data.hero.slides.filter(s => s.id !== id);
    saveData(data);
    loadHeroSlides();
}

// ===== HERO SECTION =====
document.getElementById('heroForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = getData();
    data.hero = {
        ...data.hero,
        title: document.getElementById('heroTitle').value,
        subtitle: document.getElementById('heroSubtitle').value,
        slides: data.hero.slides || defaultData.hero.slides,
        sliderSpeed: parseInt(document.getElementById('heroSliderSpeed').value) || 5,
        sliderEffect: document.getElementById('heroSliderEffect').value,
        overlayStyle: document.getElementById('heroOverlayStyle').value,
        particles: document.getElementById('heroParticles').value,
        button1: document.getElementById('heroButton1').value,
        button2: document.getElementById('heroButton2').value
    };

    saveData(data);
});

// ===== ABOUT SECTION =====
document.getElementById('aboutForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = getData();
    const features = document.getElementById('aboutFeatures').value
        .split('\n')
        .filter(f => f.trim() !== '');

    data.about = {
        title: document.getElementById('aboutTitle').value,
        text1: document.getElementById('aboutText1').value,
        text2: document.getElementById('aboutText2').value,
        image: document.getElementById('aboutImage').value,
        features: features
    };

    saveData(data);
});

// ===== SERVICES SECTION =====
function loadServices() {
    const data = getData();
    const tbody = document.getElementById('servicesTableBody');
    tbody.innerHTML = '';

    data.services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${service.image}" alt="${service.title}" class="table-image"></td>
            <td><strong>${service.title}</strong></td>
            <td>${service.description.substring(0, 50)}...</td>
            <td><i class="${service.icon}"></i></td>
            <td class="table-actions">
                <button class="action-btn btn-primary" onclick="editService(${service.id})">
                    <i class="fas fa-edit"></i> Düzenle
                </button>
                <button class="action-btn btn-danger" onclick="deleteService(${service.id})">
                    <i class="fas fa-trash"></i> Sil
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openServiceModal(serviceId = null) {
    const modal = document.getElementById('serviceModal');
    modal.classList.add('active');

    if (serviceId) {
        const data = getData();
        const service = data.services.find(s => s.id === serviceId);

        document.getElementById('serviceId').value = service.id;
        document.getElementById('serviceTitle').value = service.title;
        document.getElementById('serviceDescription').value = service.description;
        document.getElementById('serviceImage').value = service.image;
        document.getElementById('serviceIcon').value = service.icon;
        document.getElementById('serviceFeatures').value = service.features.join('\n');
    } else {
        document.getElementById('serviceModalForm').reset();
        document.getElementById('serviceId').value = '';
    }
}

function closeServiceModal() {
    document.getElementById('serviceModal').classList.remove('active');
}

function editService(id) {
    openServiceModal(id);
}

function deleteService(id) {
    if (confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
        const data = getData();
        data.services = data.services.filter(s => s.id !== id);
        saveData(data);
        loadServices();
    }
}

document.getElementById('serviceModalForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = getData();
    const serviceId = document.getElementById('serviceId').value;
    const features = document.getElementById('serviceFeatures').value
        .split('\n')
        .filter(f => f.trim() !== '');

    const serviceData = {
        id: serviceId ? parseInt(serviceId) : Date.now(),
        title: document.getElementById('serviceTitle').value,
        description: document.getElementById('serviceDescription').value,
        image: document.getElementById('serviceImage').value,
        icon: document.getElementById('serviceIcon').value,
        features: features
    };

    if (serviceId) {
        // Update existing
        const index = data.services.findIndex(s => s.id === parseInt(serviceId));
        data.services[index] = serviceData;
    } else {
        // Add new
        data.services.push(serviceData);
    }

    saveData(data);
    loadServices();
    closeServiceModal();
});

// ===== GALLERY SECTION =====
function loadGallery() {
    const data = getData();
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';

    data.gallery.forEach(image => {
        const item = document.createElement('div');
        item.className = 'preview-item';
        item.innerHTML = `
            <img src="${image.url}" alt="${image.alt}">
            <button class="preview-remove" onclick="deleteGalleryImage(${image.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        grid.appendChild(item);
    });
}

function openGalleryModal() {
    const modal = document.getElementById('galleryModal');
    modal.classList.add('active');
    document.getElementById('galleryModalForm').reset();
}

function closeGalleryModal() {
    document.getElementById('galleryModal').classList.remove('active');
}

function deleteGalleryImage(id) {
    if (confirm('Bu resmi silmek istediğinizden emin misiniz?')) {
        const data = getData();
        data.gallery = data.gallery.filter(img => img.id !== id);
        saveData(data);
        loadGallery();
    }
}

document.getElementById('galleryModalForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = getData();
    const newImage = {
        id: Date.now(),
        url: document.getElementById('galleryImageUrl').value,
        alt: document.getElementById('galleryImageAlt').value || 'Galeri Resmi'
    };

    data.gallery.push(newImage);
    saveData(data);
    loadGallery();
    closeGalleryModal();
});

// ===== CONTACT SECTION =====
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = getData();
    data.contact = {
        address: document.getElementById('contactAddress').value,
        phone: document.getElementById('contactPhone').value,
        email: document.getElementById('contactEmail').value,
        whatsapp: document.getElementById('contactWhatsapp').value,
        facebook: document.getElementById('contactFacebook').value,
        instagram: document.getElementById('contactInstagram').value,
        twitter: document.getElementById('contactTwitter').value
    };

    saveData(data);
});

// ===== FOOTER SECTION =====
document.getElementById('footerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = getData();
    if (!data.footer) data.footer = {};

    data.footer = {
        copyright: document.getElementById('footerCopyright').value,
        text: document.getElementById('footerText').value
    };

    saveData(data);
});

// ===== UTILITY FUNCTIONS =====
function updateStats() {
    const data = getData();
    document.getElementById('servicesCount').textContent = data.services.length;
    document.getElementById('galleryCount').textContent = data.gallery.length;
}

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('currentTime').textContent = time;
}

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <div>${message}</div>
    `;

    const container = document.querySelector('.admin-section.active .content-section');
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

function logout() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        sessionStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminRemember');
        window.location.href = 'admin-login.html';
    }
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    const toggleBtn = document.getElementById('mobileMenuToggle');

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    toggleBtn.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    const toggleBtn = document.getElementById('mobileMenuToggle');

    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    toggleBtn.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== NAVIGATION CURSOR =====
function setupNavigationCur() {
    const menuItems = document.querySelectorAll('.menu-item[data-section]');
    const sections = document.querySelectorAll('.admin-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Update active menu
            menuItems.forEach(m => m.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            const sectionId = this.dataset.section + '-section';
            sections.forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.display = 'block';
            }

            // Hide other sections
            sections.forEach(s => {
                if (s.id !== sectionId) {
                    s.style.display = 'none';
                }
            });

            // Close mobile menu when item clicked
            closeMobileMenu();
        });
    });

    // Show dashboard by default
    sections.forEach((s, i) => {
        s.style.display = i === 0 ? 'block' : 'none';
    });
}

// Close modals on outside click
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ===== SETTINGS & BACKUP FUNCTIONS =====

// Hash function for password
async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Password change form
document.getElementById('passwordForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showAlert('error', 'Şifreler eşleşmiyor!');
        return;
    }

    if (newPassword.length < 6) {
        showAlert('error', 'Şifre en az 6 karakter olmalıdır!');
        return;
    }

    const usernameHash = await hashString(newUsername);
    const passwordHash = await hashString(newPassword);

    const credentials = {
        usernameHash: usernameHash,
        passwordHash: passwordHash
    };

    localStorage.setItem('adminCredentials', JSON.stringify(credentials));
    showAlert('success', 'Şifre başarıyla değiştirildi! Yeni giriş bilgilerinizi unutmayın.');

    // Clear form
    document.getElementById('passwordForm').reset();
});

// Export data function
function exportData() {
    const data = getData();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `site-yedek-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showAlert('success', 'Veriler başarıyla indirildi!');
}

// Import data function
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);

            // Validate the data structure
            if (!importedData.general || !importedData.hero || !importedData.services) {
                throw new Error('Geçersiz veri yapısı');
            }

            if (confirm('Mevcut veriler yedek dosyasındaki verilerle değiştirilecek. Devam etmek istiyor musunuz?')) {
                localStorage.setItem('siteData', JSON.stringify(importedData));
                showAlert('success', 'Veriler başarıyla geri yüklendi! Sayfa yenileniyor...');

                setTimeout(() => {
                    location.reload();
                }, 1500);
            }
        } catch (error) {
            showAlert('error', 'Dosya okunamadı veya geçersiz format!');
        }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
}

// Reset to default function
function resetToDefault() {
    if (confirm('TÜM VERİLER SİLİNECEK ve varsayılan veriler yüklenecek. Bu işlem geri alınamaz! Devam etmek istiyor musunuz?')) {
        if (confirm('Emin misiniz? Tüm özelleştirmeleriniz kaybolacak!')) {
            localStorage.removeItem('siteData');
            localStorage.removeItem('adminCredentials');
            showAlert('success', 'Veriler sıfırlandı! Sayfa yenileniyor...');

            setTimeout(() => {
                location.reload();
            }, 1500);
        }
    }
}

// Update system info
function updateSystemInfo() {
    const data = localStorage.getItem('siteData');
    const lastUpdateEl = document.getElementById('lastUpdate');
    const dataSizeEl = document.getElementById('dataSize');

    if (lastUpdateEl) {
        lastUpdateEl.textContent = new Date().toLocaleString('tr-TR');
    }

    if (dataSizeEl && data) {
        const sizeInBytes = new Blob([data]).size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        dataSizeEl.textContent = `${sizeInKB} KB`;
    }
}

// Call updateSystemInfo when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateSystemInfo();
});
