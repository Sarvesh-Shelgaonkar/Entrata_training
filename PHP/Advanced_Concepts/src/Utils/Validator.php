<?php

namespace App\Utils;

/**
 * Demonstrates: Regular Expressions (RegEx)
 */
class Validator
{
    /**
     * Validates email using RegEx
     */
    public static function isValidEmail(string $email): bool
    {
        $pattern = "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/";
        return (bool) preg_match($pattern, $email);
    }

    /**
     * Validates username (alphanumeric, 3-15 chars) using RegEx
     */
    public static function isValidUsername(string $username): bool
    {
        $pattern = "/^[a-zA-Z0-9]{3,15}$/";
        return (bool) preg_match($pattern, $username);
    }
}
