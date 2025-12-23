<?php
// ===== VERİTABANI AYARLARI =====
// Bu dosyayı hosting'inizdeki bilgilerle güncelleyin

// Veritabanı Bağlantı Bilgileri
define('DB_HOST', 'localhost');           // Genellikle 'localhost'
define('DB_NAME', 'kahvalti_organizasyon'); // Veritabanı adı
define('DB_USER', 'root');                 // Veritabanı kullanıcı adı
define('DB_PASS', '');                     // Veritabanı şifresi
define('DB_CHARSET', 'utf8mb4');

// Site Ayarları
define('SITE_URL', 'http://localhost/kahvalti-organizasyon');
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('UPLOAD_URL', SITE_URL . '/uploads/');

// Güvenlik
define('JWT_SECRET', 'your-secret-key-change-this-in-production'); // ÜRETİMDE DEĞİŞTİRİN!
define('SESSION_TIMEOUT', 3600); // 1 saat

// Hata Ayarları
error_reporting(E_ALL);
ini_set('display_errors', 1); // ÜRETİMDE 0 YAPIN!

// Timezone
date_default_timezone_set('Europe/Istanbul');

// Veritabanı Bağlantısı
class Database {
    private static $instance = null;
    private $connection;

    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            die(json_encode([
                'success' => false,
                'error' => 'Veritabanı bağlantı hatası: ' . $e->getMessage()
            ]));
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }
}

// Helper Functions
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getDb() {
    return Database::getInstance()->getConnection();
}

function isLoggedIn() {
    session_start();
    return isset($_SESSION['admin_id']) && !empty($_SESSION['admin_id']);
}

function requireAuth() {
    if (!isLoggedIn()) {
        jsonResponse(['success' => false, 'error' => 'Giriş yapmanız gerekiyor'], 401);
    }
}

function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Upload klasörünü oluştur
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
    mkdir(UPLOAD_DIR . 'services/', 0755, true);
    mkdir(UPLOAD_DIR . 'gallery/', 0755, true);
    mkdir(UPLOAD_DIR . 'hero/', 0755, true);
    mkdir(UPLOAD_DIR . 'about/', 0755, true);
}
?>
