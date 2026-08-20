<?php
namespace Repositories;

use Core\Database;

class AuditRepository {
    public function logEvent(
        ?int $orgId,
        ?int $userId,
        string $entityType,
        string $entityId,
        string $action,
        ?array $payload = null
    ): bool {
        try {
            $stmt = Database::connection()->prepare(
                "INSERT INTO audit_events (organization_id, user_id, entity_type, entity_id, action, payload_json, created_at)
                 VALUES (:organization_id, :user_id, :entity_type, :entity_id, :action, :payload_json, NOW())"
            );
            return $stmt->execute([
                'organization_id' => $orgId,
                'user_id' => $userId,
                'entity_type' => strtoupper(trim($entityType)),
                'entity_id' => (string)$entityId,
                'action' => strtoupper(trim($action)),
                'payload_json' => $payload ? json_encode($payload, JSON_UNESCAPED_UNICODE) : null,
            ]);
        } catch (\Throwable $e) {
            error_log('Audit log error: ' . $e->getMessage());
            return false;
        }
    }
}
