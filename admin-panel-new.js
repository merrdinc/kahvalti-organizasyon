// ===== BACKEND KULLANAN ADMİN PANEL =====
const API_BASE = 'api/';

// ===== AUTH CHECK =====
async function checkAuth() {
    try {
        const response = await fetch(API_BASE + 'auth.php?action=check');
        const data = await response.json();

        if (!data.loggedIn) {
            window.location.href = 'admin-login.html';
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = 'admin-login.html';
    }
}

// Sayfa yüklendiğinde auth kontrol et
checkAuth();

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    setupNavigation();
    updateClock();
    setInterval(updateClock, 1000);
});

// ===== API HELPER =====
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(API_BASE + endpoint, options);
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'İşlem başarısız');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        showAlert('danger', error.message || 'Bir hata oluştu');
        throw error;
    }
}

// ===== LOAD ALL DATA =====
async function loadAllData() {
    try {
        await Promise.all([
            loadHero(),
            loadAbout(),
            loadServices(),
            loadGallery(),
            loadContact()
        ]);

        updateStats();
    } catch (error) {
        console.error('Load data error:', error);
    }
}

// ===== HERO SECTION =====
async function loadHero() {
    try {
        const data = await apiRequest('hero.php');
        const hero = data.hero;

        document.getElementById('heroTitle').value = hero.title || '';
        document.getElementById('heroSubtitle').value = hero.subtitle || '';
        document.getElementById('heroImage').value = hero.background_image || '';
    } catch (error) {
        console.error('Load hero error:', error);
    }
}

document.getElementById('heroForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const heroData = {
        title: document.getElementById('heroTitle').value,
        subtitle: document.getElementById('heroSubtitle').value,
        background_image: document.getElementById('heroImage').value
    };

    try {
        await apiRequest('hero.php', 'PUT', heroData);
        showAlert('success', 'Ana sayfa başarıyla güncellendi!');
    } catch (error) {
        console.error('Save hero error:', error);
    }
});

// ===== ABOUT SECTION =====
async function loadAbout() {
    try {
        const data = await apiRequest('about.php');
        const about = data.about;

        document.getElementById('aboutTitle').value = about.title || '';
        document.getElementById('aboutText1').value = about.text1 || '';
        document.getElementById('aboutText2').value = about.text2 || '';
        document.getElementById('aboutImage').value = about.image || '';
    } catch (error) {
        console.error('Load about error:', error);
    }
}

document.getElementById('aboutForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const aboutData = {
        title: document.getElementById('aboutTitle').value,
        text1: document.getElementById('aboutText1').value,
        text2: document.getElementById('aboutText2').value,
        image: document.getElementById('aboutImage').value
    };

    try {
        await apiRequest('about.php', 'PUT', aboutData);
        showAlert('success', 'Hakkımızda bölümü güncellendi!');
    } catch (error) {
        console.error('Save about error:', error);
    }
});

