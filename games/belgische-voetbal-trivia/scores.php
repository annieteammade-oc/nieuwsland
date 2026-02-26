<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$file = __DIR__ . '/scores.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo '[]';
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['name'], $input['score'], $input['total'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Ongeldige data']);
        exit;
    }

    $scores = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    if (!is_array($scores)) $scores = [];

    $scores[] = [
        'name' => substr(strip_tags($input['name']), 0, 20),
        'score' => (int)$input['score'],
        'total' => (int)$input['total'],
        'percentage' => (int)(($input['score'] / $input['total']) * 100),
        'difficulty' => substr(strip_tags($input['difficulty'] ?? 'makkelijk'), 0, 20),
        'date' => date('Y-m-d')
    ];

    usort($scores, fn($a, $b) => $b['score'] <=> $a['score']);
    $scores = array_slice($scores, 0, 50);

    file_put_contents($file, json_encode($scores, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
    exit;
}