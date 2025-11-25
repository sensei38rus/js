// Получаем элементы DOM
const nameInput = document.getElementById('name-input');
const positionInput = document.getElementById('position-input');
const phoneInput = document.getElementById('phone-input');
const emailInput = document.getElementById('email-input');
const websiteInput = document.getElementById('website-input');
const addressInput = document.getElementById('address-input');
const companyInput = document.getElementById('company-input');
const logoInput = document.getElementById('logo-input');
const colorOptions = document.querySelectorAll('.color-option');

// Элементы управления цветом текста
const nameColorInput = document.getElementById('name-color');
const positionColorInput = document.getElementById('position-color');
const contactColorInput = document.getElementById('contact-color');
const companyColorInput = document.getElementById('company-color');
const addressColorInput = document.getElementById('address-color');

// Элементы визитки
const personName = document.getElementById('person-name');
const personPosition = document.getElementById('person-position');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const website = document.getElementById('website');
const addressElement = document.getElementById('address');
const companyName = document.getElementById('company-name');
const logo = document.getElementById('logo');

// Обработчики событий для обновления визитки
nameInput.addEventListener('input', () => {
    personName.textContent = nameInput.value;
});

positionInput.addEventListener('input', () => {
    personPosition.textContent = positionInput.value;
});

phoneInput.addEventListener('input', () => {
    phone.textContent = phoneInput.value;
});

emailInput.addEventListener('input', () => {
    email.textContent = emailInput.value;
});

websiteInput.addEventListener('input', () => {
    website.textContent = websiteInput.value;
});

addressInput.addEventListener('input', () => {
    addressElement.textContent = addressInput.value;
});

companyInput.addEventListener('input', () => {
    companyName.textContent = companyInput.value;
});

logoInput.addEventListener('input', () => {
    logo.textContent = logoInput.value;
});

// Обработчики для выбора цвета фона логотипа
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Убираем активный класс у всех опций
        colorOptions.forEach(opt => opt.classList.remove('active'));
        // Добавляем активный класс к выбранной опции
        option.classList.add('active');
        // Применяем цвет к логотипу
        logo.style.backgroundColor = option.getAttribute('data-color');
    });
});

// Обработчики для изменения цвета текста
nameColorInput.addEventListener('input', () => {
    personName.style.color = nameColorInput.value;
});

positionColorInput.addEventListener('input', () => {
    personPosition.style.color = positionColorInput.value;
});

contactColorInput.addEventListener('input', () => {
    phone.style.color = contactColorInput.value;
    email.style.color = contactColorInput.value;
    website.style.color = contactColorInput.value;
});

companyColorInput.addEventListener('input', () => {
    companyName.style.color = companyColorInput.value;
});

addressColorInput.addEventListener('input', () => {
    addressElement.style.color = addressColorInput.value;
});

// Функция для скачивания визитки
document.getElementById('download-btn').addEventListener('click', function() {
    alert('В реальном приложении здесь будет функция для скачивания визитки в формате PNG или PDF');
});