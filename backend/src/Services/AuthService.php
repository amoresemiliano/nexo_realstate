<?php
namespace Services;

use Core\ApiException;
use Repositories\UserRepository;
use Repositories\AuditRepository;

class AuthService {
    private UserRepository $userRepository;
    private AuditRepository $auditRepository;

    public function __construct() {
        $this->userRepository = new UserRepository();
        $this->auditRepository = new AuditRepository();
    }

    public function generateCsrfToken(): string {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }

        return $_SESSION['csrf_token'];
    }

    public static function verifyCsrfToken(?string $token): bool {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $sessionToken = $_SESSION['csrf_token'] ?? '';
        if (empty($sessionToken) || empty($token)) {
            return false;
        }

        return hash_equals($sessionToken, $token);
    }

    public function login(string $email, string $password): array {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (empty(trim($email)) || empty($password)) {
            throw new ApiException('VALIDATION_ERROR', 'Email y contraseña son obligatorios.', 400);
        }

        $user = $this->userRepository->findByEmail($email);
        if (!$user || !password_verify($password, $user['password_hash'])) {
            throw new ApiException('INVALID_CREDENTIALS', 'Credenciales de acceso inválidas.', 401);
        }

        // Session regeneration for security against session fixation
        session_regenerate_id(true);

        $_SESSION['user_id'] = (int)$user['id'];
        $_SESSION['organization_id'] = (int)$user['organization_id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['name'] = $user['name'];

        $this->userRepository->updateLastLogin((int)$user['id']);

        // Log Audit Event
        $this->auditRepository->logEvent(
            (int)$user['organization_id'],
            (int)$user['id'],
            'USER',
            (string)$user['id'],
            'AUTH_LOGIN_SUCCESS',
            ['email' => $user['email'], 'role' => $user['role']]
        );

        return $this->formatUserResponse($user);
    }

    public function getCurrentUser(): ?array {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            return null;
        }

        $user = $this->userRepository->findById((int)$userId);
        if (!$user) {
            return null;
        }

        return $this->formatUserResponse($user);
    }

    public function logout(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $userId = $_SESSION['user_id'] ?? null;
        $orgId = $_SESSION['organization_id'] ?? null;

        if ($userId && $orgId) {
            $this->auditRepository->logEvent(
                (int)$orgId,
                (int)$userId,
                'USER',
                (string)$userId,
                'AUTH_LOGOUT',
                []
            );
        }

        $_SESSION = [];

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }

        @session_destroy();
    }

    private function formatUserResponse(array $user): array {
        return [
            'id' => (string)$user['id'],
            'organizationId' => (string)$user['organization_id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ];
    }
}
