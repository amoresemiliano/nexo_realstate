<?php
namespace Services;

use Core\ApiException;
use Repositories\LeadRepository;
use Repositories\AuditRepository;

class LeadService {
    private LeadRepository $leadRepository;
    private AuditRepository $auditRepository;

    private const ALLOWED_STATUSES = [
        'NUEVO',
        'PENDIENTE_PRIMER_CONTACTO',
        'CONTACTADO',
        'SEGUIMIENTO',
        'CALIFICADO',
        'DESCARTADO',
    ];

    public function __construct() {
        $this->leadRepository = new LeadRepository();
        $this->auditRepository = new AuditRepository();
    }

    public function getLeads(int $orgId): array {
        $rawLeads = $this->leadRepository->findAllByOrganization($orgId);
        return array_map([$this, 'formatLeadResponse'], $rawLeads);
    }

    public function createLead(int $orgId, int $userId, array $input): array {
        $firstName = trim($input['firstName'] ?? '');
        $lastName = trim($input['lastName'] ?? '');
        $status = strtoupper(trim($input['status'] ?? 'NUEVO'));
        $source = trim($input['source'] ?? 'Carga Manual');

        if (empty($firstName) || empty($lastName)) {
            throw new ApiException('VALIDATION_ERROR', 'Nombre y apellido del lead son obligatorios.', 422);
        }

        if (!in_array($status, self::ALLOWED_STATUSES, true)) {
            throw new ApiException('VALIDATION_ERROR', "Estado de lead '$status' no válido.", 422);
        }

        $leadData = [
            'organization_id' => $orgId,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => trim($input['email'] ?? ''),
            'phone' => trim($input['phone'] ?? ''),
            'source' => $source,
            'status' => $status,
            'assigned_user_id' => !empty($input['assignedUserId']) ? (int)$input['assignedUserId'] : null,
            'notes' => trim($input['notes'] ?? ''),
            'created_by_user_id' => $userId,
        ];

        $leadId = $this->leadRepository->create($leadData);
        $lead = $this->leadRepository->findById($leadId, $orgId);

        if (!$lead) {
            throw new ApiException('SERVER_ERROR', 'No se pudo recuperar el lead registrado.', 500);
        }

        // Audit Log
        $this->auditRepository->logEvent(
            $orgId,
            $userId,
            'LEAD',
            (string)$leadId,
            'LEAD_CREATED',
            [
                'fullName' => "$firstName $lastName",
                'email' => $leadData['email'],
                'status' => $status,
                'source' => $source,
            ]
        );

        return $this->formatLeadResponse($lead);
    }

    private function formatLeadResponse(array $lead): array {
        return [
            'id' => (string)$lead['id'],
            'organizationId' => (string)$lead['organization_id'],
            'firstName' => $lead['first_name'],
            'lastName' => $lead['last_name'],
            'name' => trim($lead['first_name'] . ' ' . $lead['last_name']),
            'email' => $lead['email'] ?? '',
            'phone' => $lead['phone'] ?? '',
            'source' => $lead['source'],
            'status' => $lead['status'],
            'assignedUserId' => $lead['assigned_user_id'] ? (string)$lead['assigned_user_id'] : null,
            'assignedUserName' => $lead['assigned_user_name'] ?? null,
            'notes' => $lead['notes'] ?? '',
            'createdByUserId' => (string)$lead['created_by_user_id'],
            'createdAt' => $lead['created_at'],
            'updatedAt' => $lead['updated_at'],
        ];
    }
}
