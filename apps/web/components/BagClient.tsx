'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { formatBRL, formatVolume } from '@joice/domain';
import {
  apiFetch,
  type OrderResponse,
  type VariantDetail,
} from '@/lib/api';
import {
  clearBag,
  readBag,
  removeFromBag,
  updateBagQuantity,
  type BagItem,
} from '@/lib/bag';
import { ProductVisual } from './ProductVisual';

interface Line extends BagItem {
  detail?: VariantDetail;
  error?: string;
}

export function BagClient() {
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);

  useEffect(() => {
    const stored = readBag();

    if (stored.length === 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    Promise.all(
      stored.map(async (item) => {
        try {
          const detail = await apiFetch<VariantDetail>(
            `/catalog/variants/${encodeURIComponent(item.sku)}`,
          );
          return { ...item, detail };
        } catch {
          return {
            ...item,
            error: 'Não foi possível carregar este item agora.',
          };
        }
      }),
    ).then((loaded) => {
      if (!cancelled) {
        setLines(loaded);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const subtotal = useMemo(
    () =>
      lines.reduce(
        (total, line) =>
          total + (line.detail?.priceCents ?? 0) * line.quantity,
        0,
      ),
    [lines],
  );

  const canCheckout =
    lines.length > 0 &&
    lines.every(
      (line) =>
        line.detail && line.quantity <= line.detail.availableQuantity,
    );

  const changeQuantity = (line: Line, quantity: number) => {
    const maximum = line.detail?.availableQuantity ?? quantity;
    const next = Math.max(1, Math.min(quantity, maximum));
    updateBagQuantity(line.sku, next);
    setLines((current) =>
      current.map((item) =>
        item.sku === line.sku ? { ...item, quantity: next } : item,
      ),
    );
  };

  const remove = (sku: string) => {
    removeFromBag(sku);
    setLines((current) => current.filter((line) => line.sku !== sku));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCheckout) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await apiFetch<OrderResponse>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          items: lines.map((line) => ({
            sku: line.sku,
            quantity: line.quantity,
          })),
        }),
      });

      clearBag();
      setLines([]);
      setOrder(result);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Não foi possível concluir o pedido.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (order) {
    return <OrderSuccess order={order} />;
  }

  if (loading) {
    return (
      <div className="bag-loading">
        <span className="spinner" aria-hidden="true" />
        Carregando sua seleção…
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="empty-state empty-state--compact">
        <p className="eyebrow">Sua sacola</p>
        <h2>Uma página em branco à espera de um rastro.</h2>
        <p>
          Explore a coleção e escolha o perfume que traduz o seu momento.
        </p>
        <Link href="/produtos" className="btn btn--primary">
          Encontrar meu perfume
        </Link>
      </div>
    );
  }

  return (
    <div className="bag-grid">
      <div className="bag-items">
        {lines.map((line) => (
          <article className="bag-item" key={line.sku}>
            {line.detail ? (
              <ProductVisual
                family={line.detail.product.olfactiveFamily}
                size="thumb"
              />
            ) : (
              <div className="bag-item__placeholder" />
            )}

            <div className="bag-item__content">
              <div className="bag-item__head">
                <div>
                  <h3>{line.detail?.product.name ?? line.sku}</h3>
                  <p>
                    {line.detail
                      ? `${formatVolume(line.detail.volumeMl)} · ${line.detail.product.line ?? 'Joice Rosa'}`
                      : line.error}
                  </p>
                </div>
                {line.detail ? (
                  <strong>{formatBRL(line.detail.priceCents)}</strong>
                ) : null}
              </div>

              <div className="bag-item__actions">
                {line.detail ? (
                  <div className="qty" aria-label="Quantidade">
                    <button
                      type="button"
                      onClick={() => changeQuantity(line, line.quantity - 1)}
                      disabled={line.quantity <= 1}
                      aria-label="Diminuir quantidade"
                    >
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(line, line.quantity + 1)}
                      disabled={
                        line.quantity >= line.detail.availableQuantity
                      }
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>
                ) : null}

                <button
                  type="button"
                  className="link-button"
                  onClick={() => remove(line.sku)}
                >
                  Remover
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="bag-summary">
        <h2>Resumo</h2>
        <div className="bag-summary__row">
          <span>Subtotal</span>
          <strong>{formatBRL(subtotal)}</strong>
        </div>
        <div className="bag-summary__row">
          <span>Frete</span>
          <span>Calculado na próxima etapa</span>
        </div>
        <div className="bag-summary__total">
          <span>Total</span>
          <strong>{formatBRL(subtotal)}</strong>
        </div>

        <form className="checkout-form" onSubmit={submit}>
          <label>
            Nome completo
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              autoComplete="name"
            />
          </label>
          <label>
            E-mail
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              autoComplete="email"
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={!canCheckout || submitting}
          >
            {submitting ? 'Criando pedido…' : 'Finalizar pedido'}
          </button>
          <p className="checkout-form__note">
            Pagamento simulado nesta etapa. O pedido será registrado e
            sincronizado com o ERP de forma assíncrona.
          </p>
        </form>
      </aside>
    </div>
  );
}

function OrderSuccess({ order }: { order: OrderResponse }) {
  return (
    <div className="order-success">
      <p className="eyebrow">Pedido confirmado</p>
      <h2>Obrigada por escolher Joice Rosa.</h2>
      <p>
        Seu pedido <strong>{order.number}</strong> foi registrado com sucesso.
        Estamos preparando cada detalhe.
      </p>
      <div className="order-success__line">
        <span>Total</span>
        <strong>{formatBRL(order.totalCents)}</strong>
      </div>
      <Link href={`/pedido/${order.id}`} className="btn btn--primary">
        Acompanhar pedido
      </Link>
    </div>
  );
}
