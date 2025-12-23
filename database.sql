-- ===== KAHVALTI & ORGANİZASYON VERİTABANI =====
-- Bu dosyayı phpMyAdmin'de çalıştırın

CREATE DATABASE IF NOT EXISTS kahvalti_organizasyon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kahvalti_organizasyon;

-- Admins Tablosu
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Varsayılan admin kullanıcısı (şifre: admin123)
INSERT INTO admins (username, password, email) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@kahvalti.com');

-- Hero Section
CREATE TABLE IF NOT EXISTS hero (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    background_image VARCHAR(500),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO hero (title, subtitle, background_image) VALUES
('Lezzet Dolu Anlarınıza Eşlik Ediyoruz',
 'Kahvaltı ve organizasyon hizmetlerimizle özel günlerinizi unutulmaz kılıyoruz',
 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=1920');

-- About Section
CREATE TABLE IF NOT EXISTS about (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text1 TEXT,
    text2 TEXT,
    image VARCHAR(500),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO about (title, text1, text2, image) VALUES
('Sizin İçin Buradayız',
 'Yılların deneyimi ve tutkusuyla, kahvaltı ve organizasyon hizmetlerinde kalite standartlarını yeniden tanımlıyoruz. Taze malzemeler, özenli sunum ve kusursuz hizmet anlayışımızla özel günlerinizi unutulmaz kılıyoruz.',
 'Doğum günlerinden düğünlere, kurumsal etkinliklerden aile toplantılarına kadar her türlü organizasyonda yanınızdayız.',
 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800');

-- Services
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    icon VARCHAR(100),
    features TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO services (title, description, image, icon, features, sort_order) VALUES
('Serpme Kahvaltı',
 'Zengin çeşitleri ve taze ürünleriyle doyurucu serpme kahvaltı seçeneklerimiz.',
 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600',
 'fas fa-utensils',
 'Çeşit çeşit peynirler|Ev yapımı reçeller|Sıcak börekler|Taze meyve sunumları',
 1),
('Doğum Günü & Parti',
 'Doğum günü ve özel günleriniz için tam paket organizasyon hizmetleri.',
 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600',
 'fas fa-birthday-cake',
 'Özel dekorasyon|Pasta ve ikramlar|Animasyon hizmetleri|Fotoğraf çekimi',
 2),
('Kurumsal Organizasyon',
 'Şirket etkinlikleri ve toplantılarınız için profesyonel çözümler.',
 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600',
 'fas fa-briefcase',
 'Toplantı kahvaltıları|Kokteyl organizasyonu|Kurumsal etkinlikler|Özel menü planlaması',
 3),
('Düğün & Nişan',
 'Hayatınızın en özel gününde yanınızdayız, her detayı kusursuz planlıyoruz.',
 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600',
 'fas fa-ring',
 'Nişan organizasyonu|Düğün yemek servisi|Kokteyl ikramları|Gelin çıkma kahvaltısı',
 4);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO gallery (image, alt_text, sort_order) VALUES
('https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800', 'Kahvaltı 1', 1),
('https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800', 'Kahvaltı 2', 2),
('https://images.unsplash.com/photo-1555244162-803834f70033?w=800', 'Parti', 3),
('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', 'Kurumsal', 4),
('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', 'Düğün', 5);

-- Contact
CREATE TABLE IF NOT EXISTS contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    whatsapp VARCHAR(50),
    facebook VARCHAR(255),
    instagram VARCHAR(255),
    twitter VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO contact (address, phone, email, whatsapp, facebook, instagram) VALUES
('Örnek Mahallesi, Lezzet Sokak No:123\nİstanbul, Türkiye',
 '0 555 123 45 67',
 'info@kahvaltiorganizasyon.com',
 '905551234567',
 '#',
 '#');

-- Settings (Genel Ayarlar)
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO settings (setting_key, setting_value) VALUES
('site_name', 'Kahvaltı & Organizasyon'),
('site_description', 'Lezzet dolu anlarınıza eşlik ediyoruz'),
('timezone', 'Europe/Istanbul');

-- Contact Messages (İletişim Formu Mesajları)
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
