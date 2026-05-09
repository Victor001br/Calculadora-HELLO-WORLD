const { useEffect, useMemo, useState } = React;

const standardButtons = [
  { label: 'C', action: 'clear', className: 'clear' },
  { label: 'DEL', action: 'delete' },
  { label: '/', value: '/', className: 'operator' },
  { label: 'x', value: '*', className: 'operator' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '-', value: '-', className: 'operator' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '+', value: '+', className: 'operator' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '.', value: '.' },
  { label: '0', value: '0', className: 'zero' },
  { label: '=', action: 'calculate', className: 'equals' }
];

const scientificButtons = [
  { label: 'C', action: 'clear', className: 'clear' },
  { label: 'DEL', action: 'delete' },
  { label: '(', value: '(', className: 'function' },
  { label: ')', value: ')', className: 'function' },
  { label: '/', value: '/', className: 'operator' },
  { label: 'sin', value: 'sin(', className: 'function' },
  { label: 'cos', value: 'cos(', className: 'function' },
  { label: 'tan', value: 'tan(', className: 'function' },
  { label: 'x^y', value: '^', className: 'function' },
  { label: 'x', value: '*', className: 'operator' },
  { label: 'sqrt', value: 'sqrt(', className: 'function' },
  { label: 'log', value: 'log(', className: 'function' },
  { label: 'ln', value: 'ln(', className: 'function' },
  { label: 'pi', value: 'pi', className: 'function' },
  { label: '-', value: '-', className: 'operator' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: 'e', value: 'e', className: 'function' },
  { label: '+', value: '+', className: 'operator' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '%', value: '/100', className: 'function' },
  { label: '.', value: '.' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '0', value: '0' },
  { label: '=', action: 'calculate', className: 'equals scientific-equals' }
];

function formatOperation(originalExpression, result) {
  return `${new Date().toLocaleString('pt-BR')} - ${originalExpression} = ${result}`;
}

function registerOperation(originalExpression, result) {
  fetch('/registrar-operacao', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operation: formatOperation(originalExpression, result)
    })
  }).catch(() => {
    console.warn('Nao foi possivel registrar a operacao no ARQUIVOX.txt.');
  });
}

