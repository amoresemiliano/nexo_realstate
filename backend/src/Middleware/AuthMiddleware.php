<?php
namespace Middleware;

use Core\ApiException;
use Core\Request;

class AuthMiddleware {
    public function handle(Request $request): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $userId = $_SESSION['user_id'] ?? null;
        $orgId = $_SESSION['organization_id'] ?? null;

        if (!$userId || !$orgId) {
            throw new ApiException('UNAUTHENTICATED', 'Sesión no iniciada o expirada. Por favor inicie sesión.', 401);
        }
    }
}
