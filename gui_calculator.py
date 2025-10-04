import tkinter as tk
from calculator import calculate

class CalculatorGUI:
    def __init__(self):
        self.window = tk.Tk()
        self.window.title("Calculator")
        self.window.geometry("300x400")
        
        # Create display
        self.display_var = tk.StringVar()
        self.display_var.set("")
        self.display = tk.Entry(self.window, textvariable=self.display_var, font=("Arial", 16), 
                                justify="right", state="readonly", bg="white")
        self.display.grid(row=0, column=0, columnspan=4, padx=5, pady=5, sticky="ew")
        
        # Button layout
        buttons = [
            ('C', 1, 0), ('/', 1, 1), ('*', 1, 2), ('-', 1, 3),
            ('7', 2, 0), ('8', 2, 1), ('9', 2, 2), ('+', 2, 3),
            ('4', 3, 0), ('5', 3, 1), ('6', 3, 2), ('=', 2, 4, 2),
            ('1', 4, 0), ('2', 4, 1), ('3', 4, 2),
            ('0', 5, 0, 2), ('.', 5, 2), ('=', 5, 3)
        ]
        
        # Create buttons
        for button in buttons:
            if len(button) == 3:  # regular button
                text, row, col = button
                if text == '=':
                    btn = tk.Button(self.window, text=text, command=self.calculate_result)
                elif text == 'C':
                    btn = tk.Button(self.window, text=text, command=self.clear_display, bg="orange", fg="white")
                else:
                    btn = tk.Button(self.window, text=text, command=lambda t=text: self.add_to_display(t))
                btn.grid(row=row, column=col, padx=2, pady=2, sticky="nsew")
            elif len(button) == 4:  # button that spans columns
                text, row, col, colspan = button
                if text == '=':
                    btn = tk.Button(self.window, text=text, command=self.calculate_result)
                elif text == 'C':
                    btn = tk.Button(self.window, text=text, command=self.clear_display, bg="orange", fg="white")
                else:
                    btn = tk.Button(self.window, text=text, command=lambda t=text: self.add_to_display(t))
                btn.grid(row=row, column=col, columnspan=colspan, padx=2, pady=2, sticky="nsew")
        
        # Configure grid weights for responsive design
        for i in range(6):
            self.window.grid_rowconfigure(i, weight=1)
        for i in range(5):
            self.window.grid_columnconfigure(i, weight=1)
        
        # Store the expression for calculation
        self.current_expression = ""
    
    def add_to_display(self, value):
        current = self.display_var.get()
        self.display_var.set(current + value)
        self.current_expression += value
    
    def clear_display(self):
        """Clear the display and reset the expression"""
        self.display_var.set("")
        self.current_expression = ""
    
    def calculate_result(self):
        """Calculate the result of the current expression"""
        try:
            expression = self.display_var.get()
            # For now, we'll use Python's eval for basic calculations
            # In a more advanced version, we could use the calculator module
            result = eval(expression)
            self.display_var.set(str(result))
            self.current_expression = str(result)
        except Exception as e:
            self.display_var.set("Error")
            self.current_expression = ""
    
    def run(self):
        self.window.mainloop()

if __name__ == "__main__":
    calc = CalculatorGUI()
    calc.run()