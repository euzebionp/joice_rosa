export function formatBRL(cents: number): string {
  const value = Number.isFinite(cents) ? cents : 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100);
}

export function pricePerMl(priceCents: number, volumeMl: number): number {
  if (!Number.isFinite(priceCents) || !Number.isFinite(volumeMl) || volumeMl <= 0) {
    return 0;
  }
  return Math.round(priceCents / volumeMl);
}

export function applyPercentageDiscount(cents: number, percentage: number): number {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);
  return Math.round(cents * (1 - safePercentage / 100));
}
