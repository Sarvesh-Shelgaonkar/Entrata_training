<?php

namespace App\Models;

/**
 * Demonstrates: Namespace, Magic Methods
 */
class User
{
    private array $data = [];

    public function __construct(string $username, string $email)
    {
        $this->data['username'] = $username;
        $this->data['email'] = $email;
    }

    // Magic Method: __get (called when accessing inaccessible property)
    public function __get(string $name)
    {
        return $this->data[$name] ?? "Property '$name' not found!";
    }

    // Magic Method: __set (called when writing to inaccessible property)
    public function __set(string $name, $value): void
    {
        $this->data[$name] = $value;
    }

    // Magic Method: __toString (called when object is treated as a string)
    public function __toString(): string
    {
        return "User: {$this->data['username']} ({$this->data['email']})";
    }

    public function toArray(): array
    {
        return $this->data;
    }
}
