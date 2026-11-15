import type { OlfactiveFamily } from '@joice/domain';
import { OLFACTIVE_FAMILY_LABELS } from '@joice/domain';
import { familyGradient } from '@/lib/visual';

type VisualSize = 'card' | 'hero' | 'detail' | 'thumb';

export function ProductVisual({
  family,
  size = 'card',
}: {
  family: OlfactiveFamily;
  size?: VisualSize;
}) {
  return (
    <div
      className={`product-visual product-visual--${size}`}
      style={{ background: familyGradient(family) }}
    >
      <span className="product-visual__family">
        {OLFACTIVE_FAMILY_LABELS[family]}
      </span>
      <span className="product-visual__ring" aria-hidden="true" />
      <div className="bottle" aria-hidden="true">
        <span className="bottle__cap" />
        <span className="bottle__body">
          <span className="bottle__label">
            JOICE
            <br />
            ROSA
          </span>
        </span>
      </div>
    </div>
  );
}
