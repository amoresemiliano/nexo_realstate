<?php
// backend/api/index.php

require_once __DIR__ . '/../bootstrap.php';

use Core\Database;

header('Content-Type: application/json; charset=utf-8');

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
// Clean URI for local testing or prod paths (removing query string)
$path = parse_url($requestUri, PHP_URL_PATH);

if (preg_match('#/api/v1/health$#', $path)) {
    $dbStatus = 'unknown';
    $statusCode = 200;

    try {
        $pdo = Database::connection();
        $stmt = $pdo->query("SELECT 1");
        if ($stmt && $stmt->fetch()) {
            $dbStatus = 'ok';
        } else {
            $dbStatus = 'error';
            $statusCode = 500;
        }
    } catch (\Exception $e) {
        $dbStatus = 'error';
        $statusCode = 500;
        // El mensaje real no se expone al cliente
    }

    http_response_code($statusCode);
    
    if ($statusCode === 200) {
        echo json_encode([
            "success" => true,
            "data" => [
                "service" => "Nexo Desarrollos API",
                "status" => "ok",
                "environment" => getenv('NEXO_ENV') ?: 'dev',
                "database" => $dbStatus
            ]
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "error" => [
                "code" => "DATABASE_ERROR",
                "message" => "Ocurrió un error al verificar la conexión con la base de datos."
            ]
        ]);
    }
    exit;
}

// 404 para el resto temporalmente en esta iteración
http_response_code(404);
echo json_encode([
    "success" => false,
    "error" => [
        "code" => "NOT_FOUND",
        "message" => "Ruta no encontrada."
    ]
]);
exit;
