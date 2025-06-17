document.addEventListener('DOMContentLoaded', () => {
  const cylinder = document.getElementById('cylinder');
  const scoreDisplay = document.getElementById('score');
  const shopBtn = document.getElementById('shop-btn');
  const tasksBtn = document.getElementById('tasks-btn');
  const shopOverlay = document.getElementById('shop-overlay');
  const tasksOverlay = document.getElementById('tasks-overlay');
  const closeShopBtn = document.getElementById('close-shop');
  const closeTasksBtn = document.getElementById('close-tasks');

  let score = 0;
  let activeFace = null;

  // Числа для цилиндра
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  const facesCount = numbers.length;
  const radius = 80; // радиус цилиндра по кругу
  const angleStep = 360 / facesCount;

  // Создаем грани цилиндра с цифрами
  numbers.forEach((num, i) => {
    const face = document.createElement('div');
    face.classList.add('face');
    face.textContent = num;

    // Позиционируем грань по кругу по оси Y
    const rotateY = i * angleStep;
    face.style.transform = `rotateY(${rotateY}deg) translateZ(${radius}px)`;

    // Клик на грань
    face.addEventListener('click', () => {
      if (activeFace) activeFace.classList.remove('active');
      face.classList.add('active');
      activeFace = face;
      score += num;
      scoreDisplay.textContent = `Очки: ${score}`;
    });

    cylinder.appendChild(face);
  });

  // Открыть магазин
  shopBtn.addEventListener('click', () => {
    shopOverlay.classList.add('visible');
    shopOverlay.classList.remove('hidden');
    tasksOverlay.classList.remove('visible');
    tasksOverlay.classList.add('hidden');
  });

  // Закрыть магазин
  closeShopBtn.addEventListener('click', () => {
    shopOverlay.classList.remove('visible');
    shopOverlay.classList.add('hidden');
  });

  // Открыть задания
  tasksBtn.addEventListener('click', () => {
    tasksOverlay.classList.add('visible');
    tasksOverlay.classList.remove('hidden');
    shopOverlay.classList.remove('visible');
    shopOverlay.classList.add('hidden');
  });

  // Закрыть задания
  closeTasksBtn.addEventListener('click', () => {
    tasksOverlay.classList.remove('visible');
    tasksOverlay.classList.add('hidden');
  });
});