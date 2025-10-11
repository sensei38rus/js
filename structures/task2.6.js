const subjects = {

    list: "Математика,Физика,Информатика,История",
    
    
    addSubject: function(newSubject) {
       
        const subjectsArray = this.list.split(',');
        
        
        if (!subjectsArray.includes(newSubject)) {
         
            subjectsArray.push(newSubject);
           
            this.list = subjectsArray.join(',');
            console.log(`Предмет "${newSubject}" добавлен.`);
        } else {
            console.log(`Предмет "${newSubject}" уже есть в списке.`);
        }
    },
    
    removeSubject: function(subjectToRemove) {

        const subjectsArray = this.list.split(',');
        
        const index = subjectsArray.indexOf(subjectToRemove);
        
        if (index !== -1) {
          
            subjectsArray.splice(index, 1);
    
            this.list = subjectsArray.join(',');
            console.log(`Предмет "${subjectToRemove}" удален.`);
        } else {
            console.log(`Предмет "${subjectToRemove}" не найден в списке.`);
        }
    },
    
    
    showSubjects: function() {
        const subjectsArray = this.list.split(',');
        console.log("Текущий список предметов:");
        subjectsArray.forEach((subject, index) => {
            console.log(`${index + 1}. ${subject}`);
        });
        return subjectsArray;
    },
    
    
    getCount: function() {
        return this.list.split(',').length;
    }
};

console.log("Начальное состояние:");
subjects.showSubjects();

console.log("\nДобавляем предметы:");
subjects.addSubject("Химия");
subjects.addSubject("Математика"); 
subjects.addSubject("Биология");

console.log("\nТекущий список:");
subjects.showSubjects();

console.log("\nУдаляем предметы:");
subjects.removeSubject("Физика");
subjects.removeSubject("Литература"); 

console.log("\nФинальный список:");
subjects.showSubjects();
console.log(`Всего предметов: ${subjects.getCount()}`);