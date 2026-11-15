import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ORDER_STATUS_LABELS,
  formatBRL,
  type OrderStatus,
} from '@joice/domain';
import { OrderSyncStatus } from '@/components/OrderSyncStatus';
import { getOrder } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Acompanhar pedido',
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  const statusLabel =
    ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status;
  const createdAt = order.createdAt
    ? new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'long',
        timeStyle: 'short',
      }).format(new Date(order.createdAt))
    : null;

  return (
    <main className="page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Trilha de navegação">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/produtos">Perfumes</Link>
          <span aria-hidden="true">/</span>
          <span>Pedido {order.number}</span>
        </nav>

        <section className="order-page">
          <header className="order-page__head">
            <p className="eyebrow">Pedido registrado</p>
            <h1>{order.number}</h1>
            <p>
              {createdAt ? `Criado em ${createdAt}. ` : ''}
              Status atual: <strong>{statusLabel}</strong>.
            </p>
            <div className="order-page__sync">
              <span>Integração com o ERP</span>
              <OrderSyncStatus
                orderId={order.id}
                initialStatus={order.syncStatus}
              />
            </div>
          </header>

          <div className="order-page__grid">
            <div className="order-page__items">
              <h2>Itens</h2>
              <ul>
                {order.items.map((item) => (
                  <li key={item.sku}>
                    <span>{item.sku}</span>
                    <span>
                      {item.quantity} × {formatBRL(item.unitPriceCents)}
                    </span>
                    <strong>{formatBRL(item.totalCents)}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="order-page__summary">
              <h2>Resumo</h2>
              <div>
                <span>Total</span>
                <strong>{formatBRL(order.totalCents)}</strong>
              </div>
              {order.customer ? (
                <p>
                  <strong>{order.customer.name}</strong>
                  <br />
                  {order.customer.email}
                </p>
              ) : null}
              <p className="order-page__note">
                O pedido é registrado imediatamente. A sincronização com o
                TagPlus acontece de forma assíncrona, sem bloquear a compra.
              </p>
              <Link href="/produtos" className="btn btn--ghost">
                Continuar comprando
              </Link>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
