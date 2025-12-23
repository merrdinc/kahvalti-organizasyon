<?php
require_once '../config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// ===== LOGIN =====
if ($method === 'POST' && $action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);

    $username = sanitize($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        jsonResponse(['success' => false, 'error' => 'Kullanıcı adı ve şifre gereklidir'], 400);
    }

    try {
        $db = getDb();
        $stmt = $db->prepare("SELECT id, username, password, email FROM admins WHERE username = ?");
        $stmt->execute([$username]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($password, $admin['password'])) {
            session_start();
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            $_SESSION['login_time'] = time();

            // Son giriş zamanını güncelle
            $updateStmt = $db->prepare("UPDATE admins SET last_login = NOW() WHERE id = ?");
            $updateStmt->execute([$admin['id']]);

            jsonResponse([
                'success' => true,
                'message' => 'Giriş başarılı',
                'admin' => [
                    'id' => $admin['id'],
                    'username' => $admin['username'],
                    'email' => $admin['email']
                ]
            ]);
        } else {
            jsonResponse(['success' => false, 'error' => 'Hatalı kullanıcı adı veya şifre'], 401);
        }
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}

// ===== LOGOUT =====
if ($method === 'POST' && $action === 'logout') {
    session_start();
    session_destroy();
    jsonResponse(['success' => true, 'message' => 'Çıkış başarılı']);
}

// ===== CHECK SESSION =====
if ($method === 'GET' && $action === 'check') {
    session_start();
    if (isLoggedIn()) {
        jsonResponse([
            'success' => true,
            'loggedIn' => true,
            'admin' => [
                'id' => $_SESSION['admin_id'],
                'username' => $_SESSION['admin_username']
            ]
        ]);
    } else {
        jsonResponse(['success' => true, 'loggedIn' => false]);
    }
}

// ===== CHANGE PASSWORD =====
if ($method === 'POST' && $action === 'change-password') {
    requireAuth();

    $data = json_decode(file_get_contents('php://input'), true);

    $oldPassword = $data['oldPassword'] ?? '';
    $newPassword = $data['newPassword'] ?? '';

    if (empty($oldPassword) || empty($newPassword)) {
        jsonResponse(['success' => false, 'error' => 'Eski ve yeni şifre gereklidir'], 400);
    }

    if (strlen($newPassword) < 6) {
        jsonResponse(['success' => false, 'error' => 'Yeni şifre en az 6 karakter olmalıdır'], 400);
    }

    try {
        $db = getDb();
        session_start();

        $stmt = $db->prepare("SELECT password FROM admins WHERE id = ?");
        $stmt->execute([$_SESSION['admin_id']]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($oldPassword, $admin['password'])) {
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            $updateStmt = $db->prepare("UPDATE admins SET password = ? WHERE id = ?");
            $updateStmt->execute([$hashedPassword, $_SESSION['admin_id']]);

            jsonResponse(['success' => true, 'message' => 'Şifre başarıyla değiştirildi']);
        } else {
            jsonResponse(['success' => false, 'error' => 'Eski şifre yanlış'], 401);
        }
    } catch (PDOException $e) {
        jsonResponse(['success' => false, 'error' => 'Veritabanı hatası'], 500);
    }
}

jsonResponse(['success' => false, 'error' => 'Geçersiz istek'], 400);
?>
