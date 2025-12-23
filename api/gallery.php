<?php
require_once '../config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];
$db = getDb();

// ===== GET ALL GALLERY IMAGES =====
if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM gallery ORDER BY sort_order ASC");
        $images = $stmt->fetchAll();

        jsonResponse(['success' => true, 'gallery' => $images]);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}

// ===== ADD IMAGE =====
if ($method === 'POST') {
    requireAuth();

    $data = json_decode(file_get_contents('php://input'), true);

    $image = sanitize($data['image'] ?? '');
    $altText = sanitize($data['alt_text'] ?? 'Galeri Resmi');

    if (empty($image)) {
        jsonResponse(['success' => false, 'error' => 'Resim URL gereklidir'], 400);
    }

    try {
        $stmt = $db->query("SELECT MAX(sort_order) as max_order FROM gallery");
        $result = $stmt->fetch();
        $sortOrder = ($result['max_order'] ?? 0) + 1;

        $stmt = $db->prepare("INSERT INTO gallery (image, alt_text, sort_order) VALUES (?, ?, ?)");
        $stmt->execute([$image, $altText, $sortOrder]);

        $newId = $db->lastInsertId();

        jsonResponse([
            'success' => true,
            'message' => 'Resim eklendi',
            'id' => $newId
        ]);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}

// ===== DELETE IMAGE =====
if ($method === 'DELETE') {
    requireAuth();

    $id = intval($_GET['id'] ?? 0);

    if ($id <= 0) {
        jsonResponse(['success' => false, 'error' => 'Geçersiz ID'], 400);
    }

    try {
        $stmt = $db->prepare("DELETE FROM gallery WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse(['success' => true, 'message' => 'Resim silindi']);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}
?>
