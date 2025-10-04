def add(a, b):
    """Addition function."""
    return a + b

def subtract(a, b):
    """Subtraction function."""
    return a - b

def multiply(a, b):
    """Multiplication function."""
    return a * b

def divide(a, b):
    """Division function."""
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

def calculate(operation, a, b):
    """Calculate based on operation."""
    if operation == 'add':
        return add(a, b)
    elif operation == 'subtract':
        return subtract(a, b)
    elif operation == 'multiply':
        return multiply(a, b)
    elif operation == 'divide':
        return divide(a, b)