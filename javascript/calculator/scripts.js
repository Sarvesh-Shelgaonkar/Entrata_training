const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let currentInput = "0";

function updateDisplay() {
  display.value = currentInput;
}

function clearDisplay() {
  currentInput = "0";
  updateDisplay();
}

function deleteLastCharacter() {
  if (currentInput.length <= 1) {
    currentInput = "0";
  } else {
    let text = currentInput
    currentInput = text.substring(0-text.length()-1)
  }
  updateDisplay();
}

function appendValue(value) {
  if (value === "." && currentInput.split(/[\+\-\*\/%]/).pop().includes(".")) {
    return;
  }

  if (currentInput === "0" && value !== ".") {
    currentInput = value;
  } else {
    currentInput += value;
  }

  updateDisplay();
}

function calculateResult() {
  try {
    let result = Function("return " + currentInput)();
    currentInput = result.toString();
  } catch {
    currentInput = "Error";
  }

  updateDisplay();
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const value = button.dataset.value;

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
  }

  appendValue(value);
});
