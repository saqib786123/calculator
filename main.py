from calculator import calculate

def main():
    print("Calculator")
    print("----------")
    print("Addition: 5 + 3 =", calculate('add', 5, 3))
    print("Subtraction: 10 - 4 =", calculate('subtract', 10, 4))
    print("Multiplication: 6 * 7 =", calculate('multiply', 6, 7))
    print("Division: 15 / 3 =", calculate('divide', 15, 3))

if __name__ == "__main__":
    main()