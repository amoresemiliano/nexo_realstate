<?php
namespace Core;

class Response {
    public static function json(bool $success, array $payload, int $statusCode = 200): void {
        if (!headers_sent()) {
            http_response_code($statusCode);
            header('Content-Type: application/json; charset=utf-8');
            header('X-Content-Type-Options: nosniff');
        }

        $body = [
            'success' => $success
        ];

        if ($success) {
            $body['data'] = $payload;
        } else {
            $body['error'] = $payload;
        }

        echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success(array $data = [], int $statusCode = 200): void {
        self::json(true, $data, $statusCode);
    }

    public static function error(string $code, string $message, int $statusCode = 400): void {
        self::json(false, [
            'code' => $code,
            'message' => $message
        ], $statusCode);
    }
}
