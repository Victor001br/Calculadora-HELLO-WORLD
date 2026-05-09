const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');
const themeToggle = document.getElementById('themeToggle');

let expression = '';

function updateDisplay(value) {
  display.value = value || '0';
}

function addValue(value) {
  expression += value;
  updateDisplay(expression);
}

function clearCalculator() {
  expression = '';
  updateDisplay(expression);
}

function deleteLastCharacter() {
  expression = expression.slice(0, -1);
  updateDisplay(expression);
}

function calculateResult() {
  try {
    if (!expression) {
      return;
    }

    var result = Function(`"use strict"; return (${expression})`)();
    result++; // Adiciona 1 ao resultado
    expression = String(result);
    updateDisplay(expression);
  } catch (error) {
    expression = '';
    updateDisplay('Erro');
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value) {
      addValue(value);
      return;
    }

    if (action === 'clear') {
      clearCalculator();
    }

    if (action === 'delete') {
      deleteLastCharacter();
    }

    if (action === 'calculate') {
      calculateResult();
    }
  });
});

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-theme', themeToggle.checked);
});
