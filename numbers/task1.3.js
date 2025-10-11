function sieveOfEratosthenes(n) {
    if (n < 2) {
        console.log("Нет простых чисел для n < 2");
        return;
    }
    
    const isPrime = new Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;
    
    console.log("Поиск простых чисел от 1 до " + n);

    
    for (let i = 2; i <= n; i++) {
        if (isPrime[i]) {
           
            console.log("Найдено простое число: " + i);
            
            // Вычеркивание кратных чисел
            for (let j = i * i; j <= n; j += i) {
                if (isPrime[j]) {
                    isPrime[j] = false;
                    console.log("  Вычеркиваем составное число: " + j);
                }
            }
            
        }
    }
    

    
    console.log("Все простые числа от 1 до " + n + ":");
    for (let i = 2; i <= n; i++) {
        if (isPrime[i]) {
            console.log(i);
        }
    }
}

const n = parseInt(prompt("Задача3. Введите N:"));
sieveOfEratosthenes(n);
        