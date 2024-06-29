<?php
// Veritabanı bağlantısı
$db = new mysqli('localhost', 'username', 'password', 'database_name');

function generateShortCode($length = 6) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $shortCode = '';
    for ($i = 0; $i < $length; $i++) {
        $shortCode .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $shortCode;
}

function createShortUrl($longUrl) {
    global $db;
    $shortCode = generateShortCode();
    
    $stmt = $db->prepare("INSERT INTO short_urls (short_code, long_url) VALUES (?, ?)");
    $stmt->bind_param("ss", $shortCode, $longUrl);
    $stmt->execute();
    
    return $shortCode;
}

function redirectToLongUrl($shortCode) {
    global $db;
    
    $stmt = $db->prepare("SELECT long_url FROM short_urls WHERE short_code = ?");
    $stmt->bind_param("s", $shortCode);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        header("Location: " . $row['long_url']);
        exit;
    } else {
        echo "Short URL not found.";
    }
}

// API endpoint for URL shortening
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['url'])) {
        $longUrl = $data['url'];
        $shortCode = createShortUrl($longUrl);
        $shortUrl = "http://" . $_SERVER['HTTP_HOST'] . "/s/" . $shortCode;
        echo json_encode(['short_url' => $shortUrl]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No URL provided']);
    }
}

// Redirect for short URLs
if (isset($_GET['code'])) {
    redirectToLongUrl($_GET['code']);
}
?>