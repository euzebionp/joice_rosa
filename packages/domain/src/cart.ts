import { getCatalogVariantBySku } from './catalog';
import { formatBRL } from './money';
import { availableQuantity, isAvailable } from './stock';
import type {
  CartItem,
  CartLine,
  CartValidation,
  StockSnapshot,
} from './types';
import { formatVolume } from './volume';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function sanitizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const merged = new Map<string, number>();

  for (const rawItem of value) {
    if (!isRecord(rawItem) || typeof rawItem.sku !== 'string') {
      continue;
    }

    const quantity =
      typeof rawItem.quantity === 'number' && Number.isFinite(rawItem.quantity)
        ? Math.max(1, Math.floor(rawItem.quantity))
        : null;

    if (quantity === null) {
      continue;
    }

    merged.set(rawItem.sku, (merged.get(rawItem.sku) ?? 0) + quantity);
  }

  return Array.from(merged, ([sku, quantity]) => ({ sku, quantity }));
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function validateCart(
  items: CartItem[],
  stock: StockSnapshot,
): CartValidation {
  const lines: CartLine[] = [];
  const issues: string[] = [];

  if (stock.offline) {
    issues.push('Não foi possível confirmar o estoque agora.');
  }

  for (const item of items) {
    const found = getCatalogVariantBySku(item.sku);

    if (!found) {
      issues.push(`O item ${item.sku} não está mais no catálogo.`);
      continue;
    }

    const quantity = Math.max(1, Math.floor(item.quantity));
    const stockEntry = stock.items[item.sku] ?? null;
    const available = isAvailable(stockEntry);
    const maximum = availableQuantity(stockEntry);

    if (!available) {
      issues.push(
        `${found.product.name} · ${formatVolume(found.variant.volumeMl)} está indisponível.`,
      );
    } else if (quantity > maximum) {
      issues.push(
        `${found.product.name} · ${formatVolume(found.variant.volumeMl)}: apenas ${maximum} ${maximum === 1 ? 'unidade disponível' : 'unidades disponíveis'}.`,
      );
    }

    lines.push({
      sku: item.sku,
      product: found.product,
      variant: found.variant,
      quantity,
      availableQuantity: maximum,
      available,
      unitPriceCents: found.variant.priceCents,
      totalCents: found.variant.priceCents * quantity,
    });
  }

  return {
    lines,
    issues,
    valid: items.length > 0 && issues.length === 0,
    totalCents: lines.reduce((total, line) => total + line.totalCents, 0),
  };
}

export function upsertCartItem(
  items: CartItem[],
  sku: string,
  quantity: number,
  maximum: number,
): { items: CartItem[]; added: boolean; message: string } {
  const max = Math.max(0, Math.floor(maximum));

  if (max === 0) {
    return {
      items,
      added: false,
      message: 'Este item está indisponível no momento.',
    };
  }

  const requested = Math.max(1, Math.floor(quantity));
  const existing = items.find((item) => item.sku === sku);
  const nextQuantity = Math.min(existing ? existing.quantity + requested : requested, max);

  if (existing && nextQuantity === existing.quantity) {
    return {
      items,
      added: false,
      message: `Você já adicionou o limite de ${max} ${max === 1 ? 'unidade' : 'unidades'} deste item.`,
    };
  }

  const nextItems = existing
    ? items.map((item) =>
        item.sku === sku ? { ...item, quantity: nextQuantity } : item,
      )
    : [...items, { sku, quantity: nextQuantity }];

  return {
    items: nextItems,
    added: true,
    message: `${formatBRL(
      (getCatalogVariantBySku(sku)?.variant.priceCents ?? 0) * requested,
    )} adicionado à sacola.`,
  };
}
