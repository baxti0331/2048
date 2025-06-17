const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const textInput = document.getElementById('text-input');
const barcodeContainer = document.getElementById('barcode');
const statusMsg = document.getElementById('status-msg');
const progressBar = document.getElementById('progress-bar');
const progressFill = progressBar.querySelector('div');

function isValidEAN13(value) {
  // Проверка: ровно 12 цифр
  return /^\d{12}$/.test(value);
}

// Вычисление контрольной цифры EAN-13
function calculateEAN13CheckDigit(code) {
  let sum = 0;
  for (let i = 0; i < code.length; i++) {
    let digit = parseInt(code[i]);
    if ((i + 1) % 2 === 0) sum += digit * 3;
    else sum += digit;
  }
  let checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit;
}

textInput.addEventListener('input', () => {
  const value = textInput.value.trim();
  generateBtn.disabled = !isValidEAN13(value);
  statusMsg.textContent = '';
  barcodeContainer.classList.remove('visible');
  downloadBtn.style.display = 'none';
  barcodeContainer.innerHTML = '';
});

function simulateProgress(duration = 800) {
  progressBar.style.display = 'block';
  progressFill.style.width = '0%';

  return new Promise((resolve) => {
    let start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      progressFill.style.width = `${progress * 100}%`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        progressBar.style.display = 'none';
        resolve();
      }
    }
    requestAnimationFrame(step);
  });
}

generateBtn.addEventListener('click', async () => {
  const value = textInput.value.trim();
  if (!isValidEAN13(value)) {
    statusMsg.textContent = 'Введите ровно 12 цифр!';
    return;
  }

  statusMsg.textContent = 'Генерируем штрихкод...';
  generateBtn.disabled = true;
  downloadBtn.style.display = 'none';
  barcodeContainer.classList.remove('visible');
  barcodeContainer.innerHTML = '';

  await simulateProgress();

  const fullCode = value + calculateEAN13CheckDigit(value);

  try {
    JsBarcode(barcodeContainer, fullCode, {
      format: "ean13",
      lineColor: "#000",
      width: 2,
      height: 100,
      displayValue: true,
      fontSize: 18,
    });
    barcodeContainer.classList.add('visible');
    statusMsg.textContent = 'Штрихкод готов!';
    downloadBtn.style.display = 'inline-flex';
  } catch (e) {
    statusMsg.textContent = 'Ошибка генерации штрихкода.';
    console.error(e);
  }

  generateBtn.disabled = false;
});

// Можно добавить код для кнопки скачивания, если нужно
downloadBtn.addEventListener('click', () => {
  // Можно реализовать, например, экспорт SVG в PNG, если надо
});