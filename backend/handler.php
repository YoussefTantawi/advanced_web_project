<?php 
//  DATABASE CONNECTION
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "codeKnightsdb";

$conn = mysqli_connect($host, $user, $pass, $dbname);

if (!$conn)
    die("Connection failed: " . mysqli_connect_error());

//  INSERT FORM DATA
if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $full_name = $_POST['fullName'];
    $phone_number = $_POST['phoneNumber'];
    $email_address = $_POST['emailAddress'];
    $project_idea = $_POST['projectIdea'];
    $project_description = $_POST['projectDescription'];
    $service_type = $_POST['serviceType'];

    $query = "INSERT INTO project_inquiries
        (full_name, phone_number, email_address, project_idea, project_description, service_type)
        VALUES
        ('$full_name', '$phone_number', '$email_address', '$project_idea', '$project_description', '$service_type')";

    mysqli_query($conn, $query);

    echo "<p style='text-align:center;color:green;font-weight:bold;'>Project Sent Successfully!</p>";
}
?>
