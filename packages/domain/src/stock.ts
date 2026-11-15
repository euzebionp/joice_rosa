import type {
  CatalogProduct,
  CatalogVariant,
  StockEntry,
  StockMap,
  StockMode,
  StockSnapshot,
} from './types';

interface ProductStockLine {
  variant: CatalogVariant;
  stock: StockEntry | null;
  quantity: number;
  available: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toQuantity(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }

  return null;
}

export function isAvailable(
  entry: Pick<StockEntry, 'available' | 'quantity'> | null | undefined,
): boolean {
  return Boolean(entry && entry.available && entry.quantity > 0);
}

export function availableQuantity(
  entry: Pick<StockEntry, 'available' | 'quantity'> | null | undefined,
): number {
  if (!entry || !isAvailable(entry)) {
    return 0;
  }

  return Math.max(0, Math.floor(entry.quantity));
}

export function emptyStockSnapshot(offline = false): StockSnapshot {
  return {
    checkedAt: new Date().toISOString(),
    mode: 'mock',
    items: {},
    offline,
  };
}

export function productHasStock(
  product: CatalogProduct,
  snapshot: StockSnapshot,
): boolean {
  return product.variants.some((variant) =>
    isAvailable(snapshot.items[variant.sku]),
  );
}

export function productStock(
  product: CatalogProduct,
  snapshot: StockSnapshot,
): ProductStockLine[] {
  return product.variants.map((variant) => {
    const stock = snapshot.items[variant.sku] ?? null;
    return {
      variant,
      stock,
      quantity: availableQuantity(stock),
      available: isAvailable(stock),
    };
  });
}

export function parseStockSnapshot(value: unknown): StockSnapshot {
  const checkedAt = new Date().toISOString();

  if (!isRecord(value)) {
    return {
      checkedAt,
      mode: 'mock',
      items: {},
      offline: true,
    };
  }

  const mode: StockMode = value.mode === 'tagplus' ? 'tagplus' : 'mock';
  const rawItems = isRecord(value.items)
    ? Object.values(value.items)
    : Array.isArray(value.items)
      ? value.items
      : [];

  const items: StockMap = {};

  for (const rawItem of rawItems) {
    if (!isRecord(rawItem) || typeof rawItem.sku !== 'string') {
      continue;
    }

    const quantity = toQuantity(rawItem.quantity);
    if (quantity === null) {
      continue;
    }

    const available = rawItem.available !== false && quantity > 0;
    const itemCheckedAt =
      typeof rawItem.checkedAt === 'string' ? rawItem.checkedAt : checkedAt;

    items[rawItem.sku] = {
      sku: rawItem.sku,
      quantity,
      available,
      checkedAt: itemCheckedAt,
    };
  }

  return {
    checkedAt: typeof value.checkedAt === 'string' ? value.checkedAt : checkedAt,
    mode,
    items,
    offline: value.offline === true,
  };
}
