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

// Calculator state
let expressionDisplay = document.getElementById('expression');
let resultDisplay = document.getElementById('result');
let memory = 0;
let calculationHistory = [];

// Theme toggle
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    themeBtn.textContent = body.classList.contains('dark-theme') ? '☀️' : '🌙';
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding tab content
        const tabId = button.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// Calculator functions
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

function backspace() {
    deleteLast();
}

function calculateResult() {
    try {
        let expression = expressionDisplay.value;
        
        if (!expression) {
            resultDisplay.value = '0';
            return;
        }

        // Handle power operations (replace ^ with **)
        expression = expression.replace(/\^/g, '**');

        // Handle factorial operations
        expression = expression.replace(/(\d+)!/g, function(match, num) {
            const n = parseInt(num);
            if (n >= 0 && n <= 170) {
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
                resultDisplay.value = parseFloat(result.toFixed(10)).toString();
            }
        }
        
        // Add to history
        calculationHistory.push({
            expression: expressionDisplay.value,
            result: resultDisplay.value
        });
        
        // Update history display
        updateHistoryDisplay();
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

// Memory functions
function memoryAdd() {
    let currentValue = parseFloat(resultDisplay.value) || 0;
    memory += currentValue;
}

function memoryRecall() {
    expressionDisplay.value += memory.toString();
}

function memoryClear() {
    memory = 0;
}

// History functions
function showHistory() {
    const historyPanel = document.getElementById('history-panel');
    historyPanel.style.display = historyPanel.style.display === 'none' ? 'block' : 'none';
}

function clearHistory() {
    calculationHistory = [];
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    calculationHistory.slice().reverse().forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = `${item.expression} = ${item.result}`;
        historyList.appendChild(historyItem);
    });
}

// Graphing functions
function plotGraph() {
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');
    const functionInput = document.getElementById('function-input').value;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    // Plot function
    if (functionInput) {
        try {
            // Create a function from the input
            let fn = new Function('x', 'return ' + functionInput);
            
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            let firstPoint = true;
            
            // Scale and translate for better viewing
            const scale = 20; // 20 pixels per unit
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            for (let x = -15; x <= 15; x += 0.1) {
                try {
                    let y = fn(x);
                    
                    // Skip if result is not a number
                    if (isNaN(y) || !isFinite(y)) continue;
                    
                    // Scale and flip y (canvas y increases downward)
                    let px = centerX + x * scale;
                    let py = centerY - y * scale;
                    
                    if (firstPoint) {
                        ctx.moveTo(px, py);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(px, py);
                    }
                } catch (e) {
                    // Skip points that cause errors
                    firstPoint = true;
                }
            }
            
            ctx.stroke();
        } catch (error) {
            alert('Error in function expression: ' + error.message);
        }
    }
}

// Unit converter functions
const conversionFactors = {
    length: {
        'm': 1,
        'km': 0.001,
        'cm': 100,
        'mm': 1000,
        'in': 39.3701,
        'ft': 3.28084,
        'yd': 1.09361,
        'mi': 0.000621371
    },
    weight: {
        'g': 1,
        'kg': 0.001,
        'mg': 1000,
        'lb': 0.00220462,
        'oz': 0.035274,
        'ton': 0.000001
    },
    temperature: {
        'C': 'Celsius',
        'F': 'Fahrenheit',
        'K': 'Kelvin'
    }
};

function updateUnitSelectors() {
    const conversionType = document.getElementById('conversion-type').value;
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    
    // Clear existing options
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';
    
    if (conversionType === 'temperature') {
        // Special handling for temperature
        ['C', 'F', 'K'].forEach(unit => {
            const option1 = document.createElement('option');
            option1.value = unit;
            option1.textContent = getTempUnitName(unit);
            fromUnitSelect.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = unit;
            option2.textContent = getTempUnitName(unit);
            toUnitSelect.appendChild(option2);
        });
    } else {
        // Handle other conversion types
        Object.keys(conversionFactors[conversionType]).forEach(unit => {
            const option1 = document.createElement('option');
            option1.value = unit;
            option1.textContent = unit.toUpperCase();
            fromUnitSelect.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = unit;
            option2.textContent = unit.toUpperCase();
            toUnitSelect.appendChild(option2);
        });
    }
}

function getTempUnitName(unit) {
    switch(unit) {
        case 'C': return 'Celsius';
        case 'F': return 'Fahrenheit';
        case 'K': return 'Kelvin';
        default: return unit;
    }
}

function convertTemperature(value, fromUnit, toUnit) {
    let celsius;
    
    // Convert to Celsius first
    if (fromUnit === 'C') {
        celsius = value;
    } else if (fromUnit === 'F') {
        celsius = (value - 32) * 5/9;
    } else if (fromUnit === 'K') {
        celsius = value - 273.15;
    }
    
    // Convert from Celsius to target unit
    if (toUnit === 'C') {
        return celsius;
    } else if (toUnit === 'F') {
        return (celsius * 9/5) + 32;
    } else if (toUnit === 'K') {
        return celsius + 273.15;
    }
    
    return celsius;
}

function convertUnits() {
    const conversionType = document.getElementById('conversion-type').value;
    const fromValue = parseFloat(document.getElementById('from-value').value);
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    const toValueElement = document.getElementById('to-value');
    
    if (isNaN(fromValue)) {
        toValueElement.value = 'Invalid input';
        return;
    }
    
    let result;
    
    if (conversionType === 'temperature') {
        result = convertTemperature(fromValue, fromUnit, toUnit);
    } else {
        // Convert to base unit first
        const baseValue = fromValue / conversionFactors[conversionType][fromUnit];
        // Convert from base unit to target unit
        result = baseValue * conversionFactors[conversionType][toUnit];
    }
    
    toValueElement.value = result.toFixed(6);
}

function swapUnits() {
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    const fromValue = document.getElementById('from-value').value;
    const toValue = document.getElementById('to-value').value;
    
    // Swap selected units
    const tempUnit = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = tempUnit;
    
    // Swap values
    document.getElementById('from-value').value = toValue;
    document.getElementById('to-value').value = fromValue;
}

// Initialize unit selectors
document.getElementById('conversion-type').addEventListener('change', updateUnitSelectors);
updateUnitSelectors();

// Add keyboard support
document.addEventListener('keydown', function(event) {
    const activeTab = document.querySelector('.tab-content.active').id;
    
    if (activeTab === 'calculator-tab') {
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
    }
});

// Plot graph when input changes
document.getElementById('function-input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        plotGraph();
    }
});

// Initialize
updateHistoryDisplay();