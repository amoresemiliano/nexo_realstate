<?php
namespace Controllers;

use Core\Request;
use Core\Response;
use Core\ApiException;
use Services\LeadService;

class LeadController {
    private LeadService $leadService;

    public function __construct() {
        $this->leadService = new LeadService();
    }

    public function index(Request $request): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $orgId = $_SESSION['organization_id'] ?? null;
        if (!$orgId) {
            throw new ApiException('UNAUTHENTICATED', 'Organización no identificada en la sesión.', 401);
        }

        $leads = $this->leadService->getLeads((int)$orgId);
        Response::success([
            'leads' => $leads
        ]);
    }

    public function store(Request $request): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $orgId = $_SESSION['organization_id'] ?? null;
        $userId = $_SESSION['user_id'] ?? null;

        if (!$orgId || !$userId) {
            throw new ApiException('UNAUTHENTICATED', 'Sesión de usuario u organización no válida.', 401);
        }

        $body = $request->getJsonBody();
        $lead = $this->leadService->createLead((int)$orgId, (int)$userId, $body);

        Response::success([
            'lead' => $lead
        ], 201);
    }
}
