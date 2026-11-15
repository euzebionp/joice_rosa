import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CONCENTRATION_LABELS,
  GENDER_LABELS,
  OLFACTIVE_FAMILY_LABELS,
} from '@joice/domain';
import { NotesPyramid } from '@/components/NotesPyramid';
import { ProductVisual } from '@/components/ProductVisual';
import { VolumeSelector } from '@/components/VolumeSelector';
import { getProduct } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Perfume não encontrado' };
  }

  return {
    title: `${product.name} — ${CONCENTRATION_LABELS[product.concentration]}`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Joice Rosa Cosméticos`,
      description: product.description,
      type: 'website',
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    description: product.description,
    category: 'Perfume',
    offers: product.variants.map((variant) => ({
      '@type': 'Offer',
      sku: variant.sku,
      priceCurrency: 'BRL',
      price: (variant.priceCents / 100).toFixed(2),
      availability:
        variant.availableQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    })),
  };

  return (
    <main className="page pdp">
      <div className="container">
        <nav className="breadcrumb" aria-label="Trilha de navegação">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/produtos">Perfumes</Link>
          <span aria-hidden="true">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="pdp__grid">
          <div className="pdp__visual">
            <ProductVisual
              family={product.olfactiveFamily}
              size="detail"
            />
            <div className="pdp__visual-caption">
              <span>{product.line ?? product.brand}</span>
              <span>
                {CONCENTRATION_LABELS[product.concentration]} ·{' '}
                {product.year ?? 'Coleção atual'}
              </span>
            </div>
          </div>

          <div className="pdp__info">
            <p className="eyebrow">
              {product.brand} · {product.line ?? 'Signature'}
            </p>
            <h1>{product.name}</h1>
            <p className="pdp__meta">
              {OLFACTIVE_FAMILY_LABELS[product.olfactiveFamily]} ·{' '}
              {GENDER_LABELS[product.gender]} ·{' '}
              {CONCENTRATION_LABELS[product.concentration]}
            </p>
            <p className="pdp__description">{product.description}</p>

            <VolumeSelector variants={product.variants} />

            <NotesPyramid notes={product.notes} />

            <dl className="pdp__facts">
              <div>
                <dt>Família</dt>
                <dd>{OLFACTIVE_FAMILY_LABELS[product.olfactiveFamily]}</dd>
              </div>
              <div>
                <dt>Indicação</dt>
                <dd>{GENDER_LABELS[product.gender]}</dd>
              </div>
              <div>
                <dt>Concentração</dt>
                <dd>{CONCENTRATION_LABELS[product.concentration]}</dd>
              </div>
              <div>
                <dt>Lançamento</dt>
                <dd>{product.year ?? '—'}</dd>
              </div>
            </dl>

            <ul className="pdp__assurance">
              <li>Amostras com cada pedido</li>
              <li>Frete grátis acima de R$ 299</li>
              <li>Retirada em loja disponível</li>
              <li>Embalagem reciclável</li>
            </ul>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
