<?php
// Database connection (without database name first)
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "codeKnightsdb";

$conn = new mysqli($host, $user, $pass);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql_db = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql_db)) {
    echo "Database created successfully<br>";
} else {
    echo "Error creating database: " . $conn->error . "<br>";
}

// Select the database
$conn->select_db($dbname);

// Create table
$sql_table = "CREATE TABLE IF NOT EXISTS project_inquiries (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email_address VARCHAR(100) NOT NULL,
    project_idea VARCHAR(255) NOT NULL,
    project_description TEXT NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql_table)) {
    echo "Table created successfully<br>";
} else {
    echo "Error creating table: " . $conn->error . "<br>";
}

$conn->close();

echo "<br><a href='../index.htm'>← Go to Website</a>";
?>