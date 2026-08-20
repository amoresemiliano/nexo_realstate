<?php
// backend/api/index.php

// Carga determinística del backend privado para BlueHost, con fallback local.
$remoteDevPath = '/home/athcomar/nexo_backend_dev/bootstrap.php';

if (file_exists($remoteDevPath)) {
    require_once $remoteDevPath;
} else {
    // Fallback local development
    require_once __DIR__ . '/../bootstrap.php';
}

use Core\Request;
use Core\Response;
use Core\Router;
use Core\Database;

use Controllers\AuthController;
use Controllers\LeadController;

use Middleware\AuthMiddleware;
use Middleware\CsrfMiddleware;

$request = new Request();
$router = new Router();

// 1. Health check endpoint
$router->get('/api/v1/health', function() {
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
    } catch (\Throwable $e) {
        $dbStatus = 'error';
        $statusCode = 500;
    }

    if ($statusCode === 200) {
        Response::success([
            "service" => "Nexo Desarrollos API",
            "status" => "ok",
            "environment" => getenv('NEXO_ENV') ?: 'dev',
            "database" => $dbStatus
        ]);
    } else {
        Response::error("DATABASE_ERROR", "Ocurrió un error al verificar la conexión con la base de datos.", 500);
    }
});

// 2. Auth Endpoints
$router->get('/api/v1/auth/csrf', [AuthController::class, 'csrf']);
$router->post('/api/v1/auth/login', [AuthController::class, 'login']);
$router->get('/api/v1/auth/me', [AuthController::class, 'me']);
$router->post('/api/v1/auth/logout', [AuthController::class, 'logout'], [CsrfMiddleware::class]);

// 3. Leads Endpoints
$router->get('/api/v1/leads', [LeadController::class, 'index'], [AuthMiddleware::class]);
$router->post('/api/v1/leads', [LeadController::class, 'store'], [AuthMiddleware::class, CsrfMiddleware::class]);

// Dispatch route
$router->dispatch($request);
