<?php
namespace Core;

class Request {
    private string $method;
    private string $uri;
    private array $queryParams;
    private array $headers;
    private ?array $jsonBody = null;

    public function __construct() {
        $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $rawUri = $_SERVER['REQUEST_URI'] ?? '/';
        $this->uri = parse_url($rawUri, PHP_URL_PATH) ?? '/';
        $this->queryParams = $_GET ?? [];
        $this->headers = $this->extractHeaders();
    }

    public function getMethod(): string {
        return $this->method;
    }

    public function getUri(): string {
        return $this->uri;
    }

    public function getQueryParams(): array {
        return $this->queryParams;
    }

    public function getHeader(string $name): ?string {
        $normalized = strtolower(str_replace('_', '-', $name));
        return $this->headers[$normalized] ?? null;
    }

    public function getJsonBody(): array {
        if ($this->jsonBody !== null) {
            return $this->jsonBody;
        }

        $input = file_get_contents('php://input');
        if (empty($input)) {
            $this->jsonBody = $_POST ?? [];
            return $this->jsonBody;
        }

        $decoded = json_decode($input, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            $this->jsonBody = [];
            return $this->jsonBody;
        }

        $this->jsonBody = $decoded;
        return $this->jsonBody;
    }

    private function extractHeaders(): array {
        $headers = [];
        if (function_exists('getallheaders')) {
            $rawHeaders = getallheaders();
            if (is_array($rawHeaders)) {
                foreach ($rawHeaders as $key => $val) {
                    $headers[strtolower(str_replace('_', '-', $key))] = (string)$val;
                }
            }
        }

        foreach ($_SERVER as $key => $value) {
            if (strpos($key, 'HTTP_') === 0) {
                $headerName = strtolower(str_replace(['HTTP_', '_'], ['', '-'], $key));
                $headers[$headerName] = (string)$value;
            }
        }
        return $headers;
    }
}
