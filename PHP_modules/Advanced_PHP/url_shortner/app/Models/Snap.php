<?php

namespace App\Models;

use App\Core\Database;

class Snap
{
    private \PDO $db_handle;
    private array $entry_data = [];
    private const LINK_PATTERN = '/^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\\/\\w\\.-]*)*\\/?$/';
    
    public function __construct(?\PDO $pdo = null)
    {
        $this->db_handle = $pdo ?? Database::getInstance()->getConnection();
    }

    public function isValidLink(string $url): bool
    {
        return (bool) preg_match(self::LINK_PATTERN, $url);
    }

    public function generateSnapToken(int $len = 7): string
    {
        $alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'; // Better readability
        $token = '';
        
        do {
            $token = '';
            for ($i = 0; $i < $len; $i++) {
                $token .= $alphabet[random_int(0, strlen($alphabet) - 1)];
            }
        } while ($this->lookupByToken($token) !== null); 

        return $token;
    }

    public function registerSnap(string $target): array
    {
        $unique_token = $this->generateSnapToken();

        $query = $this->db_handle->prepare(
            'INSERT INTO snaps (target_url, snap_token) VALUES (:target, :token)'
        );
        $query->execute([':target' => $target, ':token' => $unique_token]);

        return [
            'id'           => (int) $this->db_handle->lastInsertId(),
            'target_url'   => $target,
            'snap_token'   => $unique_token,
            'visit_count'  => 0,
            'created_at'   => date('Y-m-d H:i:s'),
        ];
    }

    public function lookupByToken(string $token): ?array
    {
        $query = $this->db_handle->prepare('SELECT * FROM snaps WHERE snap_token = :token LIMIT 1');
        $query->execute([':token' => $token]);
        $data = $query->fetch();
        return $data ?: null;
    }

    public function incrementVisitCount(string $token): void
    {
        $this->db_handle->prepare('UPDATE snaps SET visit_count = visit_count + 1 WHERE snap_token = :token')
                  ->execute([':token' => $token]);
    }

    public function fetchAllSnaps(): array
    {
        return $this->db_handle->query('SELECT * FROM snaps ORDER BY created_at DESC')->fetchAll();
    }
}
