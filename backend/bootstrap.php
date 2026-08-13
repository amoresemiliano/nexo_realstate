<?php
// backend/bootstrap.php

ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_only_cookies', 1);
session_start();

ini_set('display_errors', 0);
ini_set('log_errors', 1);

$env = getenv('NEXO_ENV') ?: 'dev';
$configPath = '';

if ($env === 'prod') {
    $configPath = '/home/athcomar/nexo_config/prod.php';
} else {
    $configPath = '/home/athcomar/nexo_config/dev.php';
}

if (!file_exists($configPath)) {
    $configPath = __DIR__ . '/config/config.php';
}

$config = [];
if (file_exists($configPath)) {
    $config = require $configPath;
}

$GLOBALS['NEXO_CONFIG'] = $config;

spl_autoload_register(function ($class) {
    $base_dir = __DIR__ . '/src/';
    $file = $base_dir . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require $file;
    }
});
