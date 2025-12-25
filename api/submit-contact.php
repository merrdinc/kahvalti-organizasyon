<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Get form data (supports both form-data and JSON)
$contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';

if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = isset($input['name']) ? trim($input['name']) : '';
    $email = isset($input['email']) ? trim($input['email']) : '';
    $phone = isset($input['phone']) ? trim($input['phone']) : '';
    $message = isset($input['message']) ? trim($input['message']) : '';
} else {
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
}

// Validate required fields
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Lutfen tum zorunlu alanlari doldurun.']);
    exit();
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Gecerli bir e-posta adresi girin.']);
    exit();
}

// Load site data to get contact email
$siteDataPath = __DIR__ . '/../data/site-data.json';
$toEmail = 'info@kahvaltiorganizasyon.com';

if (file_exists($siteDataPath)) {
    $siteData = json_decode(file_get_contents($siteDataPath), true);
    if (isset($siteData['contact']['email'])) {
        $toEmail = $siteData['contact']['email'];
    }
}

// Prepare email content
$subject = "=?UTF-8?B?" . base64_encode("Yeni Iletisim Formu: " . $name) . "?=";
$emailBody = "
=================================
YENI ILETISIM FORMU MESAJI
=================================

Ad Soyad: $name
E-posta: $email
Telefon: $phone

Mesaj:
$message

=================================
Bu mesaj web sitenizden gonderilmistir.
Tarih: " . date('Y-m-d H:i:s') . "
";

// Email headers
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Try to send email
$mailSent = @mail($toEmail, $subject, $emailBody, $headers);

// Save to a log file as backup
$logDir = __DIR__ . '/../data/messages';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

$logFile = $logDir . '/contact_' . date('Y-m-d_H-i-s') . '_' . uniqid() . '.json';
$logData = [
    'date' => date('Y-m-d H:i:s'),
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'message' => $message,
    'email_sent' => $mailSent
];

file_put_contents($logFile, json_encode($logData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Return success
echo json_encode([
    'success' => true,
    'message' => 'Mesajiniz basariyla gonderildi!'
]);
?>
