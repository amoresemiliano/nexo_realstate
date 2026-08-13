<?php
namespace Core;

use PDO;
use PDOException;

class Database {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        $config = $GLOBALS['NEXO_CONFIG']['database'] ?? [];
        
        $host = $config['host'] ?? 'localhost';
        $db   = $config['name'] ?? '';
        $user = $config['user'] ?? '';
        $pass = $config['password'] ?? '';
        $charset = $config['charset'] ?? 'utf8mb4';

        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $this->pdo = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            // Throw our generic exception so we never leak $e->getMessage() (which could contain DSN/pass)
            throw new \Exception("Database connection failed.");
        }
    }

    public static function connection() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance->pdo;
    }

    public static function beginTransaction() {
        return self::connection()->beginTransaction();
    }

    public static function commit() {
        return self::connection()->commit();
    }

    public static function rollBack() {
        return self::connection()->rollBack();
    }
}