// ===== SERVICES SECTION =====
async function loadServices() {
    try {
        const data = await apiRequest('services.php');
        const services = data.services;
        const tbody = document.getElementById('servicesTableBody');
        tbody.innerHTML = '';

        services.forEach(service => {
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
    } catch (error) {
        console.error('Load services error:', error);
    }
}

function openServiceModal(serviceId = null) {
    const modal = document.getElementById('serviceModal');
    modal.classList.add('active');

    if (serviceId) {
        // Load service data
        loadServiceForEdit(serviceId);
    } else {
        document.getElementById('serviceModalForm').reset();
        document.getElementById('serviceId').value = '';
    }
}

async function loadServiceForEdit(serviceId) {
    try {
        const data = await apiRequest('services.php');
        const service = data.services.find(s => s.id === serviceId);

        if (service) {
            document.getElementById('serviceId').value = service.id;
            document.getElementById('serviceTitle').value = service.title;
            document.getElementById('serviceDescription').value = service.description;
            document.getElementById('serviceImage').value = service.image;
            document.getElementById('serviceIcon').value = service.icon;
            document.getElementById('serviceFeatures').value = service.features.join('\n');
        }
    } catch (error) {
        console.error('Load service error:', error);
    }
}

function closeServiceModal() {
    document.getElementById('serviceModal').classList.remove('active');
}

function editService(id) {
    openServiceModal(id);
}

async function deleteService(id) {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;

    try {
        await apiRequest(`services.php?id=${id}`, 'DELETE');
        showAlert('success', 'Hizmet silindi!');
        loadServices();
        updateStats();
    } catch (error) {
        console.error('Delete service error:', error);
    }
}

document.getElementById('serviceModalForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const serviceId = document.getElementById('serviceId').value;
    const features = document.getElementById('serviceFeatures').value
        .split('\n')
        .filter(f => f.trim() !== '');

    const serviceData = {
        id: serviceId ? parseInt(serviceId) : null,
        title: document.getElementById('serviceTitle').value,
        description: document.getElementById('serviceDescription').value,
        image: document.getElementById('serviceImage').value,
        icon: document.getElementById('serviceIcon').value,
        features: features
    };

    try {
        if (serviceId) {
            await apiRequest('services.php', 'PUT', serviceData);
            showAlert('success', 'Hizmet güncellendi!');
        } else {
            await apiRequest('services.php', 'POST', serviceData);
            showAlert('success', 'Hizmet eklendi!');
        }

        loadServices();
        closeServiceModal();
        updateStats();
    } catch (error) {
        console.error('Save service error:', error);
    }
});

// ===== GALLERY SECTION =====
async function loadGallery() {
    try {
        const data = await apiRequest('gallery.php');
        const gallery = data.gallery;
        const grid = document.getElementById('galleryGrid');
        grid.innerHTML = '';

        gallery.forEach(image => {
            const item = document.createElement('div');
            item.className = 'preview-item';
            item.innerHTML = `
                <img src="${image.image}" alt="${image.alt_text}">
                <button class="preview-remove" onclick="deleteGalleryImage(${image.id})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            grid.appendChild(item);
        });
    } catch (error) {
        console.error('Load gallery error:', error);
    }
}

function openGalleryModal() {
    const modal = document.getElementById('galleryModal');
    modal.classList.add('active');
    document.getElementById('galleryModalForm').reset();
}

function closeGalleryModal() {
    document.getElementById('galleryModal').classList.remove('active');
}

async function deleteGalleryImage(id) {
    if (!confirm('Bu resmi silmek istediğinizden emin misiniz?')) return;

    try {
        await apiRequest(`gallery.php?id=${id}`, 'DELETE');
        showAlert('success', 'Resim silindi!');
        loadGallery();
        updateStats();
    } catch (error) {
        console.error('Delete image error:', error);
    }
}

document.getElementById('galleryModalForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const imageData = {
        image: document.getElementById('galleryImageUrl').value,
        alt_text: document.getElementById('galleryImageAlt').value || 'Galeri Resmi'
    };

    try {
        await apiRequest('gallery.php', 'POST', imageData);
        showAlert('success', 'Resim eklendi!');
        loadGallery();
        closeGalleryModal();
        updateStats();
    } catch (error) {
        console.error('Add image error:', error);
    }
});

// ===== CONTACT SECTION =====
async function loadContact() {
    try {
        const data = await apiRequest('contact.php');
        const contact = data.contact;

        document.getElementById('contactAddress').value = contact.address || '';
        document.getElementById('contactPhone').value = contact.phone || '';
        document.getElementById('contactEmail').value = contact.email || '';
        document.getElementById('contactWhatsapp').value = contact.whatsapp || '';
        document.getElementById('contactFacebook').value = contact.facebook || '';
        document.getElementById('contactInstagram').value = contact.instagram || '';
    } catch (error) {
        console.error('Load contact error:', error);
    }
}

document.getElementById('contactForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const contactData = {
        address: document.getElementById('contactAddress').value,
        phone: document.getElementById('contactPhone').value,
        email: document.getElementById('contactEmail').value,
        whatsapp: document.getElementById('contactWhatsapp').value,
        facebook: document.getElementById('contactFacebook').value,
        instagram: document.getElementById('contactInstagram').value
    };

    try {
        await apiRequest('contact.php', 'PUT', contactData);
        showAlert('success', 'İletişim bilgileri güncellendi!');
    } catch (error) {
        console.error('Save contact error:', error);
    }
});

// ===== UTILITY FUNCTIONS =====
async function updateStats() {
    try {
        const [servicesData, galleryData] = await Promise.all([
            apiRequest('services.php'),
            apiRequest('gallery.php')
        ]);

        document.getElementById('servicesCount').textContent = servicesData.services.length;
        document.getElementById('galleryCount').textContent = galleryData.gallery.length;
    } catch (error) {
        console.error('Update stats error:', error);
    }
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
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);

        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }
}

async function logout() {
    if (!confirm('Çıkış yapmak istediğinizden emin misiniz?')) return;

    try {
        await apiRequest('auth.php?action=logout', 'POST');
        window.location.href = 'admin-login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// ===== NAVIGATION =====
function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item[data-section]');
    const sections = document.querySelectorAll('.admin-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            menuItems.forEach(m => m.classList.remove('active'));
            this.classList.add('active');

            const sectionId = this.dataset.section + '-section';
            sections.forEach(s => {
                s.style.display = s.id === sectionId ? 'block' : 'none';
                if (s.id === sectionId) s.classList.add('active');
                else s.classList.remove('active');
            });
        });
    });

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
