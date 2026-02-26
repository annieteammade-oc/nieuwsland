<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$file = __DIR__ . '/scores.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo file_exists($file) ? file_get_contents($file) : '[]';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || !isset($input['name'], $input['score'])) {
        http_response_code(400);
        echo '{"error":"invalid"}';
        exit;
    }

    $scores = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $scores[] = [
        'name' => substr(strip_tags($input['name']), 0, 12),
        'email' => filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL),
        'score' => (int)$input['score'],
        'theme' => substr(strip_tags($input['theme'] ?? ''), 0, 30),
        'level' => (int)($input['level'] ?? 0),
        'date' => time()
    ];

    usort($scores, fn($a, $b) => $b['score'] - $a['score']);
    $scores = array_slice($scores, 0, 100);
    file_put_contents($file, json_encode($scores));
    echo json_encode($scores);
    exit;
}
