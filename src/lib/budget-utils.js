export function formatCurrency(value) {
  const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  });

  return formatter.format(value);
}

export function formatDate(source) {
  const formatter = new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(source);
}
