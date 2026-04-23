# 🔗 PHP URL Shortener 

---

# Project Goal

Build a **URL Shortener API** using PHP demonstrating Advanced PHP concepts (Note: I have use AI agents to help me to build this project):

* REST API
* MVC Architecture
* Namespaces
* Composer (PSR-4 Autoloading)
* Magic Methods
* Regular Expressions
* Apache Deployment

---

# 📁 Project Structure

```
url_shortner/
├── app/
│   ├── Controllers/
│   ├── Models/
│   └── Core/
├── public/
├── routes/
├── composer.json
├── .env
└── database.sql
```


---

# THEORY + IMPLEMENTATION

---

## 1. API (Application Programming Interface)

### Theory

An **API** allows communication between systems using HTTP requests.

Types:

* GET → Fetch data
* POST → Send data
* PUT → Update
* DELETE → Remove

REST API uses:

* JSON format
* Stateless communication

### In This Project

* JSON responses returned
* Endpoints created

File:

```
UrlController.php
```

---

## 2. Namespace

### Theory

A **namespace** is used to avoid class name conflicts.

Example:

```php
namespace App\Controllers;
```

### In This Project

* All classes organized under `App\`

Example:

```php
use App\Models\Url;
```

---

## 3. Composer

### Theory

**Composer** is a dependency manager in PHP.



### In This Project

```json
"autoload": {
  "psr-4": {
    "App\\": "app/"
  }
}
```

Run:

```bash
composer dump-autoload
```

---

## 4. Magic Methods

### Theory

Magic methods are special methods starting with `__` that PHP calls automatically.

Common:

* `__construct()` → runs when object created
* `__get()` → access private property
* `__set()` → assign value

In This Project

```php
public function __get($name)
```

Files:

* `Database.php`
* `Url.php`

---

## 5. Regular Expressions (Regex)

### Theory

Regex is used to **validate patterns** in strings.

Example:

```php
preg_match("/pattern/", $string);
```

### In This Project

* Used to validate URL format

`File:

```
Url.php
```

---

## 6. Apache Deployment

### Theory

Apache is a web server that serves PHP applications.

Problem:

* Apache looks for physical files

Solution:

* Use `.htaccess` for routing

### In This Project

```apache
RewriteEngine On
RewriteRule ^ index.php [QSA,L]
```

Routes all requests to `index.php`
---

