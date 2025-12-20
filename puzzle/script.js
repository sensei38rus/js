// Константы игры
const PUZZLE_WIDTH = 450;
const PUZZLE_HEIGHT = 300;
const TILE_SIZE = 50;
const GRID_COLS = 9;
const GRID_ROWS = 6;
const TOTAL_TILES = GRID_COLS * GRID_ROWS;

// Элементы DOM
const gameBoard = document.getElementById('gameBoard');
const tilesContainer = document.getElementById('tilesContainer');
const movesElement = document.getElementById('moves');
const timeElement = document.getElementById('time');
const placedElement = document.getElementById('placed');
const hintBtn = document.getElementById('hintBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const resetBtn = document.getElementById('resetBtn');
const solveBtn = document.getElementById('solveBtn');
const imageOptions = document.getElementById('imageOptions');
const winMessage = document.getElementById('winMessage');
const finalMovesElement = document.getElementById('finalMoves');
const finalTimeElement = document.getElementById('finalTime');
const playAgainBtn = document.getElementById('playAgainBtn');

// Состояние игры
let gameState = {
    moves: 0,
    time: 0,
    timer: null,
    placedTiles: 0,
    currentImage: 'dog.jpg',
    tiles: [],
    board: Array(GRID_ROWS).fill().map(() => Array(GRID_COLS).fill(null)),
    isCompleted: false,
    draggedTile: null,
    draggedTileOrigin: null
};

// Изображения для пазлов
const images = [
    { id: 'dog.jpg', name: 'dog', url: 'dog.jpg' },

];

// Инициализация игры
function initGame() {
    createImageSelector();
    createGameBoard();
    loadPuzzle(gameState.currentImage);
    startTimer();
    
    // Добавляем обработчики событий
    hintBtn.addEventListener('click', showHint);
    shuffleBtn.addEventListener('click', shuffleTiles);
    resetBtn.addEventListener('click', resetGame);
    solveBtn.addEventListener('click', solvePuzzle);
    playAgainBtn.addEventListener('click', playAgain);
    
    // Обработчики событий перетаскивания
    setupDragAndDrop();
}

// Создание выбора изображений
function createImageSelector() {
    images.forEach(image => {
        const option = document.createElement('div');
        option.className = 'image-option';
        if (image.id === gameState.currentImage) option.classList.add('active');
        
        option.innerHTML = `<img src="${image.url}" alt="${image.name}" data-id="${image.id}">`;
        
        option.addEventListener('click', () => {
            document.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            gameState.currentImage = image.id;
            loadPuzzle(image.id);
        });
        
        imageOptions.appendChild(option);
    });
}

// Создание игрового поля
function createGameBoard() {
    gameBoard.innerHTML = '';
    
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const placeholder = document.createElement('div');
            placeholder.className = 'tile placeholder';
            placeholder.dataset.row = row;
            placeholder.dataset.col = col;
            
            // Добавляем обработчики событий для клеток на игровом поле
            placeholder.addEventListener('dragover', handleDragOver);
            placeholder.addEventListener('drop', handleDrop);
            placeholder.addEventListener('dragenter', handleDragEnter);
            placeholder.addEventListener('dragleave', handleDragLeave);
            
            gameBoard.appendChild(placeholder);
        }
    }
}

// Загрузка пазла
function loadPuzzle(imageId) {
    // Сброс состояния игры
    resetGameState();
    
    // Находим выбранное изображение
    const selectedImage = images.find(img => img.id === imageId);
    
    // Создаем фрагменты пазла
    createTiles(selectedImage.url);
    
    // Обновляем статистику
    updateStats();
}

// Сброс состояния игры
function resetGameState() {
    // Останавливаем таймер
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    
    // Сбрасываем состояние
    gameState.moves = 0;
    gameState.time = 0;
    gameState.placedTiles = 0;
    gameState.tiles = [];
    gameState.board = Array(GRID_ROWS).fill().map(() => Array(GRID_COLS).fill(null));
    gameState.isCompleted = false;
    gameState.draggedTile = null;
    gameState.draggedTileOrigin = null;
    
    // Очищаем контейнеры
    tilesContainer.innerHTML = '';
    createGameBoard();
    
    // Скрываем сообщение о победе
    winMessage.classList.remove('show');
    
    // Запускаем таймер
    startTimer();
}

