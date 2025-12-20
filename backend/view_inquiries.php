<?php
// backend/view_inquiries.php

// إعدادات قاعدة البيانات
$host = "localhost";
$username = "root";
$password = "";
$database = "code_knights_db";

// إنشاء الاتصال
$conn = new mysqli($host, $username, $password, $database);

// التحقق من الاتصال
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// الحصول على جميع الاستفسارات
$sql = "SELECT * FROM inquiries ORDER BY submission_date DESC";
$result = $conn->query($sql);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Inquiries - Code Knights</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-color: #6C63FF;
            --secondary-color: #121212;
            --accent-color: #00D4FF;
            --dark-bg: #1E1E1E;
            --card-bg: #2D2D2D;
            --text-color: #E0E0E0;
            --text-muted: #A0A0A0;
            --border-radius: 12px;
            --transition: all 0.3s ease;
        }

        body {
            background: var(--secondary-color);
            color: var(--text-color);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 40px 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            border-radius: var(--border-radius);
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
        }

        .header h1 {
            position: relative;
            z-index: 1;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .header p {
            position: relative;
            z-index: 1;
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.1rem;
        }

        .controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            background: var(--card-bg);
            padding: 20px;
            border-radius: var(--border-radius);
            flex-wrap: wrap;
            gap: 15px;
        }

        .stats {
            display: flex;
            gap: 20px;
        }

        .stat-box {
            background: rgba(108, 99, 255, 0.2);
            padding: 15px 25px;
            border-radius: var(--border-radius);
            text-align: center;
            min-width: 150px;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
            display: block;
        }

        .stat-label {
            font-size: 0.9rem;
            color: var(--text-muted);
        }

        .actions {
            display: flex;
            gap: 15px;
        }

        .btn {
            padding: 10px 25px;
            border: none;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }

        .btn-primary {
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(108, 99, 255, 0.3);
        }

        .btn-outline {
            background: transparent;
            border: 2px solid var(--primary-color);
            color: var(--primary-color);
        }

        .btn-outline:hover {
            background: var(--primary-color);
            color: white;
        }

        .table-container {
            background: var(--card-bg);
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: rgba(108, 99, 255, 0.3);
        }

        th {
            padding: 20px;
            text-align: left;
            font-weight: 600;
            color: var(--primary-color);
            border-bottom: 2px solid rgba(108, 99, 255, 0.5);
        }

        td {
            padding: 15px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        tbody tr:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .email-cell {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .project-cell {
            max-width: 250px;
        }

        .project-idea {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .service-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .badge-web { background: rgba(33, 150, 243, 0.2); color: #2196F3; }
        .badge-mobile { background: rgba(76, 175, 80, 0.2); color: #4CAF50; }
        .badge-design { background: rgba(156, 39, 176, 0.2); color: #9C27B0; }
        .badge-ecommerce { background: rgba(255, 152, 0, 0.2); color: #FF9800; }
        .badge-other { background: rgba(158, 158, 158, 0.2); color: #9E9E9E; }

        .date-cell {
            color: var(--text-muted);
            font-size: 0.9rem;
            white-space: nowrap;
        }

        .no-data {
            text-align: center;
            padding: 60px 20px;
            color: var(--text-muted);
        }

        .no-data i {
            font-size: 3rem;
            margin-bottom: 20px;
            color: var(--text-muted);
            opacity: 0.5;
        }

        @media (max-width: 768px) {
            .controls {
                flex-direction: column;
                align-items: stretch;
            }
            
            .stats {
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .stat-box {
                min-width: 120px;
            }
            
            .actions {
                justify-content: center;
            }
            
            .table-container {
                overflow-x: auto;
            }
            
            table {
                min-width: 800px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-inbox"></i> Project Inquiries</h1>
            <p>View all project inquiries submitted through the contact form</p>
        </div>

        <div class="controls">
            <div class="stats">
                <div class="stat-box">
                    <span class="stat-number">
                        <?php echo $result ? $result->num_rows : 0; ?>
                    </span>
                    <span class="stat-label">Total Inquiries</span>
                </div>
                <div class="stat-box">
                    <span class="stat-number">
                        <?php 
                            $today = date('Y-m-d');
                            $today_sql = "SELECT COUNT(*) as count FROM inquiries WHERE DATE(submission_date) = '$today'";
                            $today_result = $conn->query($today_sql);
                            $today_count = $today_result ? $today_result->fetch_assoc()['count'] : 0;
                            echo $today_count;
                        ?>
                    </span>
                    <span class="stat-label">Today</span>
                </div>
            </div>

            <div class="actions">
                <a href="../index.html" class="btn btn-primary">
                    <i class="fas fa-home"></i> Home Page
                </a>
                <a href="setup_database.php" class="btn btn-outline">
                    <i class="fas fa-database"></i> Reset Database
                </a>
                <button onclick="window.print()" class="btn btn-outline">
                    <i class="fas fa-print"></i> Print
                </button>
            </div>
        </div>

        <div class="table-container">
            <?php if ($result && $result->num_rows > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Project Idea</th>
                            <th>Service</th>
                            <th>Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while($row = $result->fetch_assoc()): ?>
                        <tr>
                            <td>#<?php echo str_pad($row['id'], 4, '0', STR_PAD_LEFT); ?></td>
                            <td><strong><?php echo htmlspecialchars($row['full_name']); ?></strong></td>
                            <td class="email-cell"><?php echo htmlspecialchars($row['email_address']); ?></td>
                            <td><?php echo htmlspecialchars($row['phone_number']); ?></td>
                            <td class="project-cell">
                                <div class="project-idea" title="<?php echo htmlspecialchars($row['project_idea']); ?>">
                                    <?php echo htmlspecialchars($row['project_idea']); ?>
                                </div>
                            </td>
                            <td>
                                <?php 
                                    $service = $row['service_type'];
                                    $badge_class = 'badge-other';
                                    if ($service == 'web') $badge_class = 'badge-web';
                                    elseif ($service == 'mobile') $badge_class = 'badge-mobile';
                                    elseif ($service == 'design') $badge_class = 'badge-design';
                                    elseif ($service == 'ecommerce') $badge_class = 'badge-ecommerce';
                                ?>
                                <span class="service-badge <?php echo $badge_class; ?>">
                                    <?php 
                                        $service_names = [
                                            'web' => 'Web Dev',
                                            'mobile' => 'Mobile Apps',
                                            'design' => 'UI/UX Design',
                                            'ecommerce' => 'E-commerce',
                                            'other' => 'Other'
                                        ];
                                        echo $service_names[$service] ?? ucfirst($service);
                                    ?>
                                </span>
                            </td>
                            <td class="date-cell">
                                <i class="far fa-clock"></i>
                                <?php echo date('M d, Y', strtotime($row['submission_date'])); ?>
                            </td>
                        </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="no-data">
                    <i class="fas fa-inbox"></i>
                    <h3>No inquiries yet</h3>
                    <p>No project inquiries have been submitted yet.</p>
                    <p>Go to the <a href="../index.html" style="color: var(--primary-color);">home page</a> to submit your first inquiry!</p>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <script>
        // Auto-refresh every 30 seconds to get new inquiries
        setTimeout(() => {
            window.location.reload();
        }, 30000);
    </script>
</body>
</html>
<?php
$conn->close();
?>