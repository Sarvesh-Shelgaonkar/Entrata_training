<?php
/**
 * PHP Basics: Core Concepts
 * Theme: Smart Gadgets Store
 */

// 1. Variables and Data Types
$store_name = "Future Gadgets Hub";     // String
$gadget_model = "HyperX Watch v3";      // String
$stock_count = 125;                     // Integer
$unit_price = 199.50;                   // Float
$is_in_stock = true;                    // Boolean

// 2. Operators and Calculations
$total_inventory_value = $stock_count * $unit_price; // Arithmetic
$discount_percentage = 15;
$discount_amount = ($total_inventory_value * $discount_percentage) / 100;
$final_price_after_tax = ($unit_price * 1.08) - 10;   // Calculation with tax and fixed discount

// 3. String Manipulation
$brand = "Samsung";
$product = "Galaxy Tab S9";
$full_product_name = $brand . " " . $product; // Concatenation
$slug = strtolower(str_replace(" ", "-", $full_product_name)); // String functions

// 4. Date and Time
$current_time = date("F j, Y, g:i a");
$sale_end_date = date("Y-m-d", strtotime("+7 days"));

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?php echo $store_name; ?></title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
        .info { background: #f4f4f4; padding: 15px; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>Welcome to <?php echo $store_name; ?></h1>
    <div class="info">
        <p><strong>Featured Product:</strong> <?php echo $full_product_name; ?></p>
        <p><strong>Retail Price:</strong> $<?php echo number_format($unit_price, 2); ?></p>
        <p><strong>URL Slug:</strong> /product/<?php echo $slug; ?></p>
        <hr>
        <p><strong>Current Date:</strong> <?php echo $current_time; ?></p>
        <p><strong>Summer Sale Ends On:</strong> <?php echo $sale_end_date; ?></p>
    </div>
</body>
</html>
