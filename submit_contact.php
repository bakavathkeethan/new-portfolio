<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Log the POST data for debugging
file_put_contents('debug.log', print_r($_POST, true), FILE_APPEND);

try {
    require_once 'config/database.php';
    
    // Check database connection
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Only process POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Invalid request method");
    }

    // Get and sanitize form data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Log received data
    file_put_contents('debug.log', "Name: $name, Email: $email, Subject: $subject\n", FILE_APPEND);

    // Validate inputs
    $errors = [];

    if (empty($name) || !preg_match('/^[A-Za-z\s]+$/', $name)) {
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
    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $subject, $message);
    
    // Execute the query
    if ($stmt->execute()) {
        // Send email notification (optional)
        $to = 'your-email@example.com';
        $email_subject = "New Contact Form Submission: $subject";
        $email_body = "You have received a new message from your website contact form.\n\n".
                     "Name: $name\n".
                     "Email: $email\n".
                     "Subject: $subject\n".
                     "Message:\n$message";
        $headers = "From: $email\r\n".
                  "Reply-To: $email\r\n".
                  'X-Mailer: PHP/'.phpversion();
        
        // Uncomment to enable email sending
        // mail($to, $email_subject, $email_body, $headers);
        
        // Return success response
        echo json_encode([
            'status' => 'success',
            'message' => 'Thank you for your message! We will get back to you soon.'
        ]);
    } else {
        throw new Exception('Failed to save contact');
    }
    
} catch (Exception $e) {
    error_log('Contact form error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to process your request. Please try again later.'
    ]);
}
?>
