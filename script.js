const gridContainer = document.getElementById('grid-container');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

let grid = [];
let score = 0;
const size = 4;

// Инициализация пустой сетки
function initGrid() {
  grid = [];
  for(let i=0; i<size; i++){
    grid[i] = [];
    for(let j=0; j<size; j++){
      grid[i][j] = 0;
    }
  }
}

// Добавление случайной плитки 2 или 4
function addRandomTile() {
  let emptyCells = [];
  for(let i=0; i<size; i++){
    for(let j=0; j<size; j++){
      if(grid[i][j] === 0) emptyCells.push({x: i, y: j});
    }
  }
  if(emptyCells.length === 0) return false;
  let randIndex = Math.floor(Math.random() * emptyCells.length);
  let cell = emptyCells[randIndex];
  grid[cell.x][cell.y] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

// Отрисовка сетки и установка обработчиков кликов
function drawGrid() {
  gridContainer.innerHTML = '';
  for(let i=0; i<size; i++){
    for(let j=0; j<size; j++){
      let val = grid[i][j];
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if(val !== 0) cell.classList.add('cell-' + val);
      cell.textContent = val === 0 ? '' : val;
      cell.dataset.x = i;
      cell.dataset.y = j;
      cell.onclick = onCellClick;
      gridContainer.appendChild(cell);
    }
  }
  scoreEl.textContent = score;
}

// Обработка клика по плитке
function onCellClick(e) {
  const x = parseInt(e.target.dataset.x);
  const y = parseInt(e.target.dataset.y);
  if(grid[x][y] === 0) return; // пустая плитка — не двигаем

  // Попытаемся сдвинуть плитку влево, если свободно
  // Если хочешь другой порядок — можно добавить выбор направления
  if(moveTile(x, y, 'left')) {
    addRandomTile();
    drawGrid();
    if(isGameOver()) gameOver();
  }
}

// Логика сдвига плитки в заданном направлении
function moveTile(x, y, direction) {
  let nx = x;
  let ny = y;

  function canMove(nx, ny, dx, dy) {
    let mx = nx + dx;
    let my = ny + dy;
    if(mx < 0 || mx >= size || my < 0 || my >= size) return false;
    // Пустая клетка или с таким же числом для объединения
    return grid[mx][my] === 0 || grid[mx][my] === grid[nx][ny];
  }

  let dx=0, dy=0;
  if(direction === 'left') dy = -1;
  else if(direction === 'right') dy = 1;
  else if(direction === 'up') dx = -1;
  else if(direction === 'down') dx = 1;

  let moved = false;
  while(canMove(nx, ny, dx, dy)) {
    let mx = nx + dx;
    let my = ny + dy;
    if(grid[mx][my] === 0) {
      // Просто сдвигаем
      grid[mx][my] = grid[nx][ny];
      grid[nx][ny] = 0;
      nx = mx;
      ny = my;
      moved = true;
    } else if(grid[mx][my] === grid[nx][ny]) {
      // Объединяем
      grid[mx][my] *= 2;
      score += grid[mx][my];
      grid[nx][ny] = 0;
      moved = true;
      break; // объединение закончено
    } else {
      break;
    }
  }

  return moved;
}

function isGameOver() {
  for(let i=0; i<size; i++){
    for(let j=0; j<size; j++){
      if(grid[i][j] === 0) return false;
      if(j !== size-1 && grid[i][j] === grid[i][j+1]) return false;
      if(i !== size-1 && grid[i][j] === grid[i+1][j]) return false;
    }
  }
  return true;
}

function gameOver() {
  alert('Игра окончена! Ваш счёт: ' + score);
}

function setup() {
  initGrid();
  addRandomTile();
  addRandomTile();
  score = 0;
  drawGrid();
}

restartBtn.addEventListener('click', () => {
  setup();
});

setup();
