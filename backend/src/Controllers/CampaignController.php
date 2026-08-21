<?php
// backend/src/Controllers/CampaignController.php

namespace Controllers;

use Core\Request;
use Core\Response;
use Services\CampaignService;

class CampaignController
{
    private CampaignService $campaignService;

    public function __construct()
    {
        $this->campaignService = new CampaignService();
    }

    public function index(Request $request): void
    {
        $session = $request->getSession();
        $orgId = (int)$session['organization_id'];

        $campaigns = $this->campaignService->getCampaignsForOrganization($orgId);

        Response::json([
            'success' => true,
            'data' => [
                'campaigns' => $campaigns
            ]
        ], 200);
    }

    public function store(Request $request): void
    {
        $session = $request->getSession();
        $orgId = (int)$session['organization_id'];
        $userId = (int)$session['user_id'];

        $input = $request->getBody();
        $campaign = $this->campaignService->createCampaign($input, $orgId, $userId);

        Response::json([
            'success' => true,
            'data' => [
                'campaign' => $campaign
            ]
        ], 201);
    }
}
