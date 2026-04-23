<?php

namespace App\Controllers;

use App\Models\Snap;

class SnapController
{
    private Snap $snap_model;

    public function __construct()
    {
        $this->snap_model = new Snap();
    }

    private function sendJsonResponse(array $payload, int $status_code = 200): void
    {
        http_response_code($status_code);
        header('Content-Type: application/json');
        echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    private function getJsonInput(): array
    {
        $input = file_get_contents('php://input');
        return json_decode($input, true) ?? [];
    }

    /**
     * Create a new shortened link
     */
    public function generate(): void
    {
        $payload = $this->getJsonInput();
        $target_url = trim($payload['url'] ?? '');

        if (!$target_url) {
            $this->sendJsonResponse(['status' => 'fail', 'message' => 'Please provide a valid URL.'], 400);
        }

        if (!$this->snap_model->isValidLink($target_url)) {
            $this->sendJsonResponse(['status' => 'fail', 'message' => 'The provided URL is not in a valid format.'], 422);
        }

        try {
            $entry = $this->snap_model->registerSnap($target_url);
            $root_url = rtrim($_ENV['APP_BASE_URL'] ?? 'http://localhost', '/');
            
            $entry['snap_link'] = $root_url . '/' . $entry['snap_token'];

            $this->sendJsonResponse([
                'status' => 'success',
                'data'   => $entry
            ], 201);

        } catch (\Throwable $err) {
            $this->sendJsonResponse(['status' => 'error', 'message' => $err->getMessage()], 500);
        }
    }

    /**
     * List all generated snaps
     */
    public function listAll(): void
    {
        try {
            $results = $this->snap_model->fetchAllSnaps();
            $root_url = rtrim($_ENV['APP_BASE_URL'] ?? 'http://localhost', '/');

            $final_data = array_map(fn($row) => array_merge($row, [
                'snap_link' => $root_url . '/' . $row['snap_token'],
            ]), $results);

            $this->sendJsonResponse(['status' => 'success', 'data' => $final_data]);

        } catch (\Throwable $err) {
            $this->sendJsonResponse(['status' => 'error', 'message' => $err->getMessage()], 500);
        }
    }

    /**
     * Redirect to the target URL
     */
    public function executeRedirect(array $params): void
    {
        $token = $params['code'] ?? '';
        $entry = $this->snap_model->lookupByToken($token);

        if (!$entry) {
            $this->sendJsonResponse(['status' => 'not_found', 'message' => "Invalid or expired token."], 404);
        }

        $this->snap_model->incrementVisitCount($token);

        header('Location: ' . $entry['target_url'], true, 302);
        exit;
    }
}