// Создание фрагментов пазла
function createTiles(imageUrl) {
    tilesContainer.innerHTML = '';
    gameState.tiles = [];
    
    // Создаем временное изображение для вычисления позиций
    const tempImg = new Image();
    tempImg.src = imageUrl;
    tempImg.onload = function() {
        for (let row = 0; row < GRID_ROWS; row++) {
            for (let col = 0; col < GRID_COLS; col++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.row = row;
                tile.dataset.col = col;
                tile.draggable = true;
                
                // Устанавливаем фоновое изображение с правильным смещением
                const bgX = -col * TILE_SIZE;
                const bgY = -row * TILE_SIZE;
                tile.style.backgroundImage = `url(${imageUrl})`;
                tile.style.backgroundPosition = `${bgX}px ${bgY}px`;
                
                // Добавляем данные о положении
                tile.dataset.correctRow = row;
                tile.dataset.correctCol = col;
                tile.dataset.id = `${row}-${col}`;
                
                // Добавляем в контейнер и состояние игры
                tilesContainer.appendChild(tile);
                gameState.tiles.push({
                    element: tile,
                    row: row,
                    col: col,
                    correctRow: row,
                    correctCol: col,
                    id: `${row}-${col}`
                });
            }
        }
        
        // Перемешиваем фрагменты
        shuffleTiles();
    };
}

// Перемешивание фрагментов
function shuffleTiles() {
    const tiles = Array.from(tilesContainer.children);
    
    // Перемешиваем массив
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        tilesContainer.appendChild(tiles[j]);
    }
    
    // Сбрасываем положение на доске
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            gameState.board[row][col] = null;
        }
    }
    
    // Обновляем статистику
    gameState.placedTiles = 0;
    updateStats();
}

// Настройка перетаскивания
function setupDragAndDrop() {
    // Обработчики для фрагментов (мышь)
    tilesContainer.addEventListener('dragstart', handleDragStart);
    tilesContainer.addEventListener('dragend', handleDragEnd);
    
    // Обработчики для фрагментов (касание)
    tilesContainer.addEventListener('touchstart', handleTouchStart);
    tilesContainer.addEventListener('touchend', handleTouchEnd);
    
    // Обработчики для игрового поля
    gameBoard.addEventListener('dragover', handleDragOver);
    gameBoard.addEventListener('drop', handleDrop);
    
    // Предотвращаем стандартное поведение браузера
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('drop', function(e) {
        e.preventDefault();
    });
}

// Начало перетаскивания (мышь)
function handleDragStart(e) {
    if (e.target.classList.contains('tile') && !e.target.classList.contains('placeholder')) {
        gameState.draggedTile = e.target;
        gameState.draggedTileOrigin = 'tilesContainer';
        
        e.target.classList.add('dragging');
        
        // Устанавливаем данные для переноса
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
        e.dataTransfer.effectAllowed = 'move';
        
        // Делаем элемент полупрозрачным при перетаскивании
        setTimeout(() => {
            e.target.style.opacity = '0.4';
        }, 0);
    }
}

// Конец перетаскивания (мышь)
function handleDragEnd(e) {
    if (e.target.classList.contains('tile') && !e.target.classList.contains('placeholder')) {
        e.target.classList.remove('dragging');
        e.target.style.opacity = '1';
        gameState.draggedTile = null;
        gameState.draggedTileOrigin = null;
    }
}

// Начало перетаскивания (касание)
function handleTouchStart(e) {
    if (e.target.classList.contains('tile') && !e.target.classList.contains('placeholder')) {
        gameState.draggedTile = e.target;
        gameState.draggedTileOrigin = 'tilesContainer';
        
        e.target.classList.add('dragging');
        e.target.style.opacity = '0.7';
        e.target.style.position = 'fixed';
        e.target.style.zIndex = '1000';
        
        // Позиционируем элемент под пальцем
        const touch = e.touches[0];
        e.target.style.left = (touch.clientX - TILE_SIZE/2) + 'px';
        e.target.style.top = (touch.clientY - TILE_SIZE/2) + 'px';
        
        e.preventDefault();
    }
}

