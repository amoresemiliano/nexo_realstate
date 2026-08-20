<?php
namespace Middleware;

use Core\ApiException;
use Core\Request;

class RoleMiddleware {
    private array $allowedRoles;

    public function __construct(array $allowedRoles = ['ADMIN', 'SUPERVISOR', 'VENDEDOR']) {
        $this->allowedRoles = array_map('strtoupper', $allowedRoles);
    }

    public function handle(Request $request): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $userRole = strtoupper($_SESSION['role'] ?? '');

        if (empty($userRole) || !in_array($userRole, $this->allowedRoles, true)) {
            throw new ApiException('FORBIDDEN', 'No posee los permisos necesarios para realizar esta acción.', 403);
        }
    }
}
