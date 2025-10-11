function isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    
    for (let i = 3; i * i <= num; i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

function getFirstNPrimes(n) {
    let currentNumber = 2;
    
    while (currentNumber < n) {
        if (isPrime(currentNumber)) {
            alert(currentNumber);
        }
        currentNumber++;
    }
    
  
}

// Основная программа
const N = parseInt(prompt("Задача 4. Введите количество простых чисел N:"));
getFirstNPrimes(N);