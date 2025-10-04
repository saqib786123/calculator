let display = document.getElementById('result');

function appendToDisplay(value) {
    if (display.value === 'Error') {
        clearDisplay();
    }
    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculateResult() {
    try {
        let expression = display.value;
        
        // Handle percentages - convert to decimal division by 100
        expression = expression.replace(/(\d+(\.\d+)?)%/g, function(match, number) {
            return '(' + number + '/100)';
        });
        
        // Handle square root - replace Math.sqrt(x) with calculated value
        expression = expression.replace(/Math\.sqrt\(([^)]+)\)/g, function(match, num) {
            return '(' + Math.sqrt(eval(num)) + ')';
        });
        
        // Handle power - replace Math.pow(x,y) with calculated value
        expression = expression.replace(/Math\.pow\(([^)]+)\)/g, function(match, args) {
            let [base, exp] = args.split(',');
            return '(' + Math.pow(eval(base), eval(exp)) + ')';
        });
        
        // Replace × with * for evaluation
        expression = expression.replace(/×/g, '*');
        
        // Evaluate the expression
        let result = eval(expression);
        
        if (isNaN(result) || !isFinite(result)) {
            display.value = 'Error';
        } else {
            // Round to 10 decimal places to avoid floating point precision issues
            display.value = parseFloat(result.toFixed(10)).toString();
        }
    } catch (error) {
        display.value = 'Error';
    }
}

function toggleSign() {
    if (display.value === '') return;
    
    if (display.value.charAt(0) === '-') {
        display.value = display.value.substring(1);
    } else {
        display.value = '-' + display.value;
    }
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === '%') {
        appendToDisplay('%');
    }
});