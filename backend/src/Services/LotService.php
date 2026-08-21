<?php
// backend/src/Services/LotService.php

namespace Services;

use Core\ApiException;
use Repositories\LotRepository;
use Repositories\DevelopmentRepository;
use Repositories\AuditRepository;

class LotService
{
    private LotRepository $lotRepository;
    private DevelopmentRepository $developmentRepository;
    private AuditRepository $auditRepository;

    public function __construct()
    {
        $this->lotRepository = new LotRepository();
        $this->developmentRepository = new DevelopmentRepository();
        $this->auditRepository = new AuditRepository();
    }

    public function getLotsForOrganization(int $orgId, ?int $developmentId = null): array
    {
        return $this->lotRepository->findByOrganizationId($orgId, $developmentId);
    }

    public function createLot(array $input, int $orgId, int $userId): array
    {
        $devId = isset($input['developmentId']) ? (int)$input['developmentId'] : (isset($input['development_id']) ? (int)$input['development_id'] : 0);
        if ($devId <= 0) {
            throw new ApiException("Debe seleccionar un barrio o desarrollo válido.", 400, "MISSING_DEVELOPMENT");
        }

        // Verificar que el barrio pertenezca a la organización
        $dev = $this->developmentRepository->findByIdAndOrg($devId, $orgId);
        if (!$dev) {
            throw new ApiException("El barrio seleccionado no existe o no pertenece a su organización.", 404, "DEVELOPMENT_NOT_FOUND");
        }

        $number = trim($input['number'] ?? '');
        if (empty($number)) {
            throw new ApiException("El número o código de lote es obligatorio.", 400, "MISSING_LOT_NUMBER");
        }

        $surfaceM2 = isset($input['surfaceM2']) ? (float)$input['surfaceM2'] : (isset($input['surface_m2']) ? (float)$input['surface_m2'] : 0.0);
        if ($surfaceM2 <= 0) {
            throw new ApiException("La superficie en m² debe ser mayor a 0.", 400, "INVALID_SURFACE");
        }

        $price = isset($input['priceUSD']) ? (float)$input['priceUSD'] : (isset($input['price']) ? (float)$input['price'] : -1.0);
        if ($price < 0) {
            throw new ApiException("El precio del lote debe ser mayor o igual a 0.", 400, "INVALID_PRICE");
        }

        // Verificación previa de duplicados en el barrio
        if ($this->lotRepository->existsByDevAndNumber($orgId, $devId, $number)) {
            throw new ApiException("Ya existe un lote con ese código en el barrio seleccionado.", 409, "LOT_ALREADY_EXISTS");
        }

        $block = !empty($input['block']) ? trim($input['block']) : null;
        $currency = !empty($input['currency']) ? strtoupper(trim($input['currency'])) : 'USD';
        $status = !empty($input['status']) ? strtoupper(trim($input['status'])) : 'DISPONIBLE';
        $orientation = !empty($input['orientation']) ? trim($input['orientation']) : null;
        $observations = !empty($input['observations']) ? trim($input['observations']) : null;

        try {
            $lotId = $this->lotRepository->create([
                'organization_id' => $orgId,
                'development_id' => $devId,
                'number' => $number,
                'block' => $block,
                'surface_m2' => $surfaceM2,
                'price' => $price,
                'currency' => $currency,
                'status' => $status,
                'orientation' => $orientation,
                'observations' => $observations,
                'created_by_user_id' => $userId,
            ]);
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000' || str_contains($e->getMessage(), '1062')) {
                throw new ApiException("Ya existe un lote con ese código en el barrio seleccionado.", 409, "LOT_ALREADY_EXISTS");
            }
            throw $e;
        }

        // Registrar auditoría
        $this->auditRepository->log([
            'organization_id' => $orgId,
            'user_id' => $userId,
            'entity_type' => 'LOT',
            'entity_id' => (string)$lotId,
            'action' => 'LOT_CREATED',
            'payload_json' => json_encode([
                'id' => $lotId,
                'development_id' => $devId,
                'number' => $number,
                'price' => $price,
            ]),
        ]);

        return $this->lotRepository->findByIdAndOrg($lotId, $orgId);
    }
}
