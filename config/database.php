<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');      // Default XAMPP username
define('DB_PASS', '');         // Default XAMPP password
define('DB_NAME', 'portfolio_db');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8mb4 for proper character encoding
$conn->set_charset("utf8mb4");

// Function to close the database connection
function closeConnection() {
    global $conn;
    if (isset($conn)) {
        $conn->close();
    }
}

// Register shutdown function to ensure connection is closed
register_shutdown_function('closeConnection');
?>