// Конец перетаскивания (касание)
function handleTouchEnd(e) {
    if (gameState.draggedTile) {
        const touch = e.changedTouches[0];
        
        // Находим элемент под точкой касания
        const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
        const targetCell = elements.find(el => el.classList.contains('tile') && el.classList.contains('placeholder'));
        
        if (targetCell) {
            const row = parseInt(targetCell.dataset.row);
            const col = parseInt(targetCell.dataset.col);
            
            // Размещаем фрагмент на поле
            placeTileOnBoard(gameState.draggedTile, row, col);
        }
        
        // Сбрасываем состояние
        resetTileState(gameState.draggedTile);
        gameState.draggedTile = null;
        gameState.draggedTileOrigin = null;
    }
}

// Обработка перетаскивания над элементом
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

// Обработка входа в элемент при перетаскивании
function handleDragEnter(e) {
    if (e.target.classList.contains('tile') && e.target.classList.contains('placeholder')) {
        e.target.style.backgroundColor = '#e8f4fc';
        e.target.style.borderColor = '#3498db';
    }
}

// Обработка выхода из элемента при перетаскивании
function handleDragLeave(e) {
    if (e.target.classList.contains('tile') && e.target.classList.contains('placeholder')) {
        e.target.style.backgroundColor = '';
        e.target.style.borderColor = '';
    }
}

// Обработка "дропа" на игровом поле
function handleDrop(e) {
    e.preventDefault();
    
    if (e.target.classList.contains('tile') && e.target.classList.contains('placeholder')) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        // Получаем перетаскиваемый элемент
        const tileId = e.dataTransfer.getData('text/plain');
        const draggedTile = document.querySelector(`.tile[data-id="${tileId}"]:not(.placeholder)`);
        
        if (draggedTile) {
            // Размещаем фрагмент на поле
            placeTileOnBoard(draggedTile, row, col);
        }
        
        // Сбрасываем стили
        e.target.style.backgroundColor = '';
        e.target.style.borderColor = '';
    }
}

// Размещение фрагмента на игровом поле
function placeTileOnBoard(tile, row, col) {
    // Проверяем, не занята ли клетка
    if (gameState.board[row][col]) {
        return; // Клетка уже занята
    }
    
    // Создаем копию фрагмента для игрового поля
    const tileCopy = tile.cloneNode(true);
    tileCopy.classList.remove('dragging');
    tileCopy.style.opacity = '1';
    tileCopy.style.position = 'static';
    tileCopy.style.left = '';
    tileCopy.style.top = '';
    tileCopy.style.zIndex = '';
    tileCopy.draggable = false;
    
    // Удаляем оригинальный фрагмент из контейнера
    tile.remove();
    
    // Находим плейсхолдер на игровом поле
    const placeholder = document.querySelector(`.tile.placeholder[data-row="${row}"][data-col="${col}"]`);
    
    if (placeholder) {
        // Заменяем плейсхолдер фрагментом
        placeholder.parentNode.replaceChild(tileCopy, placeholder);
        
        // Обновляем состояние доски
        gameState.board[row][col] = {
            element: tileCopy,
            correctRow: parseInt(tile.dataset.correctRow),
            correctCol: parseInt(tile.dataset.correctCol),
            id: tile.dataset.id
        };
        
        // Проверяем, правильно ли размещен фрагмент
        const isCorrect = (parseInt(tile.dataset.correctRow) === row && 
                          parseInt(tile.dataset.correctCol) === col);
        
        if (isCorrect) {
            tileCopy.classList.add('correct');
            gameState.placedTiles++;
        }
        
        // Увеличиваем счетчик ходов
        gameState.moves++;
        updateStats();
        
        // Проверяем, собран ли пазл
        checkCompletion();
    }
}

// Сброс состояния фрагмента
function resetTileState(tile) {
    if (tile) {
        tile.classList.remove('dragging');
        tile.style.opacity = '1';
        tile.style.position = 'static';
        tile.style.left = '';
        tile.style.top = '';
        tile.style.zIndex = '';
    }
}

