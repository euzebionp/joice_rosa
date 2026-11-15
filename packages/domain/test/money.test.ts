import { describe, expect, it } from 'vitest';
import { applyPercentageDiscount, formatBRL, pricePerMl } from '../src/money';

describe('money', () => {
  it('formata centavos em reais', () => {
    expect(formatBRL(18900)).toContain('189,00');
  });

  it('calcula o preço por mililitro', () => {
    expect(pricePerMl(18900, 30)).toBe(630);
  });

  it('protege contra volume inválido', () => {
    expect(pricePerMl(18900, 0)).toBe(0);
  });

  it('aplica desconto percentual com arredondamento', () => {
    expect(applyPercentageDiscount(19900, 10)).toBe(17910);
  });
});
