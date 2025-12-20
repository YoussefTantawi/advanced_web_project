<?php
// backend/setup_database.php

// إعدادات الاتصال
$host = "localhost";
$username = "root";
$password = "";

// إنشاء الاتصال
$conn = new mysqli($host, $username, $password);

// التحقق من الاتصال
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// إنشاء قاعدة البيانات
$database = "code_knights_db";
$sql = "CREATE DATABASE IF NOT EXISTS $database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";

if ($conn->query($sql) === TRUE) {
    echo "<h2>Database created successfully ✅</h2>";
    
    // استخدام قاعدة البيانات
    $conn->select_db($database);
    
    // إنشاء جدول الاستفسارات
    $sql = "CREATE TABLE IF NOT EXISTS inquiries (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        email_address VARCHAR(100) NOT NULL,
        project_idea VARCHAR(200) NOT NULL,
        project_description TEXT NOT NULL,
        service_type VARCHAR(50) NOT NULL,
        submission_date DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email_address),
        INDEX idx_date (submission_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    if ($conn->query($sql) === TRUE) {
        echo "<p>Table 'inquiries' created successfully ✅</p>";
    } else {
        echo "<p style='color: red;'>Error creating table: " . $conn->error . "</p>";
    }
    
    // إنشاء جدول للخدمات
    $sql = "CREATE TABLE IF NOT EXISTS services (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        service_name VARCHAR(100) NOT NULL,
        description TEXT,
        min_price DECIMAL(10,2),
        max_price DECIMAL(10,2),
        delivery_time VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    if ($conn->query($sql) === TRUE) {
        echo "<p>Table 'services' created successfully ✅</p>";
        
        // إدخال بيانات الخدمات
        $services = [
            ['Web Development', 'Custom web applications built with modern technologies', 2000, 10000, '2-4 weeks'],
            ['Mobile Apps', 'Native and cross-platform mobile applications', 5000, 20000, '4-8 weeks'],
            ['UI/UX Design', 'Beautiful and intuitive user interface designs', 1000, 5000, '1-2 weeks'],
            ['E-commerce', 'Complete online store solutions', 3000, 15000, '3-6 weeks']
        ];
        
        foreach ($services as $service) {
            $check_sql = "SELECT id FROM services WHERE service_name = '" . $service[0] . "'";
            $result = $conn->query($check_sql);
            
            if ($result->num_rows == 0) {
                $stmt = $conn->prepare("INSERT INTO services (service_name, description, min_price, max_price, delivery_time) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("ssdds", $service[0], $service[1], $service[2], $service[3], $service[4]);
                
                if ($stmt->execute()) {
                    echo "<p>Service '{$service[0]}' added ✅</p>";
                } else {
                    echo "<p style='color: red;'>Error adding service '{$service[0]}': " . $stmt->error . "</p>";
                }
                $stmt->close();
            }
        }
    } else {
        echo "<p style='color: red;'>Error creating table: " . $conn->error . "</p>";
    }
    
    // إنشاء جدول للفريق
    $sql = "CREATE TABLE IF NOT EXISTS team_members (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        image_path VARCHAR(255),
        skills TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    if ($conn->query($sql) === TRUE) {
        echo "<p>Table 'team_members' created successfully ✅</p>";
        
        // إدخال بيانات الفريق
        $team_members = [
            ['Assem', 'Frontend Developer', 'assets/images/team/Assem.jpg', 'HTML, CSS, TypeScript', 'Frontend developer specializing in modern web technologies'],
            ['Ojaly', 'Backend .NET Developer', 'assets/images/team/Ojaly.jpg', 'ASP.NET, MVC, API', 'Backend developer with expertise in .NET framework'],
            ['Tantawi', 'Flutter Developer', 'assets/images/team/Tantawi.jpg', 'Networking & APIs, State Management, Dart', 'Mobile app developer specializing in Flutter'],
            ['Abdelrahman', 'Full Stack .NET Developer', 'assets/images/team/Abdo.jpg', 'ASP.NET, MVC, HTML, CSS, JavaScript, Bootstrap', 'Full stack developer with .NET expertise']
        ];
        
        foreach ($team_members as $member) {
            $check_sql = "SELECT id FROM team_members WHERE name = '" . $member[0] . "'";
            $result = $conn->query($check_sql);
            
            if ($result->num_rows == 0) {
                $stmt = $conn->prepare("INSERT INTO team_members (name, role, image_path, skills, bio) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("sssss", $member[0], $member[1], $member[2], $member[3], $member[4]);
                
                if ($stmt->execute()) {
                    echo "<p>Team member '{$member[0]}' added ✅</p>";
                } else {
                    echo "<p style='color: red;'>Error adding team member '{$member[0]}': " . $stmt->error . "</p>";
                }
                $stmt->close();
            }
        }
    } else {
        echo "<p style='color: red;'>Error creating table: " . $conn->error . "</p>";
    }
    
    echo "<h3 style='color: green; margin-top: 30px;'>🎉 Database setup completed successfully!</h3>";
    echo "<p>You can now:</p>";
    echo "<ol>";
    echo "<li><a href='../index.html' style='color: #6C63FF; text-decoration: none; font-weight: bold;'>Go to Home Page</a></li>";
    echo "<li><a href='view_inquiries.php' style='color: #6C63FF; text-decoration: none; font-weight: bold;'>View Inquiries</a></li>";
    echo "<li><a href='http://localhost/phpmyadmin' target='_blank' style='color: #6C63FF; text-decoration: none; font-weight: bold;'>Check Database in phpMyAdmin</a></li>";
    echo "</ol>";
    
} else {
    echo "<p style='color: red;'>Error creating database: " . $conn->error . "</p>";
}

$conn->close();

// إضافة بعض الأنماط
echo "<style>
    body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 20px;
    }
    .container {
        background: white;
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        max-width: 800px;
        width: 100%;
    }
    h2 { color: #333; border-bottom: 3px solid #6C63FF; padding-bottom: 10px; }
    p { margin: 10px 0; color: #555; }
</style>";
?>