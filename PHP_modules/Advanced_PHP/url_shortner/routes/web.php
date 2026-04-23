<?php

use App\Controllers\SnapController;

$controller = new SnapController();

// API Endpoints
$router->post('/api/shorten', fn() => $controller->generate());

$router->get('/api/urls', fn() => $controller->listAll());

// Redirection handling
$router->get('/{code}', fn(array $params) => $controller->executeRedirect($params));

// Serving Frontend
$router->get('/', function () {
    $html = file_get_contents(__DIR__ . '/../public/frontend.html');
    header('Content-Type: text/html; charset=UTF-8');
    echo $html;
});
