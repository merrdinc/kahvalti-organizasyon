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

// ===== GET CONTACT DATA =====
if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM contact LIMIT 1");
        $contact = $stmt->fetch();

        if (!$contact) {
            jsonResponse(['success' => false, 'error' => 'Veri bulunamadı'], 404);
        }

        jsonResponse(['success' => true, 'contact' => $contact]);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}

// ===== UPDATE CONTACT DATA =====
if ($method === 'PUT' || $method === 'POST') {
    requireAuth();

    $data = json_decode(file_get_contents('php://input'), true);

    $address = sanitize($data['address'] ?? '');
    $phone = sanitize($data['phone'] ?? '');
    $email = sanitize($data['email'] ?? '');
    $whatsapp = sanitize($data['whatsapp'] ?? '');
    $facebook = sanitize($data['facebook'] ?? '');
    $instagram = sanitize($data['instagram'] ?? '');
    $twitter = sanitize($data['twitter'] ?? '');

    try {
        $checkStmt = $db->query("SELECT id FROM contact LIMIT 1");
        $exists = $checkStmt->fetch();

        if ($exists) {
            $stmt = $db->prepare("UPDATE contact SET address = ?, phone = ?, email = ?, whatsapp = ?, facebook = ?, instagram = ?, twitter = ? WHERE id = ?");
            $stmt->execute([$address, $phone, $email, $whatsapp, $facebook, $instagram, $twitter, $exists['id']]);
        } else {
            $stmt = $db->prepare("INSERT INTO contact (address, phone, email, whatsapp, facebook, instagram, twitter) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$address, $phone, $email, $whatsapp, $facebook, $instagram, $twitter]);
        }

        jsonResponse(['success' => true, 'message' => 'İletişim bilgileri güncellendi']);
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}
?>
