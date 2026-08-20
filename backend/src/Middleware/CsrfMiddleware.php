<?php
namespace Middleware;

use Core\ApiException;
use Core\Request;
use Services\AuthService;

class CsrfMiddleware {
    public function handle(Request $request): void {
        $method = strtoupper($request->getMethod());
        
        // CSRF protection for state-changing HTTP methods
        if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            $token = $request->getHeader('x-csrf-token');

            if (empty($token)) {
                $body = $request->getJsonBody();
                $token = $body['_csrfToken'] ?? null;
            }

            if (!AuthService::verifyCsrfToken($token)) {
                throw new ApiException('CSRF_INVALID', 'Token CSRF inválido o ausente.', 403);
            }
        }
    }
}
