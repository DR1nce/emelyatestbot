// game.js

const gameContainer = document.getElementById('game');
const restartButton = document.getElementById('restart');
const rows = 3;
const cols = 3;
const minesCount = 5;
let cells = [];
let mines = new Set();
let prize = -1;
let gameActive = true;

function createBoard() {
    gameContainer.innerHTML = '';
    cells = [];
    mines.clear();
    prize = -1;
    gameActive = true;

    // Генерация мин
    while (mines.size < minesCount) {
        let randomIndex = Math.floor(Math.random() * (rows * cols));
        mines.add(randomIndex);
    }

    // Генерация приза
    do {
        prize = Math.floor(Math.random() * (rows * cols));
    } while (mines.has(prize));

    // Создание ячеек
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.textContent = '';
            cell.addEventListener('click', handleClick);
            gameContainer.appendChild(cell);
            cells.push(cell);
        }
    }
}

function handleClick(event) {
    if (!gameActive) return;

    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const index = row * cols + col;

    if (mines.has(index)) {
        cell.classList.add('mine');
        revealMines();
        gameActive = false;
        setTimeout(() => {
            sendGameOverData(false);
            resetGame();
        }, 5000); // 5 секунд cooldown
    } else if (index === prize) {
        cell.classList.add('prize');
        gameActive = false;
        sendGameOverData(true);
        alert('Вы нашли приз! Получите 300 $Emelya');
        setTimeout(() => {
            resetGame();
        }, 0); // Нет cooldown после выигрыша
    } else {
        cell.classList.add('clicked');
    }

    cell.removeEventListener('click', handleClick);
}

function revealMines() {
    cells.forEach((cell, index) => {
        if (mines.has(index)) {
            cell.classList.add('mine');
        }
        cell.removeEventListener('click', handleClick);
    });
}

function resetGame() {
    cells.forEach(cell => {
        cell.classList.remove('mine', 'prize', 'clicked');
        cell.addEventListener('click', handleClick);
    });
    createBoard();
}

function sendGameOverData(won) {
    const xhr = new XMLHttpRequest();
    const url = `http://localhost:8000/game_over?userId=${userId}&won=${won}`;
    xhr.open('GET', url);
    xhr.send();
}

restartButton.addEventListener('click', resetGame);
createBoard();
