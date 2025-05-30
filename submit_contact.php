<?php
// Database configuration
$db_host = 'localhost';
$db_name = 'portfolio_db';
$db_user = 'root';
$db_pass = '';

// Establish database connection
try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Get and sanitize form data
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

// Validate inputs
$errors = [];

if (empty($name) || !preg_match('/^[A-Za-z ]+$/', $name)) {
    $errors['name'] = 'Please enter a valid name (letters and spaces only)';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address';
}

if (empty($subject) || strlen($subject) < 5 || strlen($subject) > 100) {
    $errors['subject'] = 'Subject must be between 5 and 100 characters';
}

if (empty($message) || strlen($message) < 10 || strlen($message) > 1000) {
    $errors['message'] = 'Message must be between 10 and 1000 characters';
}

// If there are errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'errors' => $errors]);
    exit;
}

try {
    // Prepare SQL statement
    $stmt = $pdo->prepare("INSERT INTO contacts (name, email, subject, message, created_at) 
                          VALUES (:name, :email, :subject, :message, NOW())");
    
    // Bind parameters
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':subject', $subject);
    $stmt->bindParam(':message', $message);
    
    // Execute the query
    $stmt->execute();
    
    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you for your message! We will get back to you soon.'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to save your message. Please try again later.'
    ]);
}
?>