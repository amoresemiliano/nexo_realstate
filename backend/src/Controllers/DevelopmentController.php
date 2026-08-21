<?php
// backend/src/Controllers/DevelopmentController.php

namespace Controllers;

use Core\Request;
use Core\Response;
use Services\DevelopmentService;

class DevelopmentController
{
    private DevelopmentService $developmentService;

    public function __construct()
    {
        $this->developmentService = new DevelopmentService();
    }

    public function index(Request $request): void
    {
        $session = $request->getSession();
        $orgId = (int)$session['organization_id'];

        $developments = $this->developmentService->getDevelopmentsForOrganization($orgId);

        Response::json([
            'success' => true,
            'data' => [
                'developments' => $developments
            ]
        ], 200);
    }

    public function store(Request $request): void
    {
        $session = $request->getSession();
        $orgId = (int)$session['organization_id'];
        $userId = (int)$session['user_id'];

        $input = $request->getBody();
        $development = $this->developmentService->createDevelopment($input, $orgId, $userId);

        Response::json([
            'success' => true,
            'data' => [
                'development' => $development
            ]
        ], 201);
    }
}
