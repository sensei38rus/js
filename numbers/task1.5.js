function findDivisorsSimple(N) {  
    for (let i = 1; i <= N; i++) {
        if (N % i === 0) {
            console.log(i)
        }
    }
    
    
}

const NN = parseInt(prompt("задача 5. Введите N"))
findDivisorsSimple(NN)