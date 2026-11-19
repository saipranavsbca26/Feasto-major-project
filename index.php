<?php
// Initialize server-side session management to maintain state across stateless HTTP requests
session_start();

// Initialize default session state if not already set
if (!isset($_SESSION['user'])) {
    $_SESSION['user'] = null;
}
if (!isset($_SESSION['allergies'])) {
    $_SESSION['allergies'] = ["Peanuts", "Dairy"];
}
if (!isset($_SESSION['donations'])) {
    $_SESSION['donations'] = [
        ["name" => "The Grand Bistro", "items" => "140+ Meals", "target" => "Hope Orphanage Home"],
        ["name" => "Spice Route Garden", "items" => "Weekly Bakery Box", "target" => "Sunshine Senior Care"]
    ];
}

// Handle HTTP POST request submissions
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    // User Profile & Initial Allergy Registration
    if (isset($_POST['action']) && $_POST['action'] === 'register') {
        // Sanitize user inputs using htmlspecialchars to prevent XSS vulnerabilities
        $name = htmlspecialchars(trim($_POST['username'] ?? ''));
        $email = htmlspecialchars(trim($_POST['email'] ?? ''));
        $selected_allergies = $_POST['allergies'] ?? [];

        $_SESSION['user'] = [
            'name' => $name,
            'email' => $email
        ];
        $_SESSION['allergies'] = array_map('htmlspecialchars', $selected_allergies);
        
        // Regenerate session ID for enhanced security
        session_regenerate_id(true);

        header("Location: index.html?registered=success");
        exit;
    }

    // Dynamic Allergy Addition
    if (isset($_POST['action']) && $_POST['action'] === 'add_allergy') {
        $new_allergy = htmlspecialchars(trim($_POST['new_allergy'] ?? ''));
        if (!empty($new_allergy) && !in_array($new_allergy, $_SESSION['allergies'])) {
            $_SESSION['allergies'][] = $new_allergy;
        }
        header("Location: index.html?allergy=added");
        exit;
    }

    // Hero Donor Giveaway Submission
    if (isset($_POST['action']) && $_POST['action'] === 'donate') {
        $donor = htmlspecialchars(trim($_POST['donor_name'] ?? ''));
        $items = htmlspecialchars(trim($_POST['food_details'] ?? ''));
        $target = htmlspecialchars(trim($_POST['target_center'] ?? ''));

        if (!empty($donor) && !empty($items)) {
            $_SESSION['donations'][] = [
                "name" => $donor,
                "items" => $items,
                "target" => $target
            ];
        }
        header("Location: index.html?donation=success");
        exit;
    }
}

// Return current session state as JSON for JavaScript DOM integration
if (isset($_GET['fetch_state'])) {
    header('Content-Type: application/json');
    echo json_encode([
        'user' => $_SESSION['user'],
        'allergies' => $_SESSION['allergies'],
        'donations' => $_SESSION['donations']
    ]);
    exit;
}
?>
