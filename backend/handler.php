<?php
require_once 'connection.php';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $stmt = $conn->prepare(
        "INSERT INTO project_inquiries 
        (full_name, phone_number, email_address, project_idea, project_description, service_type)
        VALUES (?, ?, ?, ?, ?, ?)"
    );
    
    $stmt->bind_param("ssssss", 
        $_POST['fullName'],
        $_POST['phoneNumber'],
        $_POST['emailAddress'],
        $_POST['projectIdea'],
        $_POST['projectDescription'],
        $_POST['serviceType']
    );
    
    if ($stmt->execute()) {
        echo "<p style='text-align:center;color:green;font-weight:bold;'>Project Sent Successfully!</p>";
    } else {
        echo "<p style='text-align:center;color:red;font-weight:bold;'>Error: " . $stmt->error . "</p>";
    }
    
    $stmt->close();
}

$conn->close();
?>