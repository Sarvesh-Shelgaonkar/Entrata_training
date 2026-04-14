# PHP Web Features: Forms and Sessions

PHP was designed for the web, and it provides powerful tools for handling user input and maintaining state across different pages.

## 1. Form Handling
HTML forms send data to PHP using either the `GET` or `POST` method.
- **`$_GET`**: Data is visible in the URL. Good for search queries.
- **`$_POST`**: Data is hidden from the URL. Used for sensitive data like passwords.
- **Validation**: Always use `htmlspecialchars()` to prevent XSS attacks.

## 2. State Management (Sessions & Cookies)
HTTP is stateless, meaning the server forgets who you are after each request.
- **Sessions**: Store data on the server. `session_start()` must be called at the very top.
- **Cookies**: Store data in the user's browser.

## 3. Basic Routing
Routing is the process of mapping a URL request to a specific file or piece of code.
- Example: `index.php?page=contact` can be handled using a `switch` statement in `index.php`.
