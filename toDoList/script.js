// DOM элементы
const tasksList = document.getElementById('tasksList');
const taskCard = document.getElementById('taskCard');
const createTaskBtn = document.getElementById('createTaskBtn');
const closeCardBtn = document.getElementById('closeCardBtn');
const cancelBtn = document.getElementById('cancelBtn');
const taskForm = document.getElementById('taskForm');
const cardTitle = document.getElementById('cardTitle');

// Элементы формы
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const taskPriorityInput = document.getElementById('taskPriority');
const taskDateInput = document.getElementById('taskDate');

// Переменные для управления состоянием
let tasks = [];
let currentTaskId = null;
let isEditing = false;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка задач из localStorage
    loadTasksFromStorage();
    renderTasks();
    
    // Обработчики событий
    createTaskBtn.addEventListener('click', openCreateTaskCard);
    closeCardBtn.addEventListener('click', closeTaskCard);
    cancelBtn.addEventListener('click', closeTaskCard);
    
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveTask();
    });
});

// Функции для работы с задачами
function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        // Начальные данные для демонстрации
        tasks = [
            {
                id: 1,
                title: "Завершить проект",
                description: "Доработать функционал и написать документацию",
                priority: "high",
                date: getFormattedDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)), // +5 дней
                completed: false,
                createdAt: new Date()
            },
            {
                id: 2,
                title: "Подготовить презентацию",
                description: "Создать слайды для выступления на конференции",
                priority: "medium",
                date: getFormattedDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)), // +3 дня
                completed: true,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // -2 дня
            },
            {
                id: 3,
                title: "Купить продукты",
                description: "Молоко, хлеб, яйца, фрукты",
                priority: "low",
                date: getFormattedDate(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)), // +1 день
                completed: false,
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // -1 день
            },
            {
                id: 4,
                title: "Записаться к врачу",
                description: "Профилактический осмотр у терапевта",
                priority: "medium",
                date: getFormattedDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // +7 дней
                completed: false,
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // -3 дня
            }
        ];
        saveTasksToStorage();
    }
}

// Вспомогательная функция для форматирования даты в YYYY-MM-DD
function getFormattedDate(date) {
    return date.toISOString().split('T')[0];
}

function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <h3>Нет задач</h3>
                <p>Нажмите "Создать", чтобы добавить первую задачу</p>
            </div>
        `;
        return;
    }
    
    tasksList.innerHTML = '';
    
    // Сортируем задачи: сначала невыполненные, затем выполненные
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    sortedTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksList.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    
    // Форматирование даты
    const formattedDate = task.date ? formatDisplayDate(task.date) : 'Нет срока';
    
    // Определение класса приоритета
    let priorityClass = '';
    let priorityText = '';
    
    switch(task.priority) {
        case 'low':
            priorityClass = 'priority-low';
            priorityText = 'Низкий';
            break;
        case 'medium':
            priorityClass = 'priority-medium';
            priorityText = 'Средний';
            break;
        case 'high':
            priorityClass = 'priority-high';
            priorityText = 'Высокий';
            break;
    }
    
    li.innerHTML = `
        <div class="task-info">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <div class="task-description">${escapeHtml(task.description)}</div>
            <div class="task-date">
                <i class="far fa-calendar-alt"></i>
                ${formattedDate}
            </div>
            <div class="task-priority ${priorityClass}">${priorityText}</div>
        </div>
        <div class="task-actions">
            <button class="btn-edit" title="Редактировать">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-complete" title="${task.completed ? 'Вернуть в работу' : 'Выполнить'}">
                <i class="fas ${task.completed ? 'fa-redo' : 'fa-check'}"></i>
            </button>
            <button class="btn-delete" title="Удалить">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Обработчики событий для кнопок
    const editBtn = li.querySelector('.btn-edit');
    const completeBtn = li.querySelector('.btn-complete');
    const deleteBtn = li.querySelector('.btn-delete');
    
    editBtn.addEventListener('click', () => openEditTaskCard(task.id));
    completeBtn.addEventListener('click', () => toggleTaskCompletion(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    return li;
}

// Функция для экранирования HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Функция для форматирования даты для отображения
function formatDisplayDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function openCreateTaskCard() {
    isEditing = false;
    currentTaskId = null;
    cardTitle.textContent = 'Новая задача';
    
    // Очистка формы
    taskForm.reset();
    // Устанавливаем минимальную дату на сегодня
    const today = getFormattedDate(new Date());
    taskDateInput.min = today;
    taskDateInput.value = '';
    
    // Показать карточку
    taskCard.classList.add('active');
}

function openEditTaskCard(taskId) {
    isEditing = true;
    currentTaskId = taskId;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    cardTitle.textContent = 'Редактирование задачи';
    
    // Заполнение формы данными задачи
    taskTitleInput.value = task.title;
    taskDescriptionInput.value = task.description;
    taskPriorityInput.value = task.priority;
    taskDateInput.value = task.date || '';
    
    // Показать карточку
    taskCard.classList.add('active');
}

function closeTaskCard() {
    taskCard.classList.remove('active');
    currentTaskId = null;
    isEditing = false;
}

function saveTask() {
    const title = taskTitleInput.value.trim();
    if (!title) {
        alert('Пожалуйста, введите название задачи');
        return;
    }
    
    const description = taskDescriptionInput.value.trim();
    const priority = taskPriorityInput.value;
    const date = taskDateInput.value;
    
    if (isEditing && currentTaskId) {
        // Редактирование существующей задачи
        const taskIndex = tasks.findIndex(t => t.id === currentTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                title,
                description,
                priority,
                date
            };
        }
    } else {
        // Создание новой задачи
        const newTask = {
            id: Date.now(), // Простой способ генерации ID
            title,
            description,
            priority,
            date,
            completed: false,
            createdAt: new Date()
        };
        
        tasks.unshift(newTask);
    }
    
    // Сохранение и обновление
    saveTasksToStorage();
    renderTasks();
    closeTaskCard();
    
    // Показываем уведомление
    showNotification(isEditing ? 'Задача обновлена' : 'Задача создана');
}

function toggleTaskCompletion(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasksToStorage();
        renderTasks();
        
        showNotification(tasks[taskIndex].completed ? 'Задача выполнена' : 'Задача возвращена в работу');
    }
}

function deleteTask(taskId) {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasksToStorage();
        renderTasks();
        
        // Закрываем карточку, если редактировали удаляемую задачу
        if (currentTaskId === taskId) {
            closeTaskCard();
        }
        
        showNotification('Задача удалена');
    }
}

function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4a6cf7;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    // Добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
            if (style.parentNode) {
                document.head.removeChild(style);
            }
        }, 300);
    }, 3000);
}