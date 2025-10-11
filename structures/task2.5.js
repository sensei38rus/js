
const personnel = {
    "Директор": "Иван Петров",
    "Менеджер": "Мария Сидорова", 
    "Разработчик": "Алексей Козлов",
    "Дизайнер": "Елена Волкова",
    "Бухгалтер": "Сергей Николаев"
};


const personnel2 = { ...personnel };


personnel2["Директор"] = "Ольга Семенова";
personnel2["Менеджер"] = "Дмитрий Орлов";
personnel2["Разработчик"] = "Наталья Белова";
personnel2["Бухгалтер"] = "Артем Павлов";


function objectToString(obj, title) {
    let result = `${title}:\n`;
    for (const [position, name] of Object.entries(obj)) {
        result += `  ${position}: ${name}\n`;
    }
    return result;
}

// Выводим оба объекта
console.log(objectToString(personnel, "ПЕРСОНАЛ (оригинал)"));
console.log(objectToString(personnel2, "ПЕРСОНАЛ 2 (копия с изменениями)"));