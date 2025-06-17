const cylinder = document.getElementById('cylinder');
const scoreEl = document.getElementById('score');

let score = 0;
let ownedItems = [];

function updateScoreDisplay() {
  scoreEl.textContent = `Очки: ${score}`;
}

function createNumberFaces() {
  const numFaces = 12;
  const angle = 360 / numFaces;
  const radius = 60;

  for (let i = 0; i < numFaces; i++) {
    const face = document.createElement('div');
    face.className = 'face';
    face.textContent = Math.floor(Math.random() * 100);

    const y = Math.sin((angle * i) * Math.PI / 180) * radius;
    const z = Math.cos((angle * i) * Math.PI / 180) * radius;

    face.style.transform = `rotateX(${angle * i}deg) translateZ(${radius}px)`;
    face.addEventListener('click', () => {
      const value = parseInt(face.textContent);
      score += value;
      updateScoreDisplay();
      face.classList.add('active');
      setTimeout(() => face.classList.remove('active'), 300);
    });

    cylinder.appendChild(face);
  }
}
createNumberFaces();

const shopItems = [
  { name: 'Удвоитель очков', cost: 100, effect: () => { score *= 2; updateScoreDisplay(); }},
  { name: '+50 очков', cost: 50, effect: () => { score += 50; updateScoreDisplay(); }},
  { name: 'Случайный бонус', cost: 75, effect: () => {
    const bonus = Math.floor(Math.random() * 100);
    score += bonus;
    updateScoreDisplay();
  }},
];

function renderShop() {
  const shopList = document.getElementById('shop-list');
  shopList.innerHTML = '';
  shopItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name} - ${item.cost} очков</span>
      <button>Купить</button>
    `;
    if (ownedItems.includes(index)) li.classList.add('purchased');
    li.querySelector('button').addEventListener('click', () => {
      if (score >= item.cost && !ownedItems.includes(index)) {
        score -= item.cost;
        item.effect();
        ownedItems.push(index);
        renderShop();
      }
    });
    shopList.appendChild(li);
  });
}

document.getElementById('shop-btn').addEventListener('click', () => {
  document.getElementById('shop-overlay').classList.add('visible');
  renderShop();
});
document.getElementById('close-shop').addEventListener('click', () => {
  document.getElementById('shop-overlay').classList.remove('visible');
});

document.getElementById('tasks-btn').addEventListener('click', () => {
  document.getElementById('tasks-overlay').classList.add('visible');
});
document.getElementById('close-tasks').addEventListener('click', () => {
  document.getElementById('tasks-overlay').classList.remove('visible');
});

document.getElementById('invite-btn').addEventListener('click', () => {
  document.getElementById('invite-overlay').classList.add('visible');
  const container = document.getElementById('referral-container');
  container.innerHTML = `<p>Ваша реферальная ссылка: <code>https://example.com/?ref=12345</code></p>`;
});
document.getElementById('close-invite').addEventListener('click', () => {
  document.getElementById('invite-overlay').classList.remove('visible');
});
