<?php
// backend/src/Controllers/LotController.php

namespace Controllers;

use Core\Request;
use Core\Response;
use Services\LotService;

class LotController
{
    private LotService $lotService;

    public function __construct()
    {
        $this->lotService = new LotService();
    }

    public function index(Request $request): void
    {
        $session = $request->getSession();
        $orgId = (int)$session['organization_id'];

        $queryParams = $request->getQueryParams();
        $devId = isset($queryParams['developmentId']) ? (int)$queryParams['developmentId'] : null;

        $lots = $this->lotService->getLotsForOrganization($orgId, $devId);

        Response::json([
            'success' => true,
            'data' => [
                'lots' => $lots
            ]
        ], 200);
    }

    public function store(Request $request): void
    {
        $session = $request->getSession();
        $orgId = (int)$session['organization_id'];
        $userId = (int)$session['user_id'];

        $input = $request->getBody();
        $lot = $this->lotService->createLot($input, $orgId, $userId);

        Response::json([
            'success' => true,
            'data' => [
                'lot' => $lot
            ]
        ], 201);
    }
}
