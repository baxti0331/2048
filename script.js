const symbols = ['🍒', '💎', '🔔', '7️⃣', '🍋'];
const payouts = {
  '🍒🍒🍒': 50,
  '💎💎💎': 100,
  '🔔🔔🔔': 70,
  '7️⃣7️⃣7️⃣': 200,
  '🍋🍋🍋': 30
};

let balance = 1000;
const bet = 50;

const balanceEl = document.getElementById('balance');
const resultEl = document.getElementById('result');
const spinBtn = document.getElementById('spin');
const reels = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3')
];

function spin() {
  if (balance < bet) {
    resultEl.textContent = 'Недостаточно средств!';
    resultEl.style.color = 'red';
    return;
  }

  balance -= bet;
  balanceEl.textContent = balance;

  const outcome = [];
  reels.forEach((reel, i) => {
    const rand = Math.floor(Math.random() * symbols.length);
    const symbol = symbols[rand];
    outcome.push(symbol);
    reel.textContent = symbol;
    reel.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      reel.style.transform = 'rotate(0deg)';
    }, 400);
  });

  const combo = outcome.join('');
  if (payouts[combo]) {
    const win = payouts[combo];
    balance += win;
    balanceEl.textContent = balance;
    resultEl.textContent = `Вы выиграли $${win}! 🎉`;
    resultEl.style.color = 'lime';
  } else {
    resultEl.textContent = 'Попробуйте снова!';
    resultEl.style.color = 'gray';
  }
}

spinBtn.addEventListener('click', spin);