<?php

namespace App;

class PriceCalculator
{
    /**
     * Calculates the final price after adding tax and applying a discount.
     */
    public function calculateFinalPrice(float $basePrice, float $taxPercentage = 0, float $discountAmount = 0): float
    {
        if ($basePrice < 0) {
            throw new \InvalidArgumentException('Base price cannot be negative.');
        }

        $taxAmount = ($basePrice * $taxPercentage) / 100;
        $totalWithTax = $basePrice + $taxAmount;
        
        $finalPrice = $totalWithTax - $discountAmount;

        return $finalPrice < 0 ? 0.0 : $finalPrice;
    }

    /**
     * Checks if a user is eligible for a special bulk discount.
     */
    public function isEligibleForBulkDiscount(int $quantity): bool
    {
        return $quantity >= 10;
    }
}
