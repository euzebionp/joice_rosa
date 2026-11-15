import { describe, expect, it } from 'vitest';
import {
  CATALOG,
  buildWhatsAppUrl,
  emptyStockSnapshot,
  filterCatalog,
  getAllSkus,
  getProductBySlug,
  parseStockSnapshot,
  upsertCartItem,
  validateCart,
  type StockSnapshot,
} from '../src';

const checkedAt = '2026-11-03T12:00:00.000Z';

function snapshot(
  items: Record<string, { quantity: number; available?: boolean }>,
): StockSnapshot {
  return {
    checkedAt,
    mode: 'mock',
    offline: false,
    items: Object.fromEntries(
      Object.entries(items).map(([sku, item]) => [
        sku,
        {
          sku,
          quantity: item.quantity,
          available: item.available ?? item.quantity > 0,
          checkedAt,
        },
      ]),
    ),
  };
}

describe('catalog', () => {
  it('mantém os oito perfumes e vinte e quatro SKUs únicos', () => {
    expect(CATALOG).toHaveLength(8);
    expect(getAllSkus()).toHaveLength(24);
    expect(new Set(getAllSkus()).size).toBe(24);
  });

  it('busca produtos por slug e filtros locais', () => {
    expect(getProductBySlug('noir-absolu')?.name).toBe('Noir Absolu');
    expect(filterCatalog({ family: 'FLORAL' }).total).toBe(2);
    expect(filterCatalog({ q: 'baunilha' }).total).toBeGreaterThan(0);
    expect(filterCatalog({ gender: 'UNISSEX', pageSize: 1 }).totalPages).toBe(3);
  });
});

describe('cart', () => {
  it('valida quantidade contra o estoque consultado', () => {
    const cart = [{ sku: 'JR-NOIR-50', quantity: 2 }];
    const stock = snapshot({ 'JR-NOIR-50': { quantity: 2 } });

    expect(validateCart(cart, stock).valid).toBe(true);
    expect(validateCart(cart, stock).totalCents).toBe(55800);
    expect(validateCart([{ sku: 'JR-NOIR-50', quantity: 3 }], stock).valid).toBe(
      false,
    );
    expect(
      validateCart([{ sku: 'JR-NOIR-50', quantity: 1 }], snapshot({})).valid,
    ).toBe(false);
  });

  it('limita a inclusão ao estoque disponível', () => {
    const first = upsertCartItem([], 'JR-JARDIM-30', 1, 2);
    expect(first.added).toBe(true);
    expect(first.items).toEqual([{ sku: 'JR-JARDIM-30', quantity: 1 }]);

    const second = upsertCartItem(first.items, 'JR-JARDIM-30', 2, 2);
    expect(second.items).toEqual([{ sku: 'JR-JARDIM-30', quantity: 2 }]);

    const third = upsertCartItem(second.items, 'JR-JARDIM-30', 1, 2);
    expect(third.added).toBe(false);
    expect(third.items).toEqual([{ sku: 'JR-JARDIM-30', quantity: 2 }]);
  });

  it('bloqueia carrinho quando a consulta de estoque está offline', () => {
    const result = validateCart(
      [{ sku: 'JR-NOIR-50', quantity: 1 }],
      emptyStockSnapshot(true),
    );
    expect(result.valid).toBe(false);
    expect(result.issues[0]).toContain('Não foi possível confirmar');
  });
});

describe('whatsapp', () => {
  it('gera link wa.me com itens, total e nome opcional', () => {
    const stock = snapshot({ 'JR-NOIR-50': { quantity: 2 } });
    const validation = validateCart(
      [{ sku: 'JR-NOIR-50', quantity: 2 }],
      stock,
    );
    const url = buildWhatsAppUrl(validation.lines, {
      name: 'Ana',
      number: '+55 (34) 99769-3393',
    });

    expect(url.startsWith('https://wa.me/5534997693393?text=')).toBe(true);
    const message = decodeURIComponent(url.split('?text=')[1] ?? '').replace(
      /\u00a0/g,
      ' ',
    );
    expect(message).toContain('2x Noir Absolu');
    expect(message).toContain('Total: R$ 558,00');
    expect(message).toContain('Nome: Ana');
  });

  it('normaliza a resposta do stock worker', () => {
    const parsed = parseStockSnapshot({
      checkedAt,
      mode: 'tagplus',
      offline: false,
      items: {
        'JR-NOIR-50': { sku: 'JR-NOIR-50', quantity: 4, available: true },
      },
    });

    expect(parsed.mode).toBe('tagplus');
    expect(parsed.items['JR-NOIR-50']?.quantity).toBe(4);
  });
});