function prepareExpression(expression) {
  return expression
    .replace(/\bpi\b/g, 'Math.PI')
    .replace(/\be\b/g, 'Math.E')
    .replace(/\bsin\(/g, 'Math.sin(')
    .replace(/\bcos\(/g, 'Math.cos(')
    .replace(/\btan\(/g, 'Math.tan(')
    .replace(/\bsqrt\(/g, 'Math.sqrt(')
    .replace(/\blog\(/g, 'Math.log10(')
    .replace(/\bln\(/g, 'Math.log(')
    .replace(/\^/g, '**');
}

function CalculatorApp() {
  const [expression, setExpression] = useState('');
  const [calculatorMode, setCalculatorMode] = useState('standard');
  const [darkTheme, setDarkTheme] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyStatus, setHistoryStatus] = useState('Nenhum registro encontrado.');
  const [displayEffect, setDisplayEffect] = useState(false);
  const [pressedButton, setPressedButton] = useState('');

  const displayValue = expression || '0';
  const isScientific = calculatorMode === 'scientific';
  const activeButtons = isScientific ? scientificButtons : standardButtons;

  const appClassName = useMemo(() => {
    return `app ${isScientific ? 'scientific-mode' : ''} ${historyOpen ? 'modal-is-open' : ''}`;
  }, [historyOpen, isScientific]);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkTheme);
  }, [darkTheme]);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setHistoryOpen(false);
      }
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    if (!displayEffect) {
      return undefined;
    }

    const timer = setTimeout(() => setDisplayEffect(false), 360);
    return () => clearTimeout(timer);
  }, [displayEffect]);

  function flashButton(label) {
    setPressedButton(label);
    setTimeout(() => setPressedButton(''), 180);
  }

  function addValue(value) {
    setExpression((currentExpression) => {
      if (currentExpression === 'Erro') {
        return value;
      }

      return currentExpression + value;
    });
  }

  function clearCalculator() {
    setExpression('');
    setDisplayEffect(true);
  }

  function deleteLastCharacter() {
    setExpression((currentExpression) => {
      if (currentExpression === 'Erro') {
        return '';
      }

      return currentExpression.slice(0, -1);
    });
  }

  function calculateResult() {
    if (!expression) {
      return;
    }

    try {
      const originalExpression = expression;
      let result = Function(`"use strict"; return (${prepareExpression(expression)})`)();
      result++;
      setExpression(String(result));
      setDisplayEffect(true);
      registerOperation(originalExpression, result);
    } catch (error) {
      setExpression('Erro');
      setDisplayEffect(true);
    }
  }

  function handleButtonClick(button) {
    flashButton(button.label);

    if (button.value) {
      addValue(button.value);
      return;
    }

    if (button.action === 'clear') {
      clearCalculator();
    }

    if (button.action === 'delete') {
      deleteLastCharacter();
    }

    if (button.action === 'calculate') {
      calculateResult();
    }
  }

  async function openHistoryModal() {
    setHistoryOpen(true);
    setHistoryRecords([]);
    setHistoryStatus('Carregando registros...');

    try {
      const response = await fetch('/ultimos-registros');

      if (!response.ok) {
        throw new Error('Falha ao buscar registros.');
      }

      const data = await response.json();
      const records = data.records || [];
      setHistoryRecords(records);
      setHistoryStatus(records.length ? '' : 'Nenhum registro encontrado.');
    } catch (error) {
      setHistoryStatus('Nao foi possivel carregar os registros.');
    }
  }

  function closeHistoryModal() {
    setHistoryOpen(false);
  }

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'div',
      { className: appClassName },
      React.createElement(
        'main',
        { className: 'calculator', 'aria-label': isScientific ? 'Calculadora cientifica' : 'Calculadora simples' },
        React.createElement('h1', null, isScientific ? 'Calculadora Cientifica' : 'Calculadora'),
        React.createElement(
          'div',
          { className: 'mode-switch', role: 'group', 'aria-label': 'Alternar tipo de calculadora' },
          React.createElement(
            'button',
            {
              type: 'button',
              className: calculatorMode === 'standard' ? 'mode-option active' : 'mode-option',
              onClick: () => setCalculatorMode('standard')
            },
            'Normal'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              className: calculatorMode === 'scientific' ? 'mode-option active' : 'mode-option',
              onClick: () => setCalculatorMode('scientific')
            },
            'Cientifica'
          )
        ),
        React.createElement('input', {
          className: `display ${displayEffect ? 'display-pop' : ''}`,
          type: 'text',
          value: displayValue,
          'aria-label': 'Resultado',
          readOnly: true
        }),
        React.createElement(
          'section',
          {
            className: isScientific ? 'buttons scientific-buttons' : 'buttons',
            'aria-label': isScientific ? 'Teclas da calculadora cientifica' : 'Teclas da calculadora'
          },
          activeButtons.map((button) =>
            React.createElement(
              'button',
              {
                key: `${calculatorMode}-${button.label}`,
                type: 'button',
                className: `${button.className || ''} ${pressedButton === button.label ? 'button-pressed' : ''}`.trim(),
                onClick: () => handleButtonClick(button)
              },
              button.label
            )
          )
        )
      ),
      React.createElement(
        'button',
        { type: 'button', className: 'history-button', onClick: openHistoryModal },
        'Ultimos registros'
      ),
      React.createElement(
        'label',
        { className: 'theme-switch' },
        React.createElement('span', null, 'LIGHT'),
        React.createElement('input', {
          type: 'checkbox',
          checked: darkTheme,
          onChange: (event) => setDarkTheme(event.target.checked),
          'aria-label': 'Alternar tema claro e escuro'
        }),
        React.createElement('span', { className: 'switch-slider' }),
        React.createElement('span', null, 'DARK')
      )
    ),
    historyOpen &&
      React.createElement(
        'div',
        { className: 'modal-backdrop', onClick: closeHistoryModal },
        React.createElement(
          'section',
          {
            className: 'history-modal',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'historyTitle',
            onClick: (event) => event.stopPropagation()
          },
          React.createElement(
            'div',
            { className: 'modal-header' },
            React.createElement('h2', { id: 'historyTitle' }, 'Ultimos 5 registros'),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'close-modal',
                onClick: closeHistoryModal,
                'aria-label': 'Fechar modal'
              },
              '\u00d7'
            )
          ),
          historyRecords.length > 0
            ? React.createElement(
                'ol',
                { className: 'history-list' },
                historyRecords.map((record, index) =>
                  React.createElement('li', { key: `${record}-${index}` }, record)
                )
              )
            : React.createElement('p', { className: 'history-empty' }, historyStatus)
        )
      )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(CalculatorApp));
