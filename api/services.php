<?php
require_once '../config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];
$db = getDb();

// ===== GET ALL SERVICES =====
if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM services ORDER BY sort_order ASC");
        $services = $stmt->fetchAll();

        // Features'ı array'e çevir
        foreach ($services as &$service) {
            $service['features'] = $service['features'] ? explode('|', $service['features']) : [];
        }

        jsonResponse(['success' => true, 'services' => $services]);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}

// ===== ADD SERVICE =====
if ($method === 'POST') {
    requireAuth();

    $data = json_decode(file_get_contents('php://input'), true);

    $title = sanitize($data['title'] ?? '');
    $description = sanitize($data['description'] ?? '');
    $image = sanitize($data['image'] ?? '');
    $icon = sanitize($data['icon'] ?? '');
    $features = $data['features'] ?? [];

    if (empty($title) || empty($description)) {
        jsonResponse(['success' => false, 'error' => 'Başlık ve açıklama gereklidir'], 400);
    }

    // Features array'i string'e çevir
    $featuresStr = is_array($features) ? implode('|', $features) : '';

    try {
        // Son sort_order'ı al
        $stmt = $db->query("SELECT MAX(sort_order) as max_order FROM services");
        $result = $stmt->fetch();
        $sortOrder = ($result['max_order'] ?? 0) + 1;

        $stmt = $db->prepare("INSERT INTO services (title, description, image, icon, features, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $description, $image, $icon, $featuresStr, $sortOrder]);

        $newId = $db->lastInsertId();

        jsonResponse([
            'success' => true,
            'message' => 'Hizmet eklendi',
            'id' => $newId
        ]);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}

// ===== UPDATE SERVICE =====
if ($method === 'PUT') {
    requireAuth();

    $data = json_decode(file_get_contents('php://input'), true);

    $id = intval($data['id'] ?? 0);
    $title = sanitize($data['title'] ?? '');
    $description = sanitize($data['description'] ?? '');
    $image = sanitize($data['image'] ?? '');
    $icon = sanitize($data['icon'] ?? '');
    $features = $data['features'] ?? [];

    if ($id <= 0 || empty($title) || empty($description)) {
        jsonResponse(['success' => false, 'error' => 'Geçersiz veriler'], 400);
    }

    $featuresStr = is_array($features) ? implode('|', $features) : '';

    try {
        $stmt = $db->prepare("UPDATE services SET title = ?, description = ?, image = ?, icon = ?, features = ? WHERE id = ?");
        $stmt->execute([$title, $description, $image, $icon, $featuresStr, $id]);

        jsonResponse(['success' => true, 'message' => 'Hizmet güncellendi']);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}

// ===== DELETE SERVICE =====
if ($method === 'DELETE') {
    requireAuth();

    $id = intval($_GET['id'] ?? 0);

    if ($id <= 0) {
        jsonResponse(['success' => false, 'error' => 'Geçersiz ID'], 400);
    }

    try {
        $stmt = $db->prepare("DELETE FROM services WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse(['success' => true, 'message' => 'Hizmet silindi']);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}
?>
