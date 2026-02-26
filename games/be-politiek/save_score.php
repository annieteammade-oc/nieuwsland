<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$file = __DIR__ . '/scores.json';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['name'], $input['score'], $input['total'])) {
    echo json_encode(['error' => 'Ongeldige data']);
    exit;
}

$scores = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
if (!is_array($scores)) $scores = [];

$scores[] = [
    'name'       => substr(strip_tags($input['name']), 0, 20),
    'score'      => (int)$input['score'],
    'total'      => (int)$input['total'],
    'percentage' => (int)$input['percentage'],
    'difficulty' => substr(strip_tags($input['difficulty'] ?? ''), 0, 20),
    'date'       => date('Y-m-d')
];

usort($scores, function($a, $b) {
    return $b['percentage'] <=> $a['percentage'] ?: $b['score'] <=> $a['score'];
});

$scores = array_slice($scores, 0, 50);

file_write_contents($file, json_encode($scores, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo json_encode(['success' => true]);

function file_write_contents($path, $data) {
    $tmp = $path . '.tmp';
    if (file_put_contents($tmp, $data, LOCK_EX) !== false) {
        rename($tmp, $path);
    }
}