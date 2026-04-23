<?php
/**
 * PHP Web Features: Forms and State
 * Theme: User Authentication Simulation
 */

session_start();

// Simple Routing
$route = $_GET['action'] ?? 'home';

// Handle Form Submission
$message = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_btn'])) {
    $email = htmlspecialchars($_POST['email']);
    $pass = $_POST['password'];

    // Mock Authentication
    if ($email === "user@example.com" && $pass === "1234") {
        $_SESSION['is_logged_in'] = true;
        $_SESSION['user_email'] = $email;
        $message = "Welcome back, $email!";
    } else {
        $message = "Invalid credentials. Try user@example.com / 1234";
    }
}

// Handle Logout
if ($route === 'logout') {
    session_destroy();
    header("Location: examples.php");
    exit();
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>User Portal</title>
</head>
<body>
    <nav>
        <a href="?action=home">Home</a> | 
        <?php if (isset($_SESSION['is_logged_in'])): ?>
            <a href="?action=logout">Logout</a>
        <?php else: ?>
            <a href="?action=login">Login</a>
        <?php endif; ?>
    </nav>

    <hr>

    <?php if ($message): ?>
        <p style="color: blue;"><?php echo $message; ?></p>
    <?php endif; ?>

    <?php if ($route === 'login' && !isset($_SESSION['is_logged_in'])): ?>
        <h2>User Login</h2>
        <form method="POST">
            <input type="email" name="email" placeholder="Email" required><br><br>
            <input type="password" name="password" placeholder="Password" required><br><br>
            <button type="submit" name="login_btn">Sign In</button>
        </form>
    <?php elseif (isset($_SESSION['is_logged_in'])): ?>
        <h2>Dashboard</h2>
        <p>You are successfully authenticated as: <?php echo $_SESSION['user_email']; ?></p>
    <?php else: ?>
        <h2>Welcome to our Portal</h2>
        <p>Please log in to access your secure dashboard.</p>
    <?php endif; ?>

</body>
</html>
