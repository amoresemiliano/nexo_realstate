<?php
// backend/src/Repositories/CampaignRepository.php

namespace Repositories;

use Core\Database;

class CampaignRepository
{
    /**
     * Obtiene todas las campañas pertenecientes a una organización.
     */
    public function findByOrganizationId(int $orgId): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            "SELECT c.*, u.name as created_by_user_name
             FROM campaigns c
             LEFT JOIN users u ON u.id = c.created_by_user_id
             WHERE c.organization_id = :org_id
             ORDER BY c.created_at DESC"
        );
        $stmt->execute(['org_id' => $orgId]);
        return $stmt->fetchAll();
    }

    /**
     * Busca una campaña por ID dentro de la organización.
     */
    public function findByIdAndOrg(int $id, int $orgId): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            "SELECT c.*, u.name as created_by_user_name
             FROM campaigns c
             LEFT JOIN users u ON u.id = c.created_by_user_id
             WHERE c.id = :id AND c.organization_id = :org_id
             LIMIT 1"
        );
        $stmt->execute(['id' => $id, 'org_id' => $orgId]);
        $res = $stmt->fetch();
        return $res ?: null;
    }

    /**
     * Crea una nueva campaña.
     */
    public function create(array $data): int
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            "INSERT INTO campaigns (
                organization_id, name, platform, status, budget_usd, spent_usd,
                leads_generated, conversions, start_date, end_date, objective, audience,
                created_by_user_id, created_at, updated_at
             ) VALUES (
                :org_id, :name, :platform, :status, :budget_usd, :spent_usd,
                :leads_generated, :conversions, :start_date, :end_date, :objective, :audience,
                :user_id, NOW(), NOW()
             )"
        );

        $stmt->execute([
            'org_id' => $data['organization_id'],
            'name' => $data['name'],
            'platform' => $data['platform'],
            'status' => $data['status'] ?? 'ACTIVA',
            'budget_usd' => $data['budget_usd'] ?? 0.00,
            'spent_usd' => $data['spent_usd'] ?? 0.00,
            'leads_generated' => $data['leads_generated'] ?? 0,
            'conversions' => $data['conversions'] ?? 0,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'] ?? null,
            'objective' => $data['objective'] ?? null,
            'audience' => $data['audience'] ?? null,
            'user_id' => $data['created_by_user_id'],
        ]);

        return (int)$pdo->lastInsertId();
    }
}
