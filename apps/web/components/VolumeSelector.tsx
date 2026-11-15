'use client';

import { useState } from 'react';
import type { ProductVariant } from '@joice/domain';
import {
  formatBRL,
  formatVolume,
  pickDefaultVariant,
  pricePerMl,
  sortByVolume,
} from '@joice/domain';
import { addToBag } from '@/lib/bag';

export function VolumeSelector({
  variants,
}: {
  variants: ProductVariant[];
}) {
  const ordered = sortByVolume(variants);
  const initial = pickDefaultVariant(ordered) ?? ordered[0];
  const [selectedSku, setSelectedSku] = useState(initial?.sku ?? '');
  const [feedback, setFeedback] = useState<string | null>(null);

  const selected =
    ordered.find((variant) => variant.sku === selectedSku) ?? initial;

  if (!selected) {
    return <p className="pdp__unavailable">Produto temporariamente indisponível.</p>;
  }

  const soldOut = selected.availableQuantity <= 0;

  const handleAdd = () => {
    addToBag(selected.sku);
    setFeedback('Adicionado à sacola.');
    window.setTimeout(() => setFeedback(null), 2400);
  };

  return (
    <div className="volume">
      <div className="volume__label">
        <span>Escolha o volume</span>
        <span className="volume__stock">
          {soldOut
            ? 'Esgotado'
            : `${selected.availableQuantity} unidades disponíveis`}
        </span>
      </div>

      <div className="volume__options" role="group" aria-label="Volume">
        {ordered.map((variant) => {
          const active = variant.sku === selected.sku;
          const unavailable = variant.availableQuantity <= 0;

          return (
            <button
              key={variant.sku}
              type="button"
              className={`volume__option${active ? ' volume__option--active' : ''}`}
              aria-pressed={active}
              onClick={() => setSelectedSku(variant.sku)}
            >
              <strong>{formatVolume(variant.volumeMl)}</strong>
              <span>{formatBRL(variant.priceCents)}</span>
              {unavailable ? <small>Esgotado</small> : null}
            </button>
          );
        })}
      </div>

      <div className="volume__price">
        <div>
          <strong>{formatBRL(selected.priceCents)}</strong>
          {selected.compareAtCents &&
          selected.compareAtCents > selected.priceCents ? (
            <span className="volume__compare">
              {formatBRL(selected.compareAtCents)}
            </span>
          ) : null}
        </div>
        <small>
          {formatBRL(pricePerMl(selected.priceCents, selected.volumeMl))} por ml
        </small>
      </div>

      <button
        type="button"
        className="btn btn--primary btn--full"
        onClick={handleAdd}
        disabled={soldOut}
      >
        {soldOut ? 'Esgotado' : 'Adicionar à sacola'}
      </button>

      <p className="volume__feedback" aria-live="polite">
        {feedback ?? 'Pagamento e entrega na próxima etapa.'}
      </p>
    </div>
  );
}
