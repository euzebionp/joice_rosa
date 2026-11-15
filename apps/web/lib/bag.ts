export interface BagItem {
  sku: string;
  quantity: number;
}

const STORAGE_KEY = 'joice-rosa-bag';

function isBagItem(value: unknown): value is BagItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const item = value as Partial<BagItem>;
  return typeof item.sku === 'string' && typeof item.quantity === 'number';
}

export function readBag(): BagItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? '[]',
    );
    return Array.isArray(parsed)
      ? parsed
          .filter(isBagItem)
          .map((item) => ({
            sku: item.sku,
            quantity: Math.max(1, Math.floor(item.quantity)),
          }))
      : [];
  } catch {
    return [];
  }
}

export function writeBag(items: BagItem[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('joice-bag-updated'));
}

export function addToBag(sku: string, quantity = 1): BagItem[] {
  const items = readBag();
  const existing = items.find((item) => item.sku === sku);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ sku, quantity });
  }

  writeBag(items);
  return items;
}

export function updateBagQuantity(sku: string, quantity: number): BagItem[] {
  const items = readBag()
    .map((item) => (item.sku === sku ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  writeBag(items);
  return items;
}

export function removeFromBag(sku: string): BagItem[] {
  const items = readBag().filter((item) => item.sku !== sku);
  writeBag(items);
  return items;
}

export function clearBag(): void {
  writeBag([]);
}
