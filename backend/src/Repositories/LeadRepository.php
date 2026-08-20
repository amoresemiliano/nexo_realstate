<?php
namespace Repositories;

use Core\Database;
use PDO;

class LeadRepository {
    public function findAllByOrganization(int $orgId): array {
        $stmt = Database::connection()->prepare(
            "SELECT l.id, l.organization_id, l.first_name, l.last_name, l.email, l.phone,
                    l.source, l.status, l.assigned_user_id, l.notes, l.created_by_user_id,
                    l.created_at, l.updated_at,
                    u.name AS assigned_user_name
             FROM leads l
             LEFT JOIN users u ON l.assigned_user_id = u.id
             WHERE l.organization_id = :org_id
             ORDER BY l.created_at DESC"
        );
        $stmt->execute(['org_id' => $orgId]);
        return $stmt->fetchAll() ?: [];
    }

    public function findById(int $leadId, int $orgId): ?array {
        $stmt = Database::connection()->prepare(
            "SELECT l.id, l.organization_id, l.first_name, l.last_name, l.email, l.phone,
                    l.source, l.status, l.assigned_user_id, l.notes, l.created_by_user_id,
                    l.created_at, l.updated_at
             FROM leads l
             WHERE l.id = :id AND l.organization_id = :org_id
             LIMIT 1"
        );
        $stmt->execute([
            'id' => $leadId,
            'org_id' => $orgId,
        ]);
        $lead = $stmt->fetch();
        return $lead ?: null;
    }

    public function create(array $data): int {
        $stmt = Database::connection()->prepare(
            "INSERT INTO leads (organization_id, first_name, last_name, email, phone, source, status, assigned_user_id, notes, created_by_user_id, created_at)
             VALUES (:organization_id, :first_name, :last_name, :email, :phone, :source, :status, :assigned_user_id, :notes, :created_by_user_id, NOW())"
        );
        $stmt->execute([
            'organization_id' => $data['organization_id'],
            'first_name' => trim($data['first_name']),
            'last_name' => trim($data['last_name']),
            'email' => !empty($data['email']) ? strtolower(trim($data['email'])) : null,
            'phone' => !empty($data['phone']) ? trim($data['phone']) : null,
            'source' => !empty($data['source']) ? trim($data['source']) : 'Carga Manual',
            'status' => !empty($data['status']) ? strtoupper(trim($data['status'])) : 'NUEVO',
            'assigned_user_id' => !empty($data['assigned_user_id']) ? (int)$data['assigned_user_id'] : null,
            'notes' => !empty($data['notes']) ? trim($data['notes']) : null,
            'created_by_user_id' => (int)$data['created_by_user_id'],
        ]);
        return (int)Database::connection()->lastInsertId();
    }
}
