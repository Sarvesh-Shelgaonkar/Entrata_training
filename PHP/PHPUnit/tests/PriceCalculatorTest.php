<?php

namespace Tests;

use App\PriceCalculator;
use PHPUnit\Framework\TestCase;

class PriceCalculatorTest extends TestCase
{
    private PriceCalculator $calculator;

    protected function setUp(): void
    {
        $this->calculator = new PriceCalculator();
    }

    public function test_final_price_with_tax_and_discount(): void
    {
        // Base: 100, Tax: 10% (110), Discount: 20 -> Final: 90
        $result = $this->calculator->calculateFinalPrice(100, 10, 20);
        $this->assertEquals(90.0, $result);
    }

    public function test_price_cannot_be_negative_returns_zero(): void
    {
        // Discount more than total price should return 0
        $result = $this->calculator->calculateFinalPrice(50, 0, 100);
        $this->assertEquals(0.0, $result);
    }

    public function test_negative_base_price_throws_exception(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Base price cannot be negative.');

        $this->calculator->calculateFinalPrice(-10, 0, 0);
    }

    public function test_bulk_discount_eligibility(): void
    {
        $this->assertTrue($this->calculator->isEligibleForBulkDiscount(10));
        $this->assertFalse($this->calculator->isEligibleForBulkDiscount(5));
    }
}