// Показ подсказки
function showHint() {
    // Временно показываем правильное расположение
    const placeholders = document.querySelectorAll('.tile.placeholder');
    
    placeholders.forEach(placeholder => {
        const row = parseInt(placeholder.dataset.row);
        const col = parseInt(placeholder.dataset.col);
        
        // Создаем временную подсказку
        const hint = document.createElement('div');
        hint.className = 'tile hint';
        
        // Используем фоновое изображение из любого существующего фрагмента
        const sampleTile = document.querySelector('.tile:not(.placeholder)');
        if (sampleTile) {
            hint.style.backgroundImage = sampleTile.style.backgroundImage;
            hint.style.backgroundPosition = `${-col * TILE_SIZE}px ${-row * TILE_SIZE}px`;
        }
        
        hint.style.opacity = '0.5';
        hint.style.position = 'absolute';
        hint.style.width = '100%';
        hint.style.height = '100%';
        hint.style.top = '0';
        hint.style.left = '0';
        hint.style.pointerEvents = 'none';
        hint.style.borderRadius = '4px';
        
        placeholder.style.position = 'relative';
        placeholder.appendChild(hint);
    });
    
    // Убираем подсказку через 2 секунды
    setTimeout(() => {
        const hints = document.querySelectorAll('.tile.hint');
        hints.forEach(hint => {
            const parent = hint.parentElement;
            if (parent) {
                parent.style.position = '';
                hint.remove();
            }
        });
    }, 2000);
}

// Сброс игры
function resetGame() {
    resetGameState();
    loadPuzzle(gameState.currentImage);
}

// Решение пазла
function solvePuzzle() {
    // Останавливаем таймер
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    
    // Очищаем игровое поле
    createGameBoard();
    
    // Очищаем контейнер с фрагментами
    tilesContainer.innerHTML = '';
    
    // Размещаем все фрагменты в правильных позициях
    gameState.tiles.forEach(tileInfo => {
        const tile = document.createElement('div');
        tile.className = 'tile correct';
        tile.dataset.row = tileInfo.correctRow;
        tile.dataset.col = tileInfo.correctCol;
        tile.dataset.correctRow = tileInfo.correctRow;
        tile.dataset.correctCol = tileInfo.correctCol;
        tile.dataset.id = tileInfo.id;
        
        // Устанавливаем фоновое изображение
        const bgX = -tileInfo.correctCol * TILE_SIZE;
        const bgY = -tileInfo.correctRow * TILE_SIZE;
        tile.style.backgroundImage = tileInfo.element.style.backgroundImage;
        tile.style.backgroundPosition = `${bgX}px ${bgY}px`;
        tile.draggable = false;
        
        const row = tileInfo.correctRow;
        const col = tileInfo.correctCol;
        
        // Находим плейсхолдер и заменяем его
        const placeholder = document.querySelector(`.tile.placeholder[data-row="${row}"][data-col="${col}"]`);
        if (placeholder) {
            placeholder.parentNode.replaceChild(tile, placeholder);
        }
        
        // Обновляем состояние доски
        gameState.board[row][col] = {
            element: tile,
            correctRow: row,
            correctCol: col,
            id: tileInfo.id
        };
    });
    
    // Обновляем статистику
    gameState.placedTiles = TOTAL_TILES;
    gameState.moves = TOTAL_TILES; // Каждый фрагмент - это один ход
    updateStats();
    
    // Показываем сообщение о победе
    showWinMessage();
}

// Проверка завершения пазла
function checkCompletion() {
    if (gameState.placedTiles === TOTAL_TILES) {
        // Останавливаем таймер
        if (gameState.timer) {
            clearInterval(gameState.timer);
            gameState.timer = null;
        }
        
        // Показываем сообщение о победе
        showWinMessage();
    }
}

// Показать сообщение о победе
function showWinMessage() {
    finalMovesElement.textContent = gameState.moves;
    finalTimeElement.textContent = formatTime(gameState.time);
    winMessage.classList.add('show');
}

// Играть снова
function playAgain() {
    winMessage.classList.remove('show');
    resetGame();
}

// Запуск таймера
function startTimer() {
    gameState.timer = setInterval(() => {
        gameState.time++;
        updateStats();
    }, 1000);
}

// Обновление статистики
function updateStats() {
    movesElement.textContent = gameState.moves;
    timeElement.textContent = formatTime(gameState.time);
    placedElement.textContent = `${gameState.placedTiles}/${TOTAL_TILES}`;
}

// Форматирование времени
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);