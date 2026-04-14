<?php
/**
 * PHP Control Flow: Decisions and Repetition
 * Theme: Movie Theater Ticketing
 */

// 1. Conditionals: Age-based pricing
$viewer_age = 16;
$ticket_type = "";
$ticket_price = 0;

if ($viewer_age < 12) {
    $ticket_type = "Child";
    $ticket_price = 8.50;
} elseif ($viewer_age >= 60) {
    $ticket_type = "Senior";
    $ticket_price = 9.00;
} else {
    $ticket_type = "Standard";
    $ticket_price = 12.00;
}

// Ternary Operator for rapid check
$can_watch_horror = ($viewer_age >= 18) ? "Allowed" : "Requires Supervision";

// Switch statement for day-based discounts
$current_day = date("l");
switch ($current_day) {
    case "Tuesday":
        $special_offer = "2-for-1 Popcorn!";
        break;
    case "Friday":
    case "Saturday":
        $special_offer = "Late Night Shows Available";
        break;
    default:
        $special_offer = "Regular Cinema Hours";
}

// 2. Loops: Generating Row and Seat layout
$rows = ["A", "B", "C", "D"];
$seats_per_row = 10;

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Cinema Ticketing</title>
    <style>
        .seat { display: inline-block; width: 30px; height: 30px; border: 1px solid #ccc; margin: 2px; text-align: center; line-height: 30px; font-size: 10px; }
        .row-label { font-weight: bold; width: 20px; display: inline-block; }
    </style>
</head>
<body>
    <h2>Booking Summary</h2>
    <ul>
        <li><strong>Category:</strong> <?php echo $ticket_type; ?></li>
        <li><strong>Price:</strong> $<?php echo number_format($ticket_price, 2); ?></li>
        <li><strong>R-Rated Access:</strong> <?php echo $can_watch_horror; ?></li>
        <li><strong>Today's Special:</strong> <?php echo $special_offer; ?></li>
    </ul>

    <hr>
    <h3>Select Your Seat</h3>
    <?php foreach ($rows as $row_char): ?>
        <div>
            <span class="row-label"><?php echo $row_char; ?></span>
            <?php for ($i = 1; $i <= $seats_per_row; $i++): ?>
                <div class="seat"><?php echo $i; ?></div>
            <?php endfor; ?>
        </div>
    <?php endforeach; ?>

</body>
</html>
