<!-- <?php
/**
 * Function to handle contact form submissions
 * @param array $formData Array containing form data
 * @return array Response array with success status and message
 */
function handleContactForm($formData) {
    // Configuration
    $to = 'your-email@example.com'; // Replace with your email
    $maxSubjectLength = 100;
    $maxMessageLength = 1000;

    // Validate input
    $errors = [];
    
    // Required fields
    $requiredFields = ['name', 'email', 'subject', 'message'];
    foreach ($requiredFields as $field) {
        if (empty($formData[$field])) {
            $errors[] = ucfirst($field) . ' is required.';
        }
    }

    // Email validation
    if (!empty($formData['email']) && !filter_var($formData['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please enter a valid email address.';
    }

    // Message length validation
    if (!empty($formData['message']) && strlen($formData['message']) > $maxMessageLength) {
        $errors[] = 'Message is too long. Maximum ' . $maxMessageLength . ' characters allowed.';
    }

    // If there are errors, return them
    if (!empty($errors)) {
        return [
            'success' => false,
            'message' => implode(' ', $errors)
        ];
    }

    // Prepare email
    $headers = array(
        'From: ' . $formData['email'],
        'Reply-To: ' . $formData['email'],
        'Content-type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        'X-Mailer: PHP/' . phpversion()
    );

    // Format the message body
    $messageBody = "<h3>Contact Form Submission</h3>";
    $messageBody .= "<p><strong>Name:</strong> " . htmlspecialchars($formData['name']) . "</p>";
    $messageBody .= "<p><strong>Email:</strong> " . htmlspecialchars($formData['email']) . "</p>";
    $messageBody .= "<p><strong>Subject:</strong> " . htmlspecialchars(substr($formData['subject'], 0, $maxSubjectLength)) . "</p>";
    $messageBody .= "<p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($formData['message'])) . "</p>";

    // Send the email
    $headers = implode("\r\n", $headers);
    $subject = "Portfolio Contact: " . substr($formData['subject'], 0, $maxSubjectLength);

    try {
        // Set a reasonable timeout
        ini_set('max_execution_time', 30);
        
        // Send email
        $sent = mail($to, $subject, $messageBody, $headers);
        
        if ($sent) {
            return [
                'success' => true,
                'message' => 'Message sent successfully!'
            ];
        } else {
            throw new Exception('Failed to send email');
        }
    } catch (Exception $e) {
        error_log("Contact form error: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to send message. Please try again later.'
        ];
    }
}

// Main execution
header('Content-Type: application/json; charset=utf-8');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get POST data
$formData = [];
foreach (['name', 'email', 'subject', 'message'] as $field) {
    $formData[$field] = isset($_POST[$field]) ? trim($_POST[$field]) : '';
}

// Handle the form submission
$response = handleContactForm($formData);

// Return JSON response
http_response_code($response['success'] ? 200 : 500);
echo json_encode($response);
?> -->
