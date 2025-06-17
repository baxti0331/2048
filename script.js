const symbols = ['🍒', '💎', '🔔', '7️⃣', '🍋'];
const reels = [
  document.getElementById('reel1').querySelector('.symbols'),
  document.getElementById('reel2').querySelector('.symbols'),
  document.getElementById('reel3').querySelector('.symbols')
];
const balanceEl = document.getElementById('balance');
const resultEl = document.getElementById('result');
const spinBtn = document.getElementById('spin');

let balance = 1000;
const bet = 50;

function createSymbolsColumn() {
  const column = [];
  for (let i = 0; i < 15; i++) {
    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    column.push(sym);
  }
  return column;
}

function renderSymbols(reel, column) {
  reel.innerHTML = '';
  column.forEach(sym => {
    const div = document.createElement('div');
    div.textContent = sym;
    reel.appendChild(div);
  });
}

function spin() {
  if (balance < bet) {
    resultEl.textContent = 'Недостаточно средств для ставки!';
    resultEl.style.color = 'red';
    return;
  }

  balance -= bet;
  balanceEl.textContent = `Баланс: ${balance}`;
  resultEl.textContent = '';
  spinBtn.disabled = true;

  const columns = reels.map(() => createSymbolsColumn());
  columns.forEach((col, i) => renderSymbols(reels[i], col));

  const durations = [3000, 3500, 4000];
  const symbolHeight = 80;
  const finalSymbols = [];

  reels.forEach((reel, i) => {
    const stopIndex = 5 + Math.floor(Math.random() * 5);
    finalSymbols[i] = columns[i][stopIndex];
    reel.style.transition = `transform ${durations[i]}ms cubic-bezier(0.33, 1, 0.68, 1)`;
    reel.style.transform = `translateY(-${stopIndex * symbolHeight}px)`;
  });

  setTimeout(() => {
    reels.forEach(reel => {
      reel.style.transition = '';
      reel.style.transform = '';
    });

    // Отобразить только выигрышные символы (три одинаковых)
    reels.forEach((reel, i) => {
      renderSymbols(reel, Array(3).fill(finalSymbols[i]));
    });

    checkWin(finalSymbols);

    spinBtn.disabled = false;
  }, Math.max(...durations) + 100);
}

function checkWin(finalSymbols) {
  if (finalSymbols.every(s => s === finalSymbols[0])) {
    const payouts = {
      '🍒': 50,
      '💎': 100,
      '🔔': 70,
      '7️⃣': 200,
      '🍋': 30
    };
    const payout = payouts[finalSymbols[0]] || 0;
    balance += payout;
    balanceEl.textContent = `Баланс: ${balance}`;
    resultEl.textContent = `Вы выиграли $${payout}! 🎉`;
    resultEl.style.color = 'lime';
  } else {
    resultEl.textContent = 'Попробуйте снова!';
    resultEl.style.color = '#ccc';
  }
}

spinBtn.addEventListener('click', spin);
balanceEl.textContent = `Баланс: ${balance}`;