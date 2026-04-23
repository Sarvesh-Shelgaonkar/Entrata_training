<?php

namespace Tests;

use App\Calculator;
use PHPUnit\Framework\TestCase;

class CalculatorTest extends TestCase
{
    private Calculator $calculator;


    protected function setUp(): void
    {
        $this->calculator = new Calculator();
    }

    public function test_add_two_positive_numbers(): void
    {
        $result = $this->calculator->add(3, 5);
        $this->assertEquals(8, $result);
    }

    public function test_add_negative_numbers(): void
    {
        $result = $this->calculator->add(-4, -6);
        $this->assertEquals(-10, $result);
    }


    public function test_subtract_returns_correct_difference(): void
    {
        $result = $this->calculator->subtract(10, 4);
        $this->assertEquals(6, $result);
    }

  
    public function test_multiply_two_numbers(): void
    {
        $result = $this->calculator->multiply(3, 7);
        $this->assertEquals(21, $result);
    }

    public function test_multiply_by_zero_returns_zero(): void
    {
        $result = $this->calculator->multiply(999, 0);
        $this->assertEquals(0, $result);
    }

  
    public function test_divide_returns_correct_quotient(): void
    {
        $result = $this->calculator->divide(10, 2);
        $this->assertEquals(5, $result);
    }

    public function test_divide_by_zero_throws_exception(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Division by zero is not allowed.');

        $this->calculator->divide(10, 0);
    }
}
