export const VOLUME_ORDER = [30, 50, 100] as const;

export function formatVolume(volumeMl: number): string {
  return `${volumeMl} ml`;
}

export function sortByVolume<T extends { volumeMl: number }>(variants: T[]): T[] {
  return [...variants].sort((a, b) => a.volumeMl - b.volumeMl);
}

export function pickDefaultVariant<T extends { volumeMl: number; priceCents: number }>(
  variants: T[],
): T | undefined {
  if (variants.length === 0) {
    return undefined;
  }
  const sorted = sortByVolume(variants);
  const closestToFifty = sorted.reduce((best, current) =>
    Math.abs(current.volumeMl - 50) < Math.abs(best.volumeMl - 50) ? current : best,
  );
  return closestToFifty;
}
