const daysOfWeek = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг', 
    5: 'Пятница',
    6: 'Суббота',
    7: 'Воскресенье',
    
    showCurrentDay: function() {
        const today = new Date();
        const dayNumber = today.getDay() === 0 ? 7 : today.getDay();
        const dayName = this[dayNumber];
        
        console.log(`Сегодня: ${dayName} (${today.toLocaleDateString()})`);
        return dayName;
    }
};

daysOfWeek.showCurrentDay();