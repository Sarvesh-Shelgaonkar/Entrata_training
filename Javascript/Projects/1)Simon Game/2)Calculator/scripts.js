const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let shouldResetDisplay = false;

function updateDisplay() {
  display.value = currentInput;
  // Auto-scroll to the right for long numbers
  display.scrollLeft = display.scrollWidth;
}

function clearDisplay() {
  currentInput = "0";
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLastCharacter() {
  if (currentInput === "Error" || currentInput.length <= 1) {
    currentInput = "0";
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

function appendValue(value) {
  if (shouldResetDisplay && !isOperator(value)) {
    currentInput = value;
    shouldResetDisplay = false;
  } else {
    if (shouldResetDisplay) shouldResetDisplay = false;

    // Prevent multiple decimals in one number
    if (value === "." && currentInput.split(/[\+\-\*\/%]/).pop().includes(".")) {
      return;
    }

    if (currentInput === "0" && value !== ".") {
      currentInput = value;
    } else {
      currentInput += value;
    }
  }

  updateDisplay();
}

function isOperator(value) {
  return ["+", "-", "*", "/", "%"].includes(value);
}

function calculateResult() {
  try {
    // Replace visual operators with JS operators if needed (though they are same in data-value)
    let expression = currentInput;
    
    // Evaluate the expression
    // Using Function instead of eval for a bit more safety, 
    // but in a real app we might want a proper math parser.
    let result = new Function("return " + expression)();
    
    // Handle floating point precision issues (e.g., 0.1 + 0.2)
    if (!Number.isInteger(result)) {
      result = parseFloat(result.toFixed(8));
    }
    
    currentInput = result.toString();
    shouldResetDisplay = true;
  } catch (error) {
    currentInput = "Error";
    shouldResetDisplay = true;
  }

  updateDisplay();
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  // Add click animation class if desired, or just use CSS active state
  
  if (action === "clear") {
    clearDisplay();
    return;
  }

  if (action === "delete") {
    deleteLastCharacter();
    return;
  }

  if (action === "calculate") {
    calculateResult();
    return;
  }

  if (currentInput === "Error") {
    currentInput = "0";
    shouldResetDisplay = false;
  }

  appendValue(value);
});

// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;
  
  if (/[0-9]/.test(key)) appendValue(key);
  if (key === ".") appendValue(".");
  if (key === "+") appendValue("+");
  if (key === "-") appendValue("-");
  if (key === "*") appendValue("*");
  if (key === "/") appendValue("/");
  if (key === "%") appendValue("%");
  if (key === "Enter" || key === "=") calculateResult();
  if (key === "Backspace") deleteLastCharacter();
  if (key === "Escape") clearDisplay();
});
