function areCoprime(a, b) {
    // Функция для нахождения НОД (наибольшего общего делителя)
    function gcd(x, y) {
        while (y !== 0) {
            let temp = y;
            y = x % y;
            x = temp;
        }
        return x;
    }
    
    // Проверяем, что числа натуральные
    if (!Number.isInteger(a) || !Number.isInteger(b) || a <= 0 || b <= 0) {
        throw new Error('Оба числа должны быть натуральными (целыми положительными)');
    }
    
    // Числа взаимно просты, если их НОД равен 1
    return gcd(a, b) === 1;
}

const num1 = parseInt(prompt('Задача1. Введите первое натуральное число:'));
const num2 = parseInt(prompt('Задача1. Введите второе натуральное число:'));
alert(areCoprime(num1,num2))

