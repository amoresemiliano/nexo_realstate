-- backend/database/migrations/03_campaigns_developments_lots.sql
-- Migración P2B: Persistencia Real de Campañas, Barrios y Lotes en MySQL 5.7 / Percona

CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` BIGINT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `platform` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'ACTIVA',
  `budget_usd` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `spent_usd` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `leads_generated` INT NOT NULL DEFAULT 0,
  `conversions` INT NOT NULL DEFAULT 0,
  `start_date` DATE NOT NULL,
  `end_date` DATE NULL,
  `objective` VARCHAR(255) NULL,
  `audience` TEXT NULL,
  `created_by_user_id` BIGINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_campaigns_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_campaigns_user` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_campaigns_org` (`organization_id`),
  INDEX `idx_campaigns_org_status` (`organization_id`, `status`),
  INDEX `idx_campaigns_org_created` (`organization_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `developments` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` BIGINT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NULL,
  `province` VARCHAR(100) NULL,
  `country` VARCHAR(100) NULL DEFAULT 'Argentina',
  `address` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'COMERCIALIZACION_ACTIVA',
  `created_by_user_id` BIGINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_developments_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_developments_user` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_developments_org` (`organization_id`),
  INDEX `idx_developments_org_status` (`organization_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lots` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` BIGINT NOT NULL,
  `development_id` BIGINT NOT NULL,
  `number` VARCHAR(50) NOT NULL,
  `block` VARCHAR(50) NULL,
  `surface_m2` DECIMAL(10,2) NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `status` VARCHAR(50) NOT NULL DEFAULT 'DISPONIBLE',
  `orientation` VARCHAR(50) NULL,
  `observations` TEXT NULL,
  `created_by_user_id` BIGINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_lots_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lots_dev` FOREIGN KEY (`development_id`) REFERENCES `developments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lots_user` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `uk_lots_org_dev_number` UNIQUE (`organization_id`, `development_id`, `number`),
  INDEX `idx_lots_org` (`organization_id`),
  INDEX `idx_lots_org_status` (`organization_id`, `status`),
  INDEX `idx_lots_dev` (`development_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
