<?php
/**
 * News Slime Soccer — PHP Backend
 * Flat-file storage, no database needed
 * 
 * Upload to: /slime-soccer/api.php
 * Data auto-creates in: /slime-soccer/data/
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$DATA_DIR = __DIR__ . '/data';
$ROOMS_DIR = $DATA_DIR . '/rooms';

// Auto-create directories
if (!is_dir($DATA_DIR)) mkdir($DATA_DIR, 0755, true);
if (!is_dir($ROOMS_DIR)) mkdir($ROOMS_DIR, 0755, true);

$action = $_GET['action'] ?? '';

// ─── HELPER ───
function readJSON($path) {
    if (!file_exists($path)) return null;
    $content = file_get_contents($path);
    return $content ? json_decode($content, true) : null;
}

function writeJSON($path, $data) {
    file_put_contents($path, json_encode($data), LOCK_EX);
}

function getInput() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function today() {
    return date('Y-m-d');
}

function scoresFile() {
    global $DATA_DIR;
    return $DATA_DIR . '/scores-' . today() . '.json';
}

function cleanOldScores() {
    global $DATA_DIR;
    $files = glob($DATA_DIR . '/scores-*.json');
    $today = today();
    foreach ($files as $f) {
        if (strpos($f, $today) === false) {
            @unlink($f);
        }
    }
}

function cleanOldRooms() {
    global $ROOMS_DIR;
    $files = array_merge(
        glob($ROOMS_DIR . '/*.json'),
        glob($ROOMS_DIR . '/*-input.json')
    );
    $cutoff = time() - 3600; // 1 hour old
    foreach ($files as $f) {
        if (filemtime($f) < $cutoff) {
            @unlink($f);
        }
    }
}

// ─── ROUTES ───
switch ($action) {

    // ── LEADERBOARD ──
    case 'leaderboard':
        cleanOldScores();
        $scores = readJSON(scoresFile()) ?? [];
        usort($scores, fn($a, $b) => $b['wins'] - $a['wins']);
        echo json_encode(['ok' => true, 'data' => array_slice($scores, 0, 100)]);
        break;

    case 'win':
        $input = getInput();
        $name = trim($input['name'] ?? '');
        if (!$name || strlen($name) > 30) {
            echo json_encode(['ok' => false, 'error' => 'Invalid name']);
            break;
        }
        // Sanitize
        $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        
        $scores = readJSON(scoresFile()) ?? [];
        $found = false;
        foreach ($scores as &$entry) {
            if (strtolower($entry['name']) === strtolower($name)) {
                $entry['wins']++;
                $entry['name'] = $name; // keep latest casing
                $found = true;
                break;
            }
        }
        unset($entry);
        if (!$found) {
            $scores[] = ['name' => $name, 'wins' => 1];
        }
        usort($scores, fn($a, $b) => $b['wins'] - $a['wins']);
        $scores = array_slice($scores, 0, 100);
        writeJSON(scoresFile(), $scores);
        echo json_encode(['ok' => true, 'data' => $scores]);
        break;

    // ── MULTIPLAYER ROOMS ──
    case 'room_create':
        cleanOldRooms();
        $input = getInput();
        $code = strtoupper(trim($input['code'] ?? ''));
        $hostName = trim($input['hostName'] ?? '');
        if (!$code || !$hostName || !preg_match('/^[A-Z0-9]{5}$/', $code)) {
            echo json_encode(['ok' => false, 'error' => 'Invalid room']);
            break;
        }
        $room = [
            'status' => 'waiting',
            'hostName' => htmlspecialchars($hostName, ENT_QUOTES, 'UTF-8'),
            'guestName' => null,
            'state' => null,
            'ts' => time()
        ];
        writeJSON($ROOMS_DIR . "/$code.json", $room);
        echo json_encode(['ok' => true]);
        break;

    case 'room_get':
        $code = strtoupper(trim($_GET['code'] ?? ''));
        if (!preg_match('/^[A-Z0-9]{5}$/', $code)) {
            echo json_encode(['ok' => false, 'error' => 'Invalid code']);
            break;
        }
        $room = readJSON($ROOMS_DIR . "/$code.json");
        if (!$room) {
            echo json_encode(['ok' => false, 'error' => 'Room not found']);
            break;
        }
        echo json_encode(['ok' => true, 'data' => $room]);
        break;

    case 'room_update':
        $input = getInput();
        $code = strtoupper(trim($input['code'] ?? ''));
        if (!preg_match('/^[A-Z0-9]{5}$/', $code)) {
            echo json_encode(['ok' => false, 'error' => 'Invalid code']);
            break;
        }
        $room = readJSON($ROOMS_DIR . "/$code.json");
        if (!$room) {
            echo json_encode(['ok' => false, 'error' => 'Room not found']);
            break;
        }
        // Merge update fields
        $allowed = ['status', 'guestName', 'state', 'mw', 'sc'];
        foreach ($allowed as $key) {
            if (isset($input[$key])) {
                $room[$key] = $input[$key];
            }
        }
        $room['ts'] = time();
        writeJSON($ROOMS_DIR . "/$code.json", $room);
        echo json_encode(['ok' => true]);
        break;

    // Guest input channel (separate file for speed)
    case 'input_set':
        $input = getInput();
        $code = strtoupper(trim($input['code'] ?? ''));
        if (!preg_match('/^[A-Z0-9]{5}$/', $code)) {
            echo json_encode(['ok' => false]);
            break;
        }
        writeJSON($ROOMS_DIR . "/$code-input.json", [
            'l' => $input['l'] ?? false,
            'r' => $input['r'] ?? false,
            'u' => $input['u'] ?? false,
            'd' => $input['d'] ?? false,
            'ts' => time()
        ]);
        echo json_encode(['ok' => true]);
        break;

    case 'input_get':
        $code = strtoupper(trim($_GET['code'] ?? ''));
        if (!preg_match('/^[A-Z0-9]{5}$/', $code)) {
            echo json_encode(['ok' => false]);
            break;
        }
        $data = readJSON($ROOMS_DIR . "/$code-input.json");
        echo json_encode(['ok' => true, 'data' => $data]);
        break;

    default:
        echo json_encode(['ok' => false, 'error' => 'Unknown action']);
}
