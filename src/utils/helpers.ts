export function generateId(): string {
  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const N = '0123456789';
  let id = '';
  for (let i = 0; i < 2; i++) id += L[Math.floor(Math.random() * L.length)];
  for (let i = 0; i < 4; i++) id += N[Math.floor(Math.random() * N.length)];
  return id;
}

export function generateItemId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
