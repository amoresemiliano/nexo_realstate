<?php
namespace Core;

class Router {
    private array $routes = [];

    public function get(string $path, callable|array $handler, array $middlewares = []): void {
        $this->addRoute('GET', $path, $handler, $middlewares);
    }

    public function post(string $path, callable|array $handler, array $middlewares = []): void {
        $this->addRoute('POST', $path, $handler, $middlewares);
    }

    public function put(string $path, callable|array $handler, array $middlewares = []): void {
        $this->addRoute('PUT', $path, $handler, $middlewares);
    }

    public function delete(string $path, callable|array $handler, array $middlewares = []): void {
        $this->addRoute('DELETE', $path, $handler, $middlewares);
    }

    private function addRoute(string $method, string $path, callable|array $handler, array $middlewares): void {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler,
            'middlewares' => $middlewares,
        ];
    }

    public function dispatch(Request $request): void {
        $method = $request->getMethod();
        $uri = $request->getUri();

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            if ($this->matchPath($route['path'], $uri)) {
                try {
                    // Execute Middlewares
                    foreach ($route['middlewares'] as $middleware) {
                        if (is_callable($middleware)) {
                            call_user_func($middleware, $request);
                        } elseif (is_string($middleware) && class_exists($middleware)) {
                            $mwInstance = new $middleware();
                            $mwInstance->handle($request);
                        }
                    }

                    // Execute Handler
                    $handler = $route['handler'];
                    if (is_array($handler) && count($handler) === 2) {
                        [$class, $action] = $handler;
                        $controller = new $class();
                        $controller->$action($request);
                        return;
                    } elseif (is_callable($handler)) {
                        call_user_func($handler, $request);
                        return;
                    }
                } catch (ApiException $e) {
                    Response::error($e->getErrorCode(), $e->getMessage(), $e->getStatusCode());
                    return;
                } catch (\Throwable $e) {
                    // Log error internally, never expose stack trace or database error message
                    error_log('API Error: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
                    Response::error('SERVER_ERROR', 'Ocurrió un error interno en el servidor.', 500);
                    return;
                }
            }
        }

        Response::error('NOT_FOUND', 'Ruta no encontrada.', 404);
    }

    private function matchPath(string $routePath, string $requestUri): bool {
        // Matches exact path or path trailing pattern (e.g. /api/v1/health or subpath match)
        if ($routePath === $requestUri) {
            return true;
        }

        // Handle subpath suffix matching for subfolder BlueHost deployments (e.g. /sistemas/nexo_realstate/dev/api/v1/health)
        if (preg_match('#' . preg_quote($routePath, '#') . '$#', $requestUri)) {
            return true;
        }

        return false;
    }
}
