<?php
namespace Controllers;

use Core\Request;
use Core\Response;
use Services\AuthService;

class AuthController {
    private AuthService $authService;

    public function __construct() {
        $this->authService = new AuthService();
    }

    public function csrf(Request $request): void {
        $token = $this->authService->generateCsrfToken();
        Response::success([
            'csrfToken' => $token
        ]);
    }

    public function login(Request $request): void {
        $body = $request->getJsonBody();
        $email = $body['email'] ?? '';
        $password = $body['password'] ?? '';

        $user = $this->authService->login($email, $password);
        $csrfToken = $this->authService->generateCsrfToken();

        Response::success([
            'user' => $user,
            'csrfToken' => $csrfToken,
        ]);
    }

    public function me(Request $request): void {
        $user = $this->authService->getCurrentUser();
        if (!$user) {
            Response::error('UNAUTHENTICATED', 'Sesión no iniciada o expirada.', 401);
            return;
        }

        $csrfToken = $this->authService->generateCsrfToken();

        Response::success([
            'user' => $user,
            'csrfToken' => $csrfToken,
        ]);
    }

    public function logout(Request $request): void {
        $this->authService->logout();
        Response::success([
            'message' => 'Sesión cerrada correctamente.'
        ]);
    }
}
