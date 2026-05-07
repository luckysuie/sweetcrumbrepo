export function formatMoney(cents: number, currency = 'USD') {
  const amount = cents / 100
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

