<?php
// backend/handler.php

// السماح بطلبات CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// التعامل مع طلبات OPTIONS (لـ CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// إعدادات قاعدة البيانات
$host = "localhost";
$username = "root";
$password = "";
$database = "code_knights_db";

// إنشاء الاتصال
$conn = new mysqli($host, $username, $password, $database);

// التحقق من الاتصال
if ($conn->connect_error) {
    $response = [
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ];
    echo json_encode($response);
    exit();
}

// تعيين ترميز الأحرف
$conn->set_charset("utf8mb4");

// التحقق من طريقة الطلب
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // الحصول على البيانات من JSON body
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    // أو من form-data (للتوافق)
    if (empty($data)) {
        $data = $_POST;
    }
    
    // تنظيف وفلترة البيانات
    $fullName = clean_input($data['fullName'] ?? '');
    $phoneNumber = clean_input($data['phoneNumber'] ?? '');
    $emailAddress = clean_input($data['emailAddress'] ?? '');
    $projectIdea = clean_input($data['projectIdea'] ?? '');
    $projectDescription = clean_input($data['projectDescription'] ?? '');
    $serviceType = clean_input($data['serviceType'] ?? '');
    
    // التحقق من صحة البيانات
    $errors = [];
    
    // التحقق من الاسم
    if (empty($fullName)) {
        $errors['fullName'] = "Full name is required";
    } elseif (strlen($fullName) < 2) {
        $errors['fullName'] = "Name must be at least 2 characters";
    }
    
    // التحقق من الهاتف
    if (empty($phoneNumber)) {
        $errors['phoneNumber'] = "Phone number is required";
    } elseif (!preg_match("/^[\d\s\-\+\(\)]{10,20}$/", $phoneNumber)) {
        $errors['phoneNumber'] = "Please enter a valid phone number (10-20 digits)";
    }
    
    // التحقق من البريد الإلكتروني
    if (empty($emailAddress)) {
        $errors['emailAddress'] = "Email address is required";
    } elseif (!filter_var($emailAddress, FILTER_VALIDATE_EMAIL)) {
        $errors['emailAddress'] = "Please enter a valid email address";
    }
    
    // التحقق من فكرة المشروع
    if (empty($projectIdea)) {
        $errors['projectIdea'] = "Project idea is required";
    } elseif (strlen($projectIdea) < 10) {
        $errors['projectIdea'] = "Please provide a more detailed project idea (minimum 10 characters)";
    }
    
    // التحقق من وصف المشروع
    if (empty($projectDescription)) {
        $errors['projectDescription'] = "Project description is required";
    } elseif (strlen($projectDescription) < 20) {
        $errors['projectDescription'] = "Please provide a more detailed description (minimum 20 characters)";
    }
    
    // التحقق من نوع الخدمة
    if (empty($serviceType)) {
        $errors['serviceType'] = "Please select a service type";
    }
    
    // إذا لم تكن هناك أخطاء
    if (empty($errors)) {
        // إعداد الاستعلام
        $sql = "INSERT INTO inquiries (
            full_name, 
            phone_number, 
            email_address, 
            project_idea, 
            project_description, 
            service_type, 
            submission_date
        ) VALUES (?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $conn->prepare($sql);
        
        if ($stmt) {
            // ربط المعاملات
            $stmt->bind_param(
                "ssssss", 
                $fullName, 
                $phoneNumber, 
                $emailAddress, 
                $projectIdea, 
                $projectDescription, 
                $serviceType
            );
            
            // تنفيذ الاستعلام
            if ($stmt->execute()) {
                $inquiry_id = $stmt->insert_id;
                
                $response = [
                    'success' => true,
                    'message' => 'Thank you! Your project inquiry has been submitted successfully. We will contact you within 24 hours.',
                    'inquiry_id' => $inquiry_id,
                    'data' => [
                        'fullName' => $fullName,
                        'email' => $emailAddress,
                        'project' => $projectIdea,
                        'service' => $serviceType,
                        'timestamp' => date('Y-m-d H:i:s')
                    ]
                ];
                
                // إرسال إشعار بالبريد الإلكتروني (اختياري)
                send_email_notification($fullName, $emailAddress, $projectIdea, $serviceType);
                
                // تسجيل في ملف
                log_inquiry($fullName, $emailAddress, $projectIdea, $serviceType, $inquiry_id);
                
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Sorry, there was an error submitting your inquiry. Please try again later.',
                    'errors' => ['database' => $stmt->error]
                ];
            }
            
            $stmt->close();
        } else {
            $response = [
                'success' => false,
                'message' => 'Sorry, there was an error with the database. Please try again later.',
                'errors' => ['database' => 'Failed to prepare statement']
            ];
        }
    } else {
        $response = [
            'success' => false,
            'message' => 'Please fix the errors in the form.',
            'errors' => $errors
        ];
    }
} else {
    $response = [
        'success' => false,
        'message' => 'Invalid request method. Only POST requests are allowed.',
        'errors' => ['method' => 'Invalid request method']
    ];
}

// إغلاق الاتصال
$conn->close();

// إرجاع الاستجابة كـ JSON
echo json_encode($response);

// دالة لتنظيف المدخلات
function clean_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// دالة لإرسال بريد إلكتروني
function send_email_notification($name, $email, $project, $service) {
    $to = "codenighteg@gmail.com";
    $subject = "🚀 New Project Inquiry - Code Knights";
    
    $message = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
            .header { background: linear-gradient(90deg, #6C63FF, #00D4FF); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .info-item { margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 5px; }
            .label { font-weight: bold; color: #6C63FF; }
            .footer { background: #333; color: white; padding: 20px; text-align: center; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>New Project Inquiry</h1>
                <p>Code Knights Team Portfolio</p>
            </div>
            <div class='content'>
                <h2>Client Information</h2>
                <div class='info-item'>
                    <span class='label'>Name:</span> $name
                </div>
                <div class='info-item'>
                    <span class='label'>Email:</span> $email
                </div>
                <div class='info-item'>
                    <span class='label'>Project Idea:</span> $project
                </div>
                <div class='info-item'>
                    <span class='label'>Service Type:</span> $service
                </div>
                <div class='info-item'>
                    <span class='label'>Submission Time:</span> " . date('Y-m-d H:i:s') . "
                </div>
            </div>
            <div class='footer'>
                <p>Code Knights Team Portfolio | Digital Solutions</p>
                <p><a href='http://localhost/ADVANCED_WEB_PROJECT/backend/view_inquiries.php' style='color: #00D4FF;'>View All Inquiries</a></p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Code Knights <no-reply@codeknights.com>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // تعليق إرسال البريد الفعلي حالياً (يمكن تفعيله لاحقاً)
    // mail($to, $subject, $message, $headers);
}

// دالة لتسجيل الاستفسار في ملف
function log_inquiry($name, $email, $project, $service, $id) {
    $log_message = "[" . date('Y-m-d H:i:s') . "] ID: $id | Name: $name | Email: $email | Project: $project | Service: $service\n";
    $log_file = __DIR__ . '/inquiries_log.txt';
    file_put_contents($log_file, $log_message, FILE_APPEND);
}
?>