<?php
// backend/tools/create_dev_admin.php
/**
 * CLI Tool de Seguridad para creación de Usuario Administrador DEV
 * Uso CLI seguro: php backend/tools/create_dev_admin.php admin@vegendigital.com "Admin General"
 * 
 * La contraseña se solicita de forma interactiva e invisible para evitar exposición
 * en el historial de la consola, archivos de log o lista de procesos.
 */

require_once __DIR__ . '/../bootstrap.php';

use Core\Database;

if (php_sapi_name() !== 'cli') {
    fwrite(STDERR, "Error: Este script debe ser ejecutado exclusivamente mediante consola CLI.\n");
    exit(1);
}

// 1. Validar parámetros CLI (Únicamente email y nombre opcional)
$email = $argv[1] ?? null;
$name = $argv[2] ?? 'Administrador DEV';

if (!$email) {
    fwrite(STDERR, "Uso CLI Seguro: php backend/tools/create_dev_admin.php <email> [nombre]\n");
    fwrite(STDERR, "Ejemplo:        php backend/tools/create_dev_admin.php admin@vegendigital.com \"Admin General\"\n");
    exit(1);
}

$cleanEmail = strtolower(trim($email));
if (!filter_var($cleanEmail, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "[X] Error: El correo electrónico proporcionado ('$email') no es válido.\n");
    exit(1);
}

// Advertir si intentó pasar más argumentos (ej: contraseña por argumento)
if ($argc > 3) {
    fwrite(STDERR, "[!] ADVERTENCIA DE SEGURIDAD: Se detectaron argumentos adicionales en la línea de comandos.\n");
    fwrite(STDERR, "    Las contraseñas NO deben enviarse por argumentos para no quedar expuestas en logs o process list.\n");
    fwrite(STDERR, "    Uso correcto: php backend/tools/create_dev_admin.php <email> [nombre]\n\n");
}

/**
 * Función para solicitar entrada de texto oculta en terminal CLI (Linux/Unix/BlueHost)
 */
function readSecretPrompt(string $prompt): string {
    fwrite(STDOUT, $prompt);
    $isWindows = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN';

    if (!$isWindows) {
        shell_exec('stty -echo 2>/dev/null');
    }

    try {
        $input = fgets(STDIN);
        $secret = $input !== false ? trim($input) : '';
    } finally {
        if (!$isWindows) {
            shell_exec('stty echo 2>/dev/null');
        }
        fwrite(STDOUT, "\n");
    }

    return $secret;
}

// 2. Solicitud interactiva y segura de contraseña
$password = readSecretPrompt("Ingrese la contraseña para $cleanEmail: ");
if (empty($password)) {
    fwrite(STDERR, "[X] Error: La contraseña no puede estar vacía.\n");
    exit(1);
}

$passwordConfirm = readSecretPrompt("Confirme la contraseña para $cleanEmail: ");

if ($password !== $passwordConfirm) {
    fwrite(STDERR, "[X] Error: Las contraseñas ingresadas no coinciden.\n");
    exit(1);
}

if (strlen($password) < 12) {
    fwrite(STDERR, "[X] Error de Seguridad: La contraseña debe contener al menos 12 caracteres.\n");
    exit(1);
}

// 3. Ejecutar persistencia en MySQL PDO
try {
    $pdo = Database::connection();

    // Asegurar Organización DEV
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

    // Generar Hash BCRYPT seguro
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Crear o actualizar usuario ADMIN
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

    fwrite(STDOUT, "[✓] Proceso completado. Usuario listo para autenticarse vía /api/v1/auth/login.\n");
    exit(0);

} catch (\Throwable $e) {
    fwrite(STDERR, "[X] Error en base de datos al crear usuario DEV: " . $e->getMessage() . "\n");
    exit(1);
}
