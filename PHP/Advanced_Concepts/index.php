<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use App\Utils\Validator;
use App\Core\ApiResponse;

/**
 * Demonstrates: Composer (Autoloading), Namespaces, and the API entry point
 */

// Simulating an API endpoint (e.g., POST /register)
$mockInput = [
    'username' => 'sarvesh123',
    'email' => 'sarvesh@example.com',
    'age' => 25
];

// 1. Validate Input using Regular Expressions
if (!Validator::isValidUsername($mockInput['username'])) {
    ApiResponse::send(400, "Invalid Username! Use 3-15 alphanumeric characters.");
}

if (!Validator::isValidEmail($mockInput['email'])) {
    ApiResponse::send(400, "Invalid Email Format!");
}

// 2. Create User Model and use Magic Methods
$user = new User($mockInput['username'], $mockInput['email']);

// Using __set (Magic Method) to add dynamic property
$user->age = $mockInput['age']; 

// Using __get (Magic Method)
$userAge = $user->age;

// 3. Send Success Response (API)
ApiResponse::send(200, "User registered successfully!", [
    'user_info' => $user->toArray(),
    'display_string' => (string) $user // Triggers __toString() magic method
]);
