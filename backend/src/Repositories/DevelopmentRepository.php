<?php
// backend/src/Repositories/DevelopmentRepository.php

namespace Repositories;

use Core\Database;

class DevelopmentRepository
{
    /**
     * Obtiene todos los desarrollos/barrios pertenecientes a la organización.
     */
    public function findByOrganizationId(int $orgId): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            "SELECT d.*, u.name as created_by_user_name
             FROM developments d
             LEFT JOIN users u ON u.id = d.created_by_user_id
             WHERE d.organization_id = :org_id
             ORDER BY d.name ASC"
        );
        $stmt->execute(['org_id' => $orgId]);
        return $stmt->fetchAll();
    }

    /**
     * Busca un desarrollo por ID dentro de la organización.
     */
    public function findByIdAndOrg(int $id, int $orgId): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            "SELECT d.*, u.name as created_by_user_name
             FROM developments d
             LEFT JOIN users u ON u.id = d.created_by_user_id
             WHERE d.id = :id AND d.organization_id = :org_id
             LIMIT 1"
        );
        $stmt->execute(['id' => $id, 'org_id' => $orgId]);
        $res = $stmt->fetch();
        return $res ?: null;
    }

    /**
     * Crea un nuevo desarrollo/barrio.
     */
    public function create(array $data): int
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            "INSERT INTO developments (
                organization_id, name, city, province, country, address, description, status, created_by_user_id, created_at, updated_at
             ) VALUES (
                :org_id, :name, :city, :province, :country, :address, :description, :status, :user_id, NOW(), NOW()
             )"
        );

        $stmt->execute([
            'org_id' => $data['organization_id'],
            'name' => $data['name'],
            'city' => $data['city'] ?? null,
            'province' => $data['province'] ?? null,
            'country' => $data['country'] ?? 'Argentina',
            'address' => $data['address'] ?? null,
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? 'COMERCIALIZACION_ACTIVA',
            'user_id' => $data['created_by_user_id'],
        ]);

        return (int)$pdo->lastInsertId();
    }
}
