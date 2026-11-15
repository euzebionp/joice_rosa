import Link from 'next/link';
import {
  CONCENTRATION_LABELS,
  OLFACTIVE_FAMILY_LABELS,
  formatBRL,
} from '@joice/domain';
import type { ApiProduct } from '@/lib/api';
import { ProductVisual } from './ProductVisual';

export function ProductCard({ product }: { product: ApiProduct }) {
  const lowStock = product.variants.some(
    (variant) =>
      variant.availableQuantity > 0 && variant.availableQuantity <= 3,
  );

  return (
    <article className="product-card">
      <Link href={`/produtos/${product.slug}`} className="product-card__link">
        <ProductVisual family={product.olfactiveFamily} />
        <div className="product-card__body">
          <div className="product-card__meta">
            <span>{OLFACTIVE_FAMILY_LABELS[product.olfactiveFamily]}</span>
            <span>{CONCENTRATION_LABELS[product.concentration]}</span>
          </div>
          <h3>{product.name}</h3>
          <p className="product-card__line">{product.line ?? product.brand}</p>
          <div className="product-card__footer">
            <span className="product-card__price">
              A partir de {formatBRL(product.priceFromCents)}
            </span>
            {!product.inStock ? (
              <span className="badge badge--muted">Esgotado</span>
            ) : lowStock ? (
              <span className="badge">Últimas unidades</span>
            ) : (
              <span className="badge badge--soft">Disponível</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
