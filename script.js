// Вкладки переключение
const tabs = document.querySelectorAll('.tab');
const slides = document.querySelectorAll('.slide');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    slides.forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

// --- QR-код ---
const qrText = document.getElementById('qr-text');
const qrGenerateBtn = document.getElementById('qr-generate');
const qrOpenBtn = document.getElementById('qr-open');
const qrCodeContainer = document.getElementById('qrcode');
const qrStatus = document.getElementById('qr-status');

qrText.addEventListener('input', () => {
  qrGenerateBtn.disabled = !qrText.value.trim();
  qrStatus.textContent = '';
  qrOpenBtn.style.display = 'none';
  qrCodeContainer.innerHTML = '';
});

qrGenerateBtn.addEventListener('click', () => {
  qrCodeContainer.innerHTML = '';
  qrStatus.textContent = 'Генерация...';
  QRCode.toDataURL(qrText.value.trim(), { width: 280, margin: 2 }, (err, url) => {
    if (err) {
      qrStatus.textContent = 'Ошибка генерации QR-кода.';
      return;
    }
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'QR-код';
    qrCodeContainer.appendChild(img);
    qrStatus.textContent = 'QR-код готов!';
    qrOpenBtn.style.display = 'inline-flex';
  });
});

qrOpenBtn.addEventListener('click', () => {
  const img = qrCodeContainer.querySelector('img');
  if (!img) return;
  showModal(img.src, 'img');
});

// --- Штрихкод ---
const barcodeText = document.getElementById('barcode-text');
const barcodeGenerateBtn = document.getElementById('barcode-generate');
const barcodeOpenBtn = document.getElementById('barcode-open');
const barcodeContainer = document.getElementById('barcode');
const barcodeStatus = document.getElementById('barcode-status');

barcodeText.addEventListener('input', () => {
  barcodeGenerateBtn.disabled = !barcodeText.value.trim();
  barcodeStatus.textContent = '';
  barcodeOpenBtn.style.display = 'none';
  barcodeContainer.innerHTML = '';
});

barcodeGenerateBtn.addEventListener('click', () => {
  barcodeContainer.innerHTML = '';
  barcodeStatus.textContent = 'Генерация...';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('jsbarcode-format', 'code128');
  svg.setAttribute('jsbarcode-value', barcodeText.value.trim());
  svg.setAttribute('jsbarcode-textmargin', '0');
  svg.setAttribute('jsbarcode-fontoptions', 'bold');
  svg.setAttribute('jsbarcode-height', '80');
  svg.style.maxWidth = '100%';

  barcodeContainer.appendChild(svg);

  try {
    JsBarcode(svg).init();
    barcodeStatus.textContent = 'Штрихкод готов!';
    barcodeOpenBtn.style.display = 'inline-flex';
  } catch(e) {
    barcodeStatus.textContent = 'Ошибка генерации штрихкода.';
    barcodeContainer.innerHTML = '';
    barcodeOpenBtn.style.display = 'none';
  }
});

barcodeOpenBtn.addEventListener('click', () => {
  const svg = barcodeContainer.querySelector('svg');
  if (!svg) return;

  // Конвертируем SVG в DataURL для показа в модальном окне
  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
  const url = URL.createObjectURL(svgBlob);

  showModal(url, 'svg');

  // Очистим URL после закрытия
  modalCloseBtn.addEventListener('click', () => {
    URL.revokeObjectURL(url);
  }, { once: true });
});

// --- Модальное окно ---
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalCloseBtn = document.getElementById('modal-close');

function showModal(src, type) {
  modalContent.innerHTML = '';
  if (type === 'img') {
    const img = document.createElement('img');
    img.src = src;
    modalContent.appendChild(img);
  } else if (type === 'svg') {
    const img = document.createElement('img');
    img.src = src;
    modalContent.appendChild(img);
  }
  modal.classList.add('visible');
}

modalCloseBtn.addEventListener('click', () => {
  modal.classList.remove('visible');
  modalContent.innerHTML = '';
});