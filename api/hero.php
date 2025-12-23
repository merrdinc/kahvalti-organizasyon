<?php
require_once '../config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];
$db = getDb();

// ===== GET HERO DATA =====
if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM hero LIMIT 1");
        $hero = $stmt->fetch();

        if (!$hero) {
            jsonResponse(['success' => false, 'error' => 'Veri bulunamadı'], 404);
        }

        jsonResponse(['success' => true, 'hero' => $hero]);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}

// ===== UPDATE HERO DATA =====
if ($method === 'PUT' || $method === 'POST') {
    requireAuth();

    $data = json_decode(file_get_contents('php://input'), true);

    $title = sanitize($data['title'] ?? '');
    $subtitle = sanitize($data['subtitle'] ?? '');
    $backgroundImage = sanitize($data['background_image'] ?? '');

    if (empty($title)) {
        jsonResponse(['success' => false, 'error' => 'Başlık gereklidir'], 400);
    }

    try {
        // İlk satırı güncelle veya ekle
        $checkStmt = $db->query("SELECT id FROM hero LIMIT 1");
        $exists = $checkStmt->fetch();

        if ($exists) {
            $stmt = $db->prepare("UPDATE hero SET title = ?, subtitle = ?, background_image = ? WHERE id = ?");
            $stmt->execute([$title, $subtitle, $backgroundImage, $exists['id']]);
        } else {
            $stmt = $db->prepare("INSERT INTO hero (title, subtitle, background_image) VALUES (?, ?, ?)");
            $stmt->execute([$title, $subtitle, $backgroundImage]);
        }

        jsonResponse(['success' => true, 'message' => 'Hero bölümü güncellendi']);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}
?>
