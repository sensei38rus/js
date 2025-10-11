
function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
   
    for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) {
            return false;
        }
    }
    return true;
}
const num = parseInt(prompt('Задача2. Введите натуральное число'))
alert(isPrime(num))