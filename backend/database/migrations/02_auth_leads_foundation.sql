-- Migration 02: Auth & Leads Foundation
-- Compatible with Percona Server / MySQL 5.7

CREATE TABLE IF NOT EXISTS leads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(50) NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'Carga Manual',
    status VARCHAR(50) NOT NULL DEFAULT 'NUEVO',
    assigned_user_id BIGINT NULL,
    notes TEXT NULL,
    created_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_leads_org (organization_id),
    KEY idx_leads_org_status (organization_id, status),
    KEY idx_leads_org_created (organization_id, created_at),
    CONSTRAINT fk_leads_org FOREIGN KEY (organization_id) REFERENCES organizations (id),
    CONSTRAINT fk_leads_assigned_user FOREIGN KEY (assigned_user_id) REFERENCES users (id),
    CONSTRAINT fk_leads_created_user FOREIGN KEY (created_by_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
