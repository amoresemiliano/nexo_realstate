<?php
// backend/src/Services/DevelopmentService.php

namespace Services;

use Core\ApiException;
use Repositories\DevelopmentRepository;
use Repositories\AuditRepository;

class DevelopmentService
{
    private DevelopmentRepository $developmentRepository;
    private AuditRepository $auditRepository;

    public function __construct()
    {
        $this->developmentRepository = new DevelopmentRepository();
        $this->auditRepository = new AuditRepository();
    }

    public function getDevelopmentsForOrganization(int $orgId): array
    {
        return $this->developmentRepository->findByOrganizationId($orgId);
    }

    public function createDevelopment(array $input, int $orgId, int $userId): array
    {
        $name = trim($input['name'] ?? '');
        if (empty($name)) {
            throw new ApiException("El nombre del barrio o desarrollo es obligatorio.", 400, "MISSING_NAME");
        }

        $city = !empty($input['city']) ? trim($input['city']) : (!empty($input['location']['city']) ? trim($input['location']['city']) : null);
        $province = !empty($input['province']) ? trim($input['province']) : (!empty($input['location']['province']) ? trim($input['location']['province']) : null);
        $country = !empty($input['country']) ? trim($input['country']) : 'Argentina';
        $address = !empty($input['address']) ? trim($input['address']) : (!empty($input['location']['address']) ? trim($input['location']['address']) : null);
        $description = !empty($input['description']) ? trim($input['description']) : null;
        $status = !empty($input['status']) ? strtoupper(trim($input['status'])) : 'COMERCIALIZACION_ACTIVA';

        $devId = $this->developmentRepository->create([
            'organization_id' => $orgId,
            'name' => $name,
            'city' => $city,
            'province' => $province,
            'country' => $country,
            'address' => $address,
            'description' => $description,
            'status' => $status,
            'created_by_user_id' => $userId,
        ]);

        // Registrar auditoría
        $this->auditRepository->log([
            'organization_id' => $orgId,
            'user_id' => $userId,
            'entity_type' => 'DEVELOPMENT',
            'entity_id' => (string)$devId,
            'action' => 'DEVELOPMENT_CREATED',
            'payload_json' => json_encode([
                'id' => $devId,
                'name' => $name,
                'city' => $city,
            ]),
        ]);

        return $this->developmentRepository->findByIdAndOrg($devId, $orgId);
    }
}
