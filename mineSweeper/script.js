document.addEventListener('DOMContentLoaded', () => {
    // Константы игры
    const BOARD_SIZE = 12;
    const MINES_COUNT = 20;
    
    // Элементы DOM
    const gameBoard = document.getElementById('game-board');
    const minesCounter = document.getElementById('mines-counter');
    const timerElement = document.getElementById('timer');
    const newGameButton = document.getElementById('new-game');
    const hintButton = document.getElementById('hint');
    const messageElement = document.getElementById('message');
    const eventLogContent = document.getElementById('event-log-content');
    
    // Состояние игры
    let board = [];
    let mines = [];
    let flags = [];
    let openedCells = [];
    let gameOver = false;
    let gameStarted = false;
    let timer = 0;
    let timerInterval = null;
    let currentCell = { row: 0, col: 0 };
    let totalMines = MINES_COUNT;
    
    // Инициализация игры
    function initGame() {
        // Сброс состояния
        board = [];
        mines = [];
        flags = [];
        openedCells = [];
        gameOver = false;
        gameStarted = false;
        timer = 0;
        clearInterval(timerInterval);
        timerInterval = null;
        currentCell = { row: 0, col: 0 };
        
        // Обновление интерфейса
        updateTimer();
        minesCounter.textContent = totalMines;
        messageElement.classList.remove('show');
        
        // Очистка доски
        gameBoard.innerHTML = '';
        
        // Создание доски
        for (let row = 0; row < BOARD_SIZE; row++) {
            board[row] = [];
            for (let col = 0; col < BOARD_SIZE; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Обработчики мыши
                cell.addEventListener('click', (e) => handleLeftClick(row, col, e));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    handleRightClick(row, col);
                });
                
                gameBoard.appendChild(cell);
                board[row][col] = {
                    element: cell,
                    isMine: false,
                    isOpened: false,
                    isFlagged: false,
                    adjacentMines: 0
                };
            }
        }
        
        // Установка текущей клетки для клавиатурного управления
        updateCurrentCell();
        
        // Добавление события в журнал
        addEventToLog('Игра инициализирована. Готов к старту!', 'info');
    }
    
    // Генерация мин после первого хода
    function generateMines(firstRow, firstCol) {
        mines = [];
        
        // Создаем список всех клеток кроме первой
        const cells = [];
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (row !== firstRow || col !== firstCol) {
                    cells.push({ row, col });
                }
            }
        }
        
        // Выбираем случайные клетки для мин
        for (let i = 0; i < totalMines; i++) {
            const randomIndex = Math.floor(Math.random() * cells.length);
            const cell = cells.splice(randomIndex, 1)[0];
            board[cell.row][cell.col].isMine = true;
            mines.push(cell);
        }
        
        // Подсчет мин вокруг каждой клетки
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (!board[row][col].isMine) {
                    board[row][col].adjacentMines = countAdjacentMines(row, col);
                }
            }
        }
        
        // Генерация пользовательского события "mine.start"
        const startEvent = new CustomEvent('mine.start', {
            detail: { 
                timestamp: new Date(),
                firstMove: { row: firstRow, col: firstCol }
            }
        });
        document.dispatchEvent(startEvent);
        
        // Добавление события в журнал
        addEventToLog(`Игра начата! Первый ход: [${firstRow}, ${firstCol}]`, 'info');
        
        // Запуск таймера
        gameStarted = true;
        timerInterval = setInterval(() => {
            timer++;
            updateTimer();
        }, 1000);
    }
    
    // Подсчет мин вокруг клетки
    function countAdjacentMines(row, col) {
        let count = 0;
        for (let r = Math.max(0, row - 1); r <= Math.min(BOARD_SIZE - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(BOARD_SIZE - 1, col + 1); c++) {
                if (r === row && c === col) continue;
                if (board[r][c].isMine) count++;
            }
        }
        return count;
    }
    
    // Обработка левого клика (открытие клетки)
    function handleLeftClick(row, col, event) {
        if (gameOver || board[row][col].isOpened || board[row][col].isFlagged) return;
        
        // Если игра еще не началась, генерируем мины
        if (!gameStarted) {
            generateMines(row, col);
        }
        
        // Генерация пользовательского события "mine.step"
        const stepEvent = new CustomEvent('mine.step', {
            detail: { 
                timestamp: new Date(),
                row, 
                col,
                action: 'open'
            }
        });
        document.dispatchEvent(stepEvent);
        
        // Открытие клетки
        openCell(row, col);
        
        // Проверка на победу
        checkWin();
    }
    
    // Обработка правого клика (флажок)
    function handleRightClick(row, col) {
        if (gameOver || board[row][col].isOpened) return;
        
        const cell = board[row][col];
        
        // Переключение флажка
        if (cell.isFlagged) {
            cell.isFlagged = false;
            cell.element.classList.remove('flagged');
            flags = flags.filter(f => !(f.row === row && f.col === col));
        } else {
            cell.isFlagged = true;
            cell.element.classList.add('flagged');
            flags.push({ row, col });
        }
        
        // Обновление счетчика мин
        updateMinesCounter();
        
        // Генерация пользовательского события "mine.step"
        const stepEvent = new CustomEvent('mine.step', {
            detail: { 
                timestamp: new Date(),
                row, 
                col,
                action: cell.isFlagged ? 'flag' : 'unflag'
            }
        });
        document.dispatchEvent(stepEvent);
        
        // Проверка на победу
        checkWin();
    }
    
    // Открытие клетки
    function openCell(row, col) {
        const cell = board[row][col];
        
        if (cell.isOpened || cell.isFlagged) return;
        
        cell.isOpened = true;
        openedCells.push({ row, col });
        cell.element.classList.add('opened');
        
        // Если это мина - игра окончена
        if (cell.isMine) {
            cell.element.classList.add('mine');
            gameOver = true;
            revealAllMines();
            
            // Генерация пользовательского события "mine.end"
            const endEvent = new CustomEvent('mine.end', {
                detail: { 
                    timestamp: new Date(),
                    result: 'lose',
                    time: timer,
                    openedCells: openedCells.length
                }
            });
            document.dispatchEvent(endEvent);
            
            // Показать сообщение о проигрыше
            showMessage('Игра окончена! Вы наступили на мину!', 'lose');
            addEventToLog('Игра окончена: наступили на мину!', 'lose');
            
            clearInterval(timerInterval);
            return;
        }
        
        // Показать количество мин вокруг
        if (cell.adjacentMines > 0) {
            cell.element.textContent = cell.adjacentMines;
            cell.element.classList.add(`number-${cell.adjacentMines}`);
        } else {
            // Если мин вокруг нет, открываем соседние клетки рекурсивно
            for (let r = Math.max(0, row - 1); r <= Math.min(BOARD_SIZE - 1, row + 1); r++) {
                for (let c = Math.max(0, col - 1); c <= Math.min(BOARD_SIZE - 1, col + 1); c++) {
                    if (r === row && c === col) continue;
                    openCell(r, c);
                }
            }
        }
    }
    
    // Проверка на победу
    function checkWin() {
        // Проверяем, все ли не-мины открыты
        let allNonMinesOpened = true;
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const cell = board[row][col];
                if (!cell.isMine && !cell.isOpened) {
                    allNonMinesOpened = false;
                    break;
                }
            }
            if (!allNonMinesOpened) break;
        }
        
        // Или все мины отмечены флажками
        let allMinesFlagged = mines.length === flags.length;
        if (allMinesFlagged) {
            for (const mine of mines) {
                const isFlagged = flags.some(f => f.row === mine.row && f.col === mine.col);
                if (!isFlagged) {
                    allMinesFlagged = false;
                    break;
                }
            }
        }
        
        if (allNonMinesOpened || allMinesFlagged) {
            gameOver = true;
            clearInterval(timerInterval);
            
            // Генерация пользовательского события "mine.end"
            const endEvent = new CustomEvent('mine.end', {
                detail: { 
                    timestamp: new Date(),
                    result: 'win',
                    time: timer,
                    openedCells: openedCells.length
                }
            });
            document.dispatchEvent(endEvent);
            
            // Показать сообщение о победе
            showMessage('Поздравляем! Вы выиграли!', 'win');
            addEventToLog('Игра окончена: победа!', 'win');
        }
    }
    
    // Показать все мины при проигрыше
    function revealAllMines() {
        for (const mine of mines) {
            const cell = board[mine.row][mine.col];
            if (!cell.isFlagged) {
                cell.element.classList.add('mine');
            }
        }
    }
    
    // Обновление счетчика мин
    function updateMinesCounter() {
        const flaggedCount = flags.length;
        minesCounter.textContent = totalMines - flaggedCount;
    }
    
    // Обновление таймера
    function updateTimer() {
        timerElement.textContent = timer;
    }
    
    // Показать сообщение
    function showMessage(text, type) {
        messageElement.textContent = text;
        messageElement.className = `message show`;
        
        // Автоматически скрыть сообщение через 3 секунды
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 3000);
    }
    
    // Добавление события в журнал
    function addEventToLog(text, type) {
        const eventItem = document.createElement('div');
        eventItem.className = `event-item ${type}`;
        
        const time = new Date().toLocaleTimeString();
        eventItem.textContent = `[${time}] ${text}`;
        
        eventLogContent.prepend(eventItem);
        
        // Ограничить количество событий в журнале
        if (eventLogContent.children.length > 10) {
            eventLogContent.removeChild(eventLogContent.lastChild);
        }
    }
    
    // Управление с клавиатуры
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        
        let newRow = currentCell.row;
        let newCol = currentCell.col;
        
        // Обработка стрелок для перемещения
        switch(e.key) {
            case 'ArrowUp':
                if (newRow > 0) newRow--;
                e.preventDefault();
                break;
            case 'ArrowDown':
                if (newRow < BOARD_SIZE - 1) newRow++;
                e.preventDefault();
                break;
            case 'ArrowLeft':
                if (newCol > 0) newCol--;
                e.preventDefault();
                break;
            case 'ArrowRight':
                if (newCol < BOARD_SIZE - 1) newCol++;
                e.preventDefault();
                break;
            case ' ': // Пробел - открыть клетку
                handleLeftClick(currentCell.row, currentCell.col, e);
                e.preventDefault();
                return;
            case 'd':
            case 'D':
                // Ctrl+D - поставить флажок
                if (e.ctrlKey) {
                    handleRightClick(currentCell.row, currentCell.col);
                    e.preventDefault();
                }
                return;
        }
        
        // Обновить текущую клетку, если она изменилась
        if (newRow !== currentCell.row || newCol !== currentCell.col) {
            currentCell.row = newRow;
            currentCell.col = newCol;
            updateCurrentCell();
        }
    });
    
    // Обновление выделения текущей клетки
    function updateCurrentCell() {
        // Убрать выделение со всех клеток
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('current-cell');
        });
        
        // Выделить текущую клетку
        if (board[currentCell.row] && board[currentCell.row][currentCell.col]) {
            board[currentCell.row][currentCell.col].element.classList.add('current-cell');
        }
    }
    
    // Подсказка - открыть безопасную клетку
    hintButton.addEventListener('click', () => {
        if (gameOver || !gameStarted) return;
        
        // Найти все неоткрытые и не помеченные флажками клетки без мин
        const safeCells = [];
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const cell = board[row][col];
                if (!cell.isOpened && !cell.isFlagged && !cell.isMine) {
                    safeCells.push({ row, col });
                }
            }
        }
        
        if (safeCells.length > 0) {
            // Выбрать случайную безопасную клетку
            const randomIndex = Math.floor(Math.random() * safeCells.length);
            const cell = safeCells[randomIndex];
            
            // Открыть выбранную клетку
            openCell(cell.row, cell.col);
            
            // Проверка на победу
            checkWin();
            
            addEventToLog(`Использована подсказка: открыта безопасная клетка [${cell.row}, ${cell.col}]`, 'info');
        } else {
            showMessage('Нет безопасных клеток для открытия!', 'info');
        }
    });
    
    // Новая игра
    newGameButton.addEventListener('click', initGame);
    
    // Обработчики пользовательских событий
    document.addEventListener('mine.start', (e) => {
        console.log('Событие mine.start:', e.detail);
    });
    
    document.addEventListener('mine.step', (e) => {
        console.log('Событие mine.step:', e.detail);
    });
    
    document.addEventListener('mine.end', (e) => {
        console.log('Событие mine.end:', e.detail);
    });
    
    // Инициализация игры при загрузке
    initGame();
});