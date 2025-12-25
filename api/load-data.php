<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$filePath = __DIR__ . '/../data/site-data.json';

// Check if file exists
if (!file_exists($filePath)) {
    // Return empty object if no data saved yet
    echo json_encode(null);
    exit();
}

// Read and return the data
$data = file_get_contents($filePath);

if ($data === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to read data']);
    exit();
}

// Return the data as-is (it's already JSON)
echo $data;
?>
