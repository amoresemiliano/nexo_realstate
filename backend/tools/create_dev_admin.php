<?php
// backend/tools/create_dev_admin.php
/**
 * CLI Tool de Seguridad para creación de Usuario Administrador DEV
 * Uso CLI: php backend/tools/create_dev_admin.php admin@vegendigital.com MiPasswordSeguro123 "Admin Nexo"
 */

require_once __DIR__ . '/../bootstrap.php';

use Core\Database;

if (php_sapi_name() !== 'cli') {
    echo "Error: Este script debe ser ejecutado exclusivamente mediante la consola CLI.\n";
    exit(1);
}

$email = $argv[1] ?? null;
$password = $argv[2] ?? null;
$name = $argv[3] ?? 'Administrador DEV';

if (!$email) {
    fwrite(STDERR, "Uso: php backend/tools/create_dev_admin.php <email> [password] [nombre]\n");
    fwrite(STDERR, "Ejemplo: php backend/tools/create_dev_admin.php admin@vegendigital.com SecretPass123 \"Admin General\"\n");
    exit(1);
}

if (!$password) {
    fwrite(STDOUT, "Ingrese la contraseña para $email: ");
    $password = trim(fgets(STDIN));
}

if (strlen($password) < 6) {
    fwrite(STDERR, "Error: La contraseña debe tener al menos 6 caracteres.\n");
    exit(1);
}

try {
    $pdo = Database::connection();

    // 1. Asegurar Organización DEV
    $stmtOrg = $pdo->prepare("SELECT id FROM organizations WHERE name = 'Nexo Desarrollos DEV' LIMIT 1");
    $stmtOrg->execute();
    $org = $stmtOrg->fetch();

    if (!$org) {
        $stmtCreateOrg = $pdo->prepare("INSERT INTO organizations (name, status, created_at) VALUES ('Nexo Desarrollos DEV', 'ACTIVE', NOW())");
        $stmtCreateOrg->execute();
        $orgId = (int)$pdo->lastInsertId();
        fwrite(STDOUT, "[+] Organización 'Nexo Desarrollos DEV' (ID: $orgId) creada.\n");
    } else {
        $orgId = (int)$org['id'];
        fwrite(STDOUT, "[i] Organización DEV existente seleccionada (ID: $orgId).\n");
    }

    // 2. Hash de contraseña seguro
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $cleanEmail = strtolower(trim($email));

    // 3. Crear o actualizar Usuario ADMIN
    $stmtUser = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $stmtUser->execute(['email' => $cleanEmail]);
    $user = $stmtUser->fetch();

    if ($user) {
        $stmtUpdate = $pdo->prepare(
            "UPDATE users
             SET organization_id = :org_id, name = :name, password_hash = :hash, role = 'ADMIN', status = 'ACTIVE', updated_at = NOW()
             WHERE id = :id"
        );
        $stmtUpdate->execute([
            'org_id' => $orgId,
            'name' => $name,
            'hash' => $passwordHash,
            'id' => $user['id']
        ]);
        fwrite(STDOUT, "[+] Usuario ADMIN '$cleanEmail' (ID: {$user['id']}) actualizado exitosamente.\n");
    } else {
        $stmtInsert = $pdo->prepare(
            "INSERT INTO users (organization_id, name, email, password_hash, role, status, created_at)
             VALUES (:org_id, :name, :email, :hash, 'ADMIN', 'ACTIVE', NOW())"
        );
        $stmtInsert->execute([
            'org_id' => $orgId,
            'name' => $name,
            'email' => $cleanEmail,
            'hash' => $passwordHash
        ]);
        $newUserId = $pdo->lastInsertId();
        fwrite(STDOUT, "[+] Usuario ADMIN '$cleanEmail' (ID: $newUserId) creado exitosamente.\n");
    }

    fwrite(STDOUT, "[✓] Proceso completado. Usuario listo para autenticarse por /api/v1/auth/login.\n");
    exit(0);

} catch (\Throwable $e) {
    fwrite(STDERR, "[X] Error al crear usuario DEV: " . $e->getMessage() . "\n");
    exit(1);
}
