# PHP Functions and Modularity

Functions are the building blocks of reusable code in PHP. Modularity allows you to break your application into smaller, manageable pieces.

## 1. User-Defined Functions
You can create your own functions using the `function` keyword.
- **Parameters**: Values passed to the function.
- **Return Value**: The result of the function's execution.

## 2. Anonymous Functions (Lambdas)
Functions with no name, often used as arguments for other functions.
- **`array_filter()`**: Uses a callback function to filter array elements.
- **`array_map()`**: Applies a function to all elements in an array.

## 3. Built-in Functions
PHP has thousands of pre-made functions for handling strings, math, arrays, etc.
- Example: `htmlspecialchars()`, `number_format()`, `is_numeric()`.

## 4. Partials and Reusability
Using `include` or `require` to import common UI elements like headers, footers, or configuration settings.
- **`require`**: Halts the script if the file is missing.
- **`include`**: Continues with a warning if the file is missing.
