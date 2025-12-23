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

// ===== GET ABOUT DATA =====
if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM about LIMIT 1");
        $about = $stmt->fetch();

        if (!$about) {
            jsonResponse(['success' => false, 'error' => 'Veri bulunamadı'], 404);
        }

        jsonResponse(['success' => true, 'about' => $about]);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}

// ===== UPDATE ABOUT DATA =====
if ($method === 'PUT' || $method === 'POST') {
    requireAuth();

    $data = json_decode(file_get_contents('php://input'), true);

    $title = sanitize($data['title'] ?? '');
    $text1 = sanitize($data['text1'] ?? '');
    $text2 = sanitize($data['text2'] ?? '');
    $image = sanitize($data['image'] ?? '');

    if (empty($title)) {
        jsonResponse(['success' => false, 'error' => 'Başlık gereklidir'], 400);
    }

    try {
        $checkStmt = $db->query("SELECT id FROM about LIMIT 1");
        $exists = $checkStmt->fetch();

        if ($exists) {
            $stmt = $db->prepare("UPDATE about SET title = ?, text1 = ?, text2 = ?, image = ? WHERE id = ?");
            $stmt->execute([$title, $text1, $text2, $image, $exists['id']]);
        } else {
            $stmt = $db->prepare("INSERT INTO about (title, text1, text2, image) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $text1, $text2, $image]);
        }

        jsonResponse(['success' => true, 'message' => 'Hakkımızda bölümü güncellendi']);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}
?>
