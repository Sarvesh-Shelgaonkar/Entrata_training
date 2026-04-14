<?php

namespace App\Core;

/**
 * Demonstrates: API structure (JSON Responses)
 */
class ApiResponse
{
    public static function send(int $status, string $message, array $data = []): void
    {
        header('Content-Type: application/json');
        http_response_code($status);
        
        echo json_encode([
            'status' => $status,
            'message' => $message,
            'payload' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit;
    }
}
