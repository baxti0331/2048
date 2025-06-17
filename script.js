async function convert() {
  const amount = parseFloat(document.getElementById('amount').value);
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const resultDiv = document.getElementById('result');

  if (isNaN(amount) || amount <= 0) {
    resultDiv.textContent = 'Введите корректную сумму';
    return;
  }

  resultDiv.textContent = 'Загрузка...';

  try {
    const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.result !== undefined) {
      resultDiv.textContent = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
    } else {
      resultDiv.textContent = 'Ошибка получения данных';
    }
  } catch (error) {
    console.error(error);
    resultDiv.textContent = 'Ошибка подключения к API';
  }
}