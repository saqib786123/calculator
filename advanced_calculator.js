// Math extensions for calculator
Math.ln = function(x) {
    return Math.log(x);
};

Math.factorial = function(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
};

let expressionDisplay = document.getElementById('expression');
let resultDisplay = document.getElementById('result');

function appendToDisplay(value) {
    if (resultDisplay.value === 'Error') {
        clearDisplay();
    }
    
    expressionDisplay.value += value;
    resultDisplay.value = '';
}

function clearDisplay() {
    expressionDisplay.value = '';
    resultDisplay.value = '';
}

function deleteLast() {
    expressionDisplay.value = expressionDisplay.value.slice(0, -1);
    resultDisplay.value = '';
}

function calculateResult() {
    try {
        let expression = expressionDisplay.value;
        
        if (!expression) {
            resultDisplay.value = '0';
            return;
        }

        // Handle power operations (replace ^ with Math.pow)
        expression = expression.replace(/\^/g, '**');

        // Handle factorial operations
        expression = expression.replace(/(\d+)!/g, function(match, num) {
            const n = parseInt(num);
            if (n >= 0 && n <= 170) { // Prevent overflow
                return Math.factorial(n).toString();
            } else {
                throw new Error("Invalid factorial input");
            }
        });

        // Handle percentage calculations
        expression = expression.replace(/(\d+(\.\d+)?)%/g, function(match, number) {
            return '(' + number + '/100)';
        });

        // Replace 'ln' with 'Math.ln'
        expression = expression.replace(/ln\(/g, 'Math.ln(');

        // Replace 'log' with 'Math.log10'
        expression = expression.replace(/log\(/g, 'Math.log10(');

        // Evaluate the expression
        let result = eval(expression);
        
        if (isNaN(result) || !isFinite(result)) {
            resultDisplay.value = 'Error';
        } else {
            // Format the result to handle floating point precision
            if (Number.isInteger(result)) {
                resultDisplay.value = result.toString();
            } else {
                // Round to 10 decimal places to avoid floating point precision issues
                resultDisplay.value = parseFloat(result.toFixed(10)).toString();
            }
        }
    } catch (error) {
        resultDisplay.value = 'Error';
    }
}

function toggleSign() {
    if (expressionDisplay.value === '') return;
    
    let currentValue = expressionDisplay.value;
    let lastNumber = '';
    
    // Find the last number in the expression
    for (let i = currentValue.length - 1; i >= 0; i--) {
        if ('+-*/().'.includes(currentValue[i])) {
            break;
        }
        lastNumber = currentValue[i] + lastNumber;
    }
    
    if (lastNumber) {
        // Remove the last number from the expression
        let expressionWithoutLast = currentValue.slice(0, -lastNumber.length);
        // Toggle the sign of the last number
        let toggledNumber = lastNumber.startsWith('-') ? lastNumber.substring(1) : '-' + lastNumber;
        // Rebuild the expression
        expressionDisplay.value = expressionWithoutLast + toggledNumber;
    }
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '(' || key === ')') {
        appendToDisplay(key);
        event.preventDefault();
    } else if (key === '^') {
        appendToDisplay('^');
        event.preventDefault();
    } else if (key === '%') {
        appendToDisplay('%');
        event.preventDefault();
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Escape') {
        clearDisplay();
        event.preventDefault();
    } else if (key === 'Backspace') {
        deleteLast();
        event.preventDefault();
    }
});

// Add click event to the result display to copy the result
resultDisplay.addEventListener('click', function() {
    if (resultDisplay.value && resultDisplay.value !== 'Error') {
        navigator.clipboard.writeText(resultDisplay.value).then(function() {
            // Optional: Show a confirmation message
            console.log("Copied to clipboard: " + resultDisplay.value);
        });
    }
});