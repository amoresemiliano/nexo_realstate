<?php
namespace Repositories;

use Core\Database;
use PDO;

class UserRepository {
    public function findByEmail(string $email): ?array {
        $stmt = Database::connection()->prepare(
            "SELECT id, organization_id, name, email, password_hash, role, status
             FROM users
             WHERE email = :email AND status = 'ACTIVE'
             LIMIT 1"
        );
        $stmt->execute(['email' => strtolower(trim($email))]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function findById(int $id): ?array {
        $stmt = Database::connection()->prepare(
            "SELECT id, organization_id, name, email, role, status
             FROM users
             WHERE id = :id AND status = 'ACTIVE'
             LIMIT 1"
        );
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function updateLastLogin(int $userId): void {
        $stmt = Database::connection()->prepare(
            "UPDATE users SET last_login_at = NOW() WHERE id = :id"
        );
        $stmt->execute(['id' => $userId]);
    }

    public function create(array $data): int {
        $stmt = Database::connection()->prepare(
            "INSERT INTO users (organization_id, name, email, password_hash, role, status, created_at)
             VALUES (:organization_id, :name, :email, :password_hash, :role, 'ACTIVE', NOW())"
        );
        $stmt->execute([
            'organization_id' => $data['organization_id'],
            'name' => trim($data['name']),
            'email' => strtolower(trim($data['email'])),
            'password_hash' => $data['password_hash'],
            'role' => strtoupper(trim($data['role'])),
        ]);
        return (int)Database::connection()->lastInsertId();
    }
}
