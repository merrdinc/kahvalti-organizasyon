<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kurulum Sihirbazı - Kahvaltı & Organizasyon</title>
    <link rel="stylesheet" href="admin-style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .install-container {
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        .install-card {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin-bottom: 1.5rem;
        }
        .install-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        .install-header h1 {
            color: #d4694f;
            font-family: 'Playfair Display', serif;
        }
        .step {
            display: none;
        }
        .step.active {
            display: block;
        }
        .btn-group {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        .success-icon {
            font-size: 4rem;
            color: #4caf50;
            text-align: center;
            margin: 2rem 0;
        }
        .error-icon {
            font-size: 4rem;
            color: #f44336;
            text-align: center;
            margin: 2rem 0;
        }
    </style>
</head>
<body style="background: #f8f5f2;">
    <div class="install-container">
        <div class="install-card">
            <div class="install-header">
                <i class="fas fa-cog" style="font-size: 3rem; color: #d4694f;"></i>
                <h1>Kurulum Sihirbazı</h1>
                <p>Kahvaltı & Organizasyon Web Sitesi</p>
            </div>

            <?php
            // Adım 1: Hoş Geldiniz
            if (!isset($_POST['step'])) {
            ?>
                <div class="step active">
                    <h2>Hoş Geldiniz!</h2>
                    <p>Bu kurulum sihirbazı sitenizi kurmak için gerekli adımları gerçekleştirecektir.</p>

                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <strong>Kurulumdan Önce:</strong>
                            <ul style="margin: 1rem 0 0 1.5rem;">
                                <li>Bir MySQL veritabanı oluşturmuş olmalısınız</li>
                                <li>Veritabanı kullanıcı adı ve şifresini bilmelisiniz</li>
                                <li>config.php dosyasını düzenleyebilmelisiniz</li>
                            </ul>
                        </div>
                    </div>

                    <form method="post">
                        <input type="hidden" name="step" value="1">
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            <i class="fas fa-arrow-right"></i>
                            Kuruluma Başla
                        </button>
                    </form>
                </div>
            <?php
            }
            // Adım 2: Veritabanı Bilgileri
            elseif ($_POST['step'] == 1) {
            ?>
                <div class="step active">
                    <h2>Veritabanı Bilgileri</h2>
                    <p>Lütfen veritabanı bağlantı bilgilerinizi girin:</p>

                    <form method="post" class="admin-form">
                        <input type="hidden" name="step" value="2">

                        <div class="form-group-admin">
                            <label>Veritabanı Sunucusu</label>
                            <input type="text" name="db_host" value="localhost" required>
                            <small>Genellikle 'localhost'</small>
                        </div>

                        <div class="form-group-admin">
                            <label>Veritabanı Adı</label>
                            <input type="text" name="db_name" value="kahvalti_organizasyon" required>
                        </div>

                        <div class="form-group-admin">
                            <label>Kullanıcı Adı</label>
                            <input type="text" name="db_user" value="root" required>
                        </div>

                        <div class="form-group-admin">
                            <label>Şifre</label>
                            <input type="password" name="db_pass">
                            <small>Boş bırakabilirsiniz (localhost için)</small>
                        </div>

                        <div class="btn-group">
                            <button type="submit" class="btn btn-primary" style="flex: 1;">
                                <i class="fas fa-arrow-right"></i>
                                Devam Et
                            </button>
                        </div>
                    </form>
                </div>
            <?php
            }
            // Adım 3: Veritabanı Oluşturma
            elseif ($_POST['step'] == 2) {
                $db_host = $_POST['db_host'];
                $db_name = $_POST['db_name'];
                $db_user = $_POST['db_user'];
                $db_pass = $_POST['db_pass'];

                try {
                    // Veritabanına bağlan
                    $dsn = "mysql:host=$db_host;charset=utf8mb4";
                    $pdo = new PDO($dsn, $db_user, $db_pass);
                    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                    // database.sql dosyasını oku
                    $sql = file_get_contents('database.sql');

                    // SQL komutlarını çalıştır
                    $pdo->exec($sql);

                    // config.php dosyasını güncelle
                    $config_content = file_get_contents('config.php');
                    $config_content = preg_replace("/define\('DB_HOST', '.*?'\);/", "define('DB_HOST', '$db_host');", $config_content);
                    $config_content = preg_replace("/define\('DB_NAME', '.*?'\);/", "define('DB_NAME', '$db_name');", $config_content);
                    $config_content = preg_replace("/define\('DB_USER', '.*?'\);/", "define('DB_USER', '$db_user');", $config_content);
                    $config_content = preg_replace("/define\('DB_PASS', '.*?'\);/", "define('DB_PASS', '$db_pass');", $config_content);
                    file_put_contents('config.php', $config_content);

            ?>
                <div class="step active">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>

                    <h2 style="text-align: center; color: #4caf50;">Kurulum Başarılı!</h2>
                    <p style="text-align: center;">Veritabanı başarıyla oluşturuldu ve yapılandırma tamamlandı.</p>

                    <div class="alert alert-success">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <strong>Başarılı İşlemler:</strong>
                            <ul style="margin: 1rem 0 0 1.5rem;">
                                <li>Veritabanı bağlantısı test edildi</li>
                                <li>Tablolar oluşturuldu</li>
                                <li>Varsayılan veriler eklendi</li>
                                <li>config.php dosyası güncellendi</li>
                            </ul>
                        </div>
                    </div>

                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <strong>Varsayılan Giriş Bilgileri:</strong><br>
                            Kullanıcı Adı: <strong>admin</strong><br>
                            Şifre: <strong>admin123</strong>
                        </div>
                    </div>

                    <div class="btn-group">
                        <a href="admin-login.html" class="btn btn-success" style="flex: 1; text-align: center; text-decoration: none;">
                            <i class="fas fa-sign-in-alt"></i>
                            Admin Paneline Git
                        </a>
                        <a href="index.html" class="btn btn-primary" style="flex: 1; text-align: center; text-decoration: none;">
                            <i class="fas fa-home"></i>
                            Ana Siteye Git
                        </a>
                    </div>

                    <div class="alert alert-danger" style="margin-top: 2rem;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <strong>Güvenlik Uyarısı:</strong><br>
                            Kurulum tamamlandıktan sonra <strong>install.php</strong> dosyasını silin veya taşıyın!
                        </div>
                    </div>
                </div>
            <?php
                } catch (PDOException $e) {
            ?>
                <div class="step active">
                    <div class="error-icon">
                        <i class="fas fa-times-circle"></i>
                    </div>

                    <h2 style="text-align: center; color: #f44336;">Hata Oluştu!</h2>

                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <strong>Hata Mesajı:</strong><br>
                            <?php echo $e->getMessage(); ?>
                        </div>
                    </div>

                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <strong>Çözüm Önerileri:</strong>
                            <ul style="margin: 1rem 0 0 1.5rem;">
                                <li>Veritabanı kullanıcı adı ve şifresini kontrol edin</li>
                                <li>MySQL servisinin çalıştığından emin olun</li>
                                <li>Veritabanının oluşturulmuş olduğunu kontrol edin</li>
                                <li>Kullanıcının veritabanı oluşturma yetkisi olduğundan emin olun</li>
                            </ul>
                        </div>
                    </div>

                    <form method="post">
                        <input type="hidden" name="step" value="1">
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            <i class="fas fa-arrow-left"></i>
                            Tekrar Dene
                        </button>
                    </form>
                </div>
            <?php
                }
            }
            ?>
        </div>

        <div style="text-align: center; color: #666;">
            <p>Kahvaltı & Organizasyon Web Sitesi v1.0</p>
        </div>
    </div>
</body>
</html>
