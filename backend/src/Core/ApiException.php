<?php
namespace Core;

class ApiException extends \Exception {
    private string $errorCode;
    private int $statusCode;

    public function __construct(string $errorCode, string $message, int $statusCode = 400, ?\Throwable $previous = null) {
        parent::__construct($message, 0, $previous);
        $this->errorCode = $errorCode;
        $this->statusCode = $statusCode;
    }

    public function getErrorCode(): string {
        return $this->errorCode;
    }

    public function getStatusCode(): int {
        return $this->statusCode;
    }
}
