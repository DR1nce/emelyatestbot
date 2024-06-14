const gameContainer = document.getElementById('game');
const restartButton = document.getElementById('restart');
const botApiUrl = 'https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage';  // замените <YOUR_BOT_TOKEN> на токен вашего бота

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');

const rows = 3;
const cols = 3;
const minesCount = 5;
let cells, mines, prize;

function createBoard() {
    gameContainer.innerHTML = '';
    gameContainer.style.gridTemplateColumns = `repeat(${cols}, 50px)`;
    cells = [];
    mines = generateMines();
    prize = generatePrize();

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleClick);
            gameContainer.appendChild(cell);
            cells.push(cell);
        }
    }
}

function generateMines() {
    const mines = new Set();
    while (mines.size < minesCount) {
        const mine = Math.floor(Math.random() * rows * cols);
        if (!mines.has(mine) && mine !== prize) {
            mines.add(mine);
        }
    }
    return mines;
}

function generatePrize() {
    let prize;
    do {
        prize = Math.floor(Math.random() * rows * cols);
    } while (mines && mines.has(prize));
    return prize;
}

function handleClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const index = row * cols + col;

    if (index === prize) {
        cell.classList.add('prize');
        cell.textContent = '🎁';
        deactivateBoard();
        sendPrizeNotification(userId, 250);
    } else if (mines.has(index)) {
        cell.classList.add('mine');
        deactivateBoard();
    } else {
        cell.classList.add('open');
        cell.textContent = 'Пусто';
    }

    cell.removeEventListener('click', handleClick);
}

function deactivateBoard() {
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

function sendPrizeNotification(userId, points) {
    fetch(botApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: userId,
            text: `/addpoints ${points}`
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

restartButton.addEventListener('click', createBoard);
createBoard();
