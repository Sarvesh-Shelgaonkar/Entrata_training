<?php
/**
 * public/index.php — Application entry point
 *
 * All web requests are funnelled here by .htaccess.
 * This file:
 *  1. Loads Composer autoloader (PSR-4)
 *  2. Boots the Router
 *  3. Loads route definitions
 *  4. Dispatches the current request
 */

declare(strict_types=1);

// ── 1. Composer PSR-4 autoloader ──────────────────────────────────────────────
require_once __DIR__ . '/../vendor/autoload.php';

use App\Core\Router;

// ── 2. Instantiate the router ─────────────────────────────────────────────────
$router = new Router();

// ── 3. Load route definitions ─────────────────────────────────────────────────
require_once __DIR__ . '/../routes/web.php';

// ── 4. Dispatch ───────────────────────────────────────────────────────────────
$router->dispatch();
