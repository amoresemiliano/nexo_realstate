<?php
// backend/src/Services/CampaignService.php

namespace Services;

use Core\ApiException;
use Repositories\CampaignRepository;
use Repositories\AuditRepository;

class CampaignService
{
    private CampaignRepository $campaignRepository;
    private AuditRepository $auditRepository;

    public function __construct()
    {
        $this->campaignRepository = new CampaignRepository();
        $this->auditRepository = new AuditRepository();
    }

    public function getCampaignsForOrganization(int $orgId): array
    {
        return $this->campaignRepository->findByOrganizationId($orgId);
    }

    public function createCampaign(array $input, int $orgId, int $userId): array
    {
        $name = trim($input['name'] ?? '');
        $platform = trim($input['platform'] ?? '');
        $startDate = trim($input['startDate'] ?? $input['start_date'] ?? '');

        if (empty($name)) {
            throw new ApiException("El nombre de la campaña es obligatorio.", 400, "MISSING_NAME");
        }

        if (empty($platform)) {
            throw new ApiException("El canal o plataforma es obligatorio.", 400, "MISSING_PLATFORM");
        }

        if (empty($startDate)) {
            throw new ApiException("La fecha de inicio es obligatoria.", 400, "MISSING_START_DATE");
        }

        $budgetUSD = isset($input['budgetUSD']) ? (float)$input['budgetUSD'] : (isset($input['budget_usd']) ? (float)$input['budget_usd'] : 0.0);
        if ($budgetUSD < 0) {
            throw new ApiException("El presupuesto no puede ser negativo.", 400, "INVALID_BUDGET");
        }

        $status = strtoupper(trim($input['status'] ?? 'ACTIVA'));
        $allowedStatuses = ['ACTIVA', 'PAUSADA', 'FINALIZADA', 'BORRADOR'];
        if (!in_array($status, $allowedStatuses, true)) {
            $status = 'ACTIVA';
        }

        $endDate = !empty($input['endDate']) ? trim($input['endDate']) : (!empty($input['end_date']) ? trim($input['end_date']) : null);
        $objective = !empty($input['objective']) ? trim($input['objective']) : null;
        $audience = !empty($input['audience']) ? trim($input['audience']) : (!empty($input['targetAudience']) ? trim($input['targetAudience']) : null);

        $campaignId = $this->campaignRepository->create([
            'organization_id' => $orgId,
            'name' => $name,
            'platform' => $platform,
            'status' => $status,
            'budget_usd' => $budgetUSD,
            'spent_usd' => 0.00,
            'leads_generated' => 0,
            'conversions' => 0,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'objective' => $objective,
            'audience' => $audience,
            'created_by_user_id' => $userId,
        ]);

        // Registrar auditoría
        $this->auditRepository->log([
            'organization_id' => $orgId,
            'user_id' => $userId,
            'entity_type' => 'CAMPAIGN',
            'entity_id' => (string)$campaignId,
            'action' => 'CAMPAIGN_CREATED',
            'payload_json' => json_encode([
                'id' => $campaignId,
                'name' => $name,
                'platform' => $platform,
                'budget_usd' => $budgetUSD,
            ]),
        ]);

        return $this->campaignRepository->findByIdAndOrg($campaignId, $orgId);
    }
}
