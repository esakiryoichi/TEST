const unitPriceInput = document.getElementById('unitPrice');
const quantityInput = document.getElementById('quantity');
const discountInput = document.getElementById('discount');
const taxRateInput = document.getElementById('taxRate');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');
const copyTotalBtn = document.getElementById('copyTotal');
const copyDetailBtn = document.getElementById('copyDetail');
const statusEl = document.getElementById('status');

const yenFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 0,
});

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function calculate() {
  const unitPrice = Math.max(0, toNumber(unitPriceInput.value));
  const quantity = Math.max(0, toNumber(quantityInput.value));
  const discount = Math.max(0, toNumber(discountInput.value));
  const taxRate = Math.max(0, toNumber(taxRateInput.value));

  const subtotal = Math.max(0, unitPrice * quantity - discount);
  const total = Math.round(subtotal * (1 + taxRate / 100));

  subtotalEl.textContent = yenFormatter.format(subtotal);
  totalEl.textContent = yenFormatter.format(total);

  return { unitPrice, quantity, discount, taxRate, subtotal, total };
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    statusEl.textContent = message;
  } catch (_) {
    statusEl.textContent = 'コピーに失敗しました。ブラウザの権限設定をご確認ください。';
  }
}

copyTotalBtn.addEventListener('click', async () => {
  const { total } = calculate();
  await copyText(`${total}`, `税込合計 ${yenFormatter.format(total)} をコピーしました`);
});

copyDetailBtn.addEventListener('click', async () => {
  const { unitPrice, quantity, discount, taxRate, subtotal, total } = calculate();
  const detail = [
    `単価: ${yenFormatter.format(unitPrice)}`,
    `数量: ${quantity}`,
    `値引き: ${yenFormatter.format(discount)}`,
    `税率: ${taxRate}%`,
    `小計: ${yenFormatter.format(subtotal)}`,
    `税込合計: ${yenFormatter.format(total)} (${total}円)`,
  ].join('\n');

  await copyText(detail, '内訳付きテキストをコピーしました');
});

[unitPriceInput, quantityInput, discountInput, taxRateInput].forEach((input) => {
  input.addEventListener('input', () => {
    calculate();
    statusEl.textContent = '';
  });
});

calculate();
