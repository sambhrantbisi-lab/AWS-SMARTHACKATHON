def fibonacci(n):
    """Generate Fibonacci sequence up to n terms."""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib_sequence = [0, 1]
    for i in range(2, n):
        fib_sequence.append(fib_sequence[i-1] + fib_sequence[i-2])
    
    return fib_sequence

def fibonacci_nth(n):
    """Return the nth Fibonacci number (0-indexed)."""
    if n < 0:
        return None
    elif n == 0:
        return 0
    elif n == 1:
        return 1
    
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    
    return b

# Example usage
if __name__ == "__main__":
    # Generate first 10 Fibonacci numbers
    print("First 10 Fibonacci numbers:")
    print(fibonacci(10))
    
    # Get specific Fibonacci numbers
    print(f"\n5th Fibonacci number: {fibonacci_nth(5)}")
    print(f"10th Fibonacci number: {fibonacci_nth(10)}")
    
    # Interactive input
    try:
        n = int(input("\nEnter number of Fibonacci terms to generate: "))
        result = fibonacci(n)
        print(f"Fibonacci sequence ({n} terms): {result}")
    except ValueError:
        print("Please enter a valid integer.")