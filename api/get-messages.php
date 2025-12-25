<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$messagesDir = __DIR__ . '/../data/messages';

// DELETE - Remove a message
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $filename = isset($input['filename']) ? basename($input['filename']) : '';
    
    if (empty($filename)) {
        echo json_encode(['success' => false, 'error' => 'Dosya adi belirtilmedi']);
        exit();
    }
    
    $filePath = $messagesDir . '/' . $filename;
    
    if (file_exists($filePath) && unlink($filePath)) {
        echo json_encode(['success' => true, 'message' => 'Mesaj silindi']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Mesaj silinemedi']);
    }
    exit();
}

// GET - List all messages
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $messages = [];
    
    if (!is_dir($messagesDir)) {
        echo json_encode(['success' => true, 'messages' => [], 'count' => 0]);
        exit();
    }
    
    $files = glob($messagesDir . '/contact_*.json');
    
    // Sort by modification time (newest first)
    usort($files, function($a, $b) {
        return filemtime($b) - filemtime($a);
    });
    
    foreach ($files as $file) {
        $content = file_get_contents($file);
        $data = json_decode($content, true);
        
        if ($data) {
            $data['filename'] = basename($file);
            $data['id'] = pathinfo($file, PATHINFO_FILENAME);
            $messages[] = $data;
        }
    }
    
    echo json_encode([
        'success' => true,
        'messages' => $messages,
        'count' => count($messages)
    ]);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
?>
