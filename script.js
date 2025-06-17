const cylinder = document.getElementById('cylinder');
const scoreDisplay = document.getElementById('score');
const shopBtn = document.getElementById('shop-btn');
const tasksBtn = document.getElementById('tasks-btn');
const shopOverlay = document.getElementById('shop-overlay');
const tasksOverlay = document.getElementById('tasks-overlay');
const shopList = document.getElementById('shop-list');
const tasksList = document.getElementById('tasks-list');
const addTaskForm = document.getElementById('add-task-form');
const taskNameInput = document.getElementById('task-name');
const taskLinkInput = document.getElementById('task-link');

let score = 0;
let activeFace = null;
let autoClick = 0; // автокликер: количество кликов в секунду

// Цилиндр с цифрами
const numbers = [1,2,3,4,5,6,7,8];
const facesCount = numbers.length;
const radius = 80;
const angleStep = 360 / facesCount;

numbers.forEach((num, i) => {
  const face = document.createElement('div');
  face.classList.add('face');
  face.textContent = num;

  const rotateY = i * angleStep;
  face.style.transform = `rotateY(${rotateY}deg) translateZ(${radius}px)`;

  face.addEventListener('click', () => {
    if (activeFace) activeFace.classList.remove('active');
    face.classList.add('active');
    activeFace = face;
    score += num;
    updateScore();
  });

  cylinder.appendChild(face);
});

function updateScore() {
  scoreDisplay.textContent = `Очки: ${score} | Автокликер: ${autoClick} в секунду`;
}

// --- Магазин ---
const shopItems = [
  { id: 1, name: 'Автокликер +1', cost: 50, effect: () => { autoClick += 1; } },
  { id: 2, name: 'Клик x2', cost: 100, effect: () => { multiplyClick = 2; } },
  // добавляй сюда свои улучшения
];

let multiplyClick = 1;

function renderShop() {
  shopList.innerHTML = '';
  shopItems.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.classList.add('shop-item');
    itemEl.textContent = `${item.name} — ${item.cost} очков`;
    const buyBtn = document.createElement('button');
    buyBtn.textContent = 'Купить';
    buyBtn.disabled = score < item.cost;
    buyBtn.addEventListener('click', () => {
      if (score >= item.cost) {
        score -= item.cost;
        item.effect();
        updateScore();
        renderShop();
      }
    });
    itemEl.appendChild(buyBtn);
    shopList.appendChild(itemEl);
  });
}

// --- Задания ---
let tasks = [];

addTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = taskNameInput.value.trim();
  const link = taskLinkInput.value.trim();
  if (!name || !link) return;

  const newTask = { id: Date.now(), name, link, completed: false };
  tasks.push(newTask);
  renderTasks();

  taskNameInput.value = '';
  taskLinkInput.value = '';
});

function renderTasks() {
  tasksList.innerHTML = '';
  if (tasks.length === 0) {
    tasksList.innerHTML = '<p>Заданий пока нет.</p>';
    return;
  }

  tasks.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.classList.add('task');
    if (task.completed) taskEl.classList.add('completed');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = task.name;

    const link = document.createElement('a');
    link.href = '#';
    link.textContent = task.link;
    link.addEventListener('click', e => e.preventDefault());

    const btn = document.createElement('button');
    btn.textContent = task.completed ? 'Выполнено' : 'Выполнить';
    btn.disabled = task.completed;

    btn.addEventListener('click', () => {
      if (task.completed) return;
      score += 10; // начисляем 10 очков за выполнение
      updateScore();
      task.completed = true;
      renderTasks();
    });

    taskEl.appendChild(nameSpan);
    taskEl.appendChild(link);
    taskEl.appendChild(btn);
    tasksList.appendChild(taskEl);
  });
}

// --- Обработка кнопок открытия ---
shopBtn.addEventListener('click', () => {
  toggleOverlay(shopOverlay);
  tasksOverlay.classList.remove('open');
  renderShop();
});
tasksBtn.addEventListener('click', () => {
  toggleOverlay(tasksOverlay);
  shopOverlay.classList.remove('open');
});

function toggleOverlay(overlay) {
  if (overlay.classList.contains('open')) overlay.classList.remove('open');
  else overlay.classList.add('open');
}

// --- Автокликер ---
setInterval(() => {
  if (autoClick > 0) {
    score += autoClick;
    updateScore();
    renderShop();
  }
}, 1000);

updateScore();
renderTasks();
renderShop();