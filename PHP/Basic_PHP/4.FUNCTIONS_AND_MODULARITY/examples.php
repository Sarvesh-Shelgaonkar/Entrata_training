<?php
/**
 * PHP Functions and Modularity
 * Theme: Billing and Tax Calculation
 */

// 1. Standard Function with Parameters and Return
function calculate_gst($amount, $tax_rate = 18) {
    $tax = ($amount * $tax_rate) / 100;
    return $amount + $tax;
}

// 2. Built-in Function Usage
$base_price = 5000;
$final_total = calculate_gst($base_price);
$formatted_total = "INR " . number_format($final_total, 2);

// 3. Anonymous Function (Lambda)
$transactions = [1200, 450, 2300, 890, 3100];

// Filter transactions above 1000
$high_value_tx = array_filter($transactions, function($val) {
    return $val > 1000;
});

// Map: Add tax to all transactions
$taxed_transactions = array_map(function($val) {
    return $val * 1.05; // 5% flat fee
}, $transactions);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Billing System</title>
</head>
<body>
    <h1>Invoice Calculation</h1>
    
    <div class="summary">
        <p>Base Price: <?php echo $base_price; ?></p>
        <p><strong>Grand Total (with 18% GST): <?php echo $formatted_total; ?></strong></p>
    </div>

    <hr>

    <h3>Transaction Analysis:</h3>
    <p>High Value Transactions (> 1000): <?php echo implode(", ", $high_value_tx); ?></p>
    
    <p>Processing Fees Applied (5%):</p>
    <ul>
        <?php foreach ($taxed_transactions as $tx): ?>
            <li><?php echo number_format($tx, 2); ?></li>
        <?php endforeach; ?>
    </ul>

</body>
</html>
