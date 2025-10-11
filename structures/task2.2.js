const originalArray = [9, 8, 7, 6, 5, 4, 3, 2, 1];

// Способ 1 копирования - spread оператор
const copy1 = [...originalArray];
// Способ 1 обращения порядка - reverse()
copy1.reverse();

// Способ 2 копирования - Array.from()
const copy2 = Array.from(originalArray);
// Способ 2 обращения порядка - цикл for
for (let i = 0; i < Math.floor(copy2.length / 2); i++) {
    const temp = copy2[i];
    copy2[i] = copy2[copy2.length - 1 - i];
    copy2[copy2.length - 1 - i] = temp;
}


console.log("Исходный массив:", originalArray);
console.log("Копия 1 (spread + reverse):", copy1);
console.log("Копия 2 (Array.from + цикл):", copy2);