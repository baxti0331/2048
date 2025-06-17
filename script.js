const cylinder = document.getElementById('cylinder');
const scoreDisplay = document.getElementById('score');
const autoClickInfo = document.getElementById('auto-click-info');
const clickMultiplierInfo = document.getElementById('click-multiplier-info');

const shopBtn = document.getElementById('shop-btn');
const tasksBtn = document.getElementById('tasks-btn');
const shopOverlay = document.getElementById('shop-overlay');
const tasksOverlay = document.getElementById('tasks-overlay');
const shopList = document.getElementById('shop-list');
const closeShopBtn = document.getElementById('close-shop-btn');
const closeTasksBtn = document.getElementById('close-tasks-btn');

let score = 0;
let activeFace = null;

let autoClickerLevel = 0;
let clickMultiplierLevel = 0;

const autoClickerBaseCost = 50;
const clickMultiplierBaseCost = 100;

const numbers = [1,2,3,4,5,6,7,8];
const facesCount = numbers.length;
const radius = 80;
const angleStep = 360 / facesCount;

// Создаем грани цилиндра
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
    addScore(num * getClickMultiplier());
  });

  cylinder.appendChild(face);
});

function getClickMultiplier() {
  return 1 + clickMultiplierLevel;
}

function addScore(amount) {
  score += amount;
  updateScoreDisplay();
}

function updateScoreDisplay() {
  scoreDisplay.textContent = `Очки: ${score}`;
  autoClickInfo.textContent = `Автокликер: ${autoClickerLevel > 0 ? `вкл. (уровень ${autoClickerLevel})` : 'выкл.'}`;
  clickMultiplierInfo.textContent = `Множитель клика: x${getClickMultiplier()}`;
}

// Магазин
const shopItems = [
  { id: 'autoClicker', name: 'Автокликер', description: 'Автоматически добавляет очки каждую секунду', getCost: () => autoClickerBaseCost * (autoClickerLevel + 1), level: () => autoClickerLevel },
  { id: 'clickMultiplier', name: 'Удвоитель клика', description: 'Увеличивает количество очков за клик', getCost: () => clickMultiplierBaseCost * (clickMultiplierLevel + 1), level: () => clickMultiplierLevel },
];

function renderShop() {
  shopList.innerHTML = '';
  shopItems.forEach(item => {
    const cost = item.getCost();
    const lvl = item.level();
    const div = document.createElement('div');
    div.className = 'shop-item';
    div.innerHTML = `
      <div>
        ${item.name} ${lvl > 0 ? `(уровень ${lvl})` : ''}
        <div style="font-weight:400; font-size:0.85rem; margin-top:4px;">${item.description}</div>
      </div>
      <button ${score < cost ? 'disabled' : ''}>Купить (${cost} очков)</button>
    `;
    const btn = div.querySelector('button');
    btn.addEventListener('click', () => {
      if (score >= cost) {
        score -= cost;
        if (item.id === 'autoClicker') {
          autoClickerLevel++;
          startAutoClicker();
        } else if (item.id === 'clickMultiplier') {
          clickMultiplierLevel++;
        }
        updateScoreDisplay();
        renderShop();
      }
    });
    shopList.appendChild(div);
  });
}

// Автокликер
let autoClickerInterval = null;
function startAutoClicker() {
  if (autoClickerInterval) clearInterval(autoClickerInterval);
  if (autoClickerLevel > 0) {
    autoClickerInterval = setInterval(() => {
      addScore(autoClickerLevel); // добавляем очки равные уровню автокликера каждую секунду
    }, 1000);
  }
}

// Кнопки магазина и заданий
shopBtn.addEventListener('click', () => {
  renderShop();
  shopOverlay.classList.add('active');
});

closeShopBtn.addEventListener('click', () => {
  shopOverlay.classList.remove('active');
});

tasksBtn.addEventListener('click', () => {
  tasksOverlay.classList.add('active');
});

closeTasksBtn.addEventListener('click', () => {
  tasksOverlay.classList.remove('active');
});

updateScoreDisplay();