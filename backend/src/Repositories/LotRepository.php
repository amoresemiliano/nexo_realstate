<?php
// backend/src/Repositories/LotRepository.php

namespace Repositories;

use Core\Database;

class LotRepository
{
    /**
     * Obtiene todos los lotes de la organización (opcionalmente filtrados por desarrollo).
     */
    public function findByOrganizationId(int $orgId, ?int $developmentId = null): array
    {
        $pdo = Database::connection();
        $sql = "SELECT l.*, d.name as development_name, u.name as created_by_user_name
                FROM lots l
                JOIN developments d ON d.id = l.development_id
                LEFT JOIN users u ON u.id = l.created_by_user_id
                WHERE l.organization_id = :org_id";
        
        $params = ['org_id' => $orgId];

        if ($developmentId !== null) {
            $sql .= " AND l.development_id = :dev_id";
            $params['dev_id'] = $developmentId;
        }

        $sql .= " ORDER BY l.block ASC, l.number ASC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Comprueba si ya existe un lote con el mismo código/número en el barrio indicado dentro de la org.
     */
    public function existsByDevAndNumber(int $orgId, int $developmentId, string $number): bool
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            "SELECT id FROM lots 
             WHERE organization_id = :org_id AND development_id = :dev_id AND LOWER(TRIM(number)) = LOWER(TRIM(:number))
             LIMIT 1"
        );
        $stmt->execute([
            'org_id' => $orgId,
            'dev_id' => $developmentId,
            'number' => $number
        ]);
        return (bool)$stmt->fetch();
    }

    /**
     * Busca un lote por ID y organización.
     */
    public function findByIdAndOrg(int $id, int $orgId): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            "SELECT l.*, d.name as development_name, u.name as created_by_user_name
             FROM lots l
             JOIN developments d ON d.id = l.development_id
             LEFT JOIN users u ON u.id = l.created_by_user_id
             WHERE l.id = :id AND l.organization_id = :org_id
             LIMIT 1"
        );
        $stmt->execute(['id' => $id, 'org_id' => $orgId]);
        $res = $stmt->fetch();
        return $res ?: null;
    }

    /**
     * Crea un nuevo lote.
     */
    public function create(array $data): int
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            "INSERT INTO lots (
                organization_id, development_id, number, block, surface_m2, price, currency, status, orientation, observations, created_by_user_id, created_at, updated_at
             ) VALUES (
                :org_id, :dev_id, :number, :block, :surface_m2, :price, :currency, :status, :orientation, :observations, :user_id, NOW(), NOW()
             )"
        );

        $stmt->execute([
            'org_id' => $data['organization_id'],
            'dev_id' => $data['development_id'],
            'number' => $data['number'],
            'block' => $data['block'] ?? null,
            'surface_m2' => $data['surface_m2'],
            'price' => $data['price'],
            'currency' => $data['currency'] ?? 'USD',
            'status' => $data['status'] ?? 'DISPONIBLE',
            'orientation' => $data['orientation'] ?? null,
            'observations' => $data['observations'] ?? null,
            'user_id' => $data['created_by_user_id'],
        ]);

        return (int)$pdo->lastInsertId();
    }
}
