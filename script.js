const productSelect = document.getElementById('product');
const gramsInput = document.getElementById('grams');
const addBtn = document.getElementById('addBtn');
const logDiv = document.getElementById('log');
const totalCaloriesDiv = document.getElementById('totalCalories');
const adviceDiv = document.getElementById('advice');

let entries = JSON.parse(localStorage.getItem('foodEntries')) || [];

function analyzeDiet(entries) {
  let totalCalories = 0;
  let categoriesCount = {
    фрукты: 0,
    овощи: 0,
    мясо: 0,
    углеводы: 0,
    молочные: 0,
  };
  entries.forEach(entry => {
    totalCalories += entry.calories;
    if (categoriesCount.hasOwnProperty(entry.category)) {
      categoriesCount[entry.category] += entry.grams;
    }
  });

  const adviceList = [];

  if (totalCalories < 1500) adviceList.push('Калорий слишком мало, постарайтесь есть больше.');
  else if (totalCalories > 2800) adviceList.push('Калорий много — контролируйте порции.');

  if (categoriesCount.овощи < 100) adviceList.push('Добавьте больше овощей для витаминов и клетчатки.');
  if (categoriesCount.фрукты < 100) adviceList.push('Фрукты важны, не забывайте их.');

  if (categoriesCount.мясо < 50 && categoriesCount.молочные < 100)
    adviceList.push('Добавьте белка из мяса или молочных продуктов.');

  if (adviceList.length === 0) adviceList.push('Ваш рацион выглядит сбалансированным. Молодец!');

  return adviceList.join(' ');
}

function renderEntries() {
  logDiv.innerHTML = '';
  let totalCalories = 0;
  entries.forEach((entry) => {
    const el = document.createElement('div');
    el.className = 'entry';
    el.innerHTML = `
      <div>${entry.product} — ${entry.grams} г</div>
      <div>${entry.calories} ккал</div>
    `;
    logDiv.appendChild(el);
    totalCalories += entry.calories;
  });
  totalCaloriesDiv.textContent = `Всего калорий: ${totalCalories}`;
  adviceDiv.textContent = analyzeDiet(entries);
}

function saveEntries() {
  localStorage.setItem('foodEntries', JSON.stringify(entries));
}

addBtn.addEventListener('click', () => {
  const productOption = productSelect.selectedOptions[0];
  if (!productOption || !gramsInput.value || gramsInput.value <= 0) {
    alert('Пожалуйста, выберите продукт и введите корректное количество.');
    return;
  }
  const product = productOption.value;
  const grams = Number(gramsInput.value);
  const caloriesPer100 = Number(productOption.getAttribute('data-calories'));
  const category = productOption.getAttribute('data-category');

  const calories = Math.round(caloriesPer100 * grams / 100);

  entries.push({ product, grams, calories, category });
  saveEntries();
  renderEntries();

  // Сброс формы
  gramsInput.value = '';
  productSelect.selectedIndex = 0;
});

// Инициализация при загрузке
renderEntries();


// --- Слайдер ---
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

prevBtn.addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});

nextBtn.addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});

// Автопереключение слайдов (опционально)
setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 8000);
