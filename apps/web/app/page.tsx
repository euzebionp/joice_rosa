import Link from 'next/link';
import {
  OLFACTIVE_FAMILY_LABELS,
  OLFACTIVE_FAMILY_VALUES,
} from '@joice/domain';
import { ProductCard } from '@/components/ProductCard';
import { ProductVisual } from '@/components/ProductVisual';
import { getFacets, getProducts, type ApiProduct } from '@/lib/api';
import { familyGradient } from '@/lib/visual';

export const dynamic = 'force-dynamic';

const PREFERRED = [
  'noir-absolu',
  'blanc-eternel',
  'oud-imperial',
  'gourmand-rouge',
];

const pillars = [
  {
    number: '01',
    title: 'Curadoria, não catálogo',
    copy: 'Poucas fragrâncias, escolhidas por assinatura olfativa, qualidade de matéria-prima e comportamento na pele.',
  },
  {
    number: '02',
    title: 'Transparência olfativa',
    copy: 'Pirâmide, concentração e volume claros. Você entende o que está comprando antes de sentir.',
  },
  {
    number: '03',
    title: 'Presença consciente',
    copy: 'Amostras com cada pedido, embalagem reciclável e retirada em loja para reduzir deslocamentos.',
  },
];

export default async function HomePage() {
  const [catalog, facets] = await Promise.all([
    getProducts({ pageSize: 8 }),
    getFacets(),
  ]);

  const featured = PREFERRED.map((slug) =>
    catalog.items.find((item) => item.slug === slug),
  ).filter((item): item is ApiProduct => item !== undefined);

  const products =
    featured.length >= 3 ? featured : catalog.items.slice(0, 4);

  const familyCounts = new Map(
    facets.families.map((family) => [family.value, family.count]),
  );

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">Perfumaria autoral brasileira</p>
            <h1>
              A arte de perfumar <em>o invisível</em>.
            </h1>
            <p className="hero__lead">
              Composições autorais criadas no Brasil, com matérias-primas
              nobres e uma curadoria que respeita a sua pele, o seu ritmo e a
              sua memória.
            </p>
            <div className="hero__actions">
              <Link href="/produtos" className="btn btn--primary">
                Explorar perfumes
              </Link>
              <Link href="#familias" className="btn btn--ghost">
                Famílias olfativas
              </Link>
            </div>
            <p className="hero__note">
              <span>Frete grátis</span> acima de R$ 299 · Amostras com cada
              pedido
            </p>
          </div>

          <div className="hero__art">
            <ProductVisual family="ORIENTAL" size="hero" />
            <div className="hero__caption">
              <span>Signature</span>
              <strong>Noir Absolu</strong>
              <small>Eau de Parfum · 2024</small>
            </div>
          </div>
        </div>
      </section>

      <div className="trust-strip">
        <div className="container trust-strip__grid">
          <span>Frete grátis acima de R$ 299</span>
          <span>Amostras com cada pedido</span>
          <span>Compra segura</span>
          <span>Retirada em loja</span>
        </div>
      </div>

      <section className="section" id="familias">
        <div className="container">
          <div className="section__head">
            <div>
              <p className="eyebrow">Leitura olfativa</p>
              <h2>Encontre o seu rastro</h2>
            </div>
            <Link href="/produtos" className="section__link">
              Ver todos os perfumes
            </Link>
          </div>

          <div className="family-grid">
            {OLFACTIVE_FAMILY_VALUES.map((family) => {
              const count = familyCounts.get(family) ?? 0;
              return (
                <Link
                  key={family}
                  href={`/produtos?family=${family}`}
                  className="family-card"
                  style={{ background: familyGradient(family) }}
                >
                  <span className="family-card__count">
                    {count > 0
                      ? `${count} ${count === 1 ? 'perfume' : 'perfumes'}`
                      : 'Explorar'}
                  </span>
                  <span className="family-card__name">
                    {OLFACTIVE_FAMILY_LABELS[family]}
                  </span>
                  <span className="family-card__arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section__head">
            <div>
              <p className="eyebrow">Seleção da casa</p>
              <h2>Destaques Joice Rosa</h2>
            </div>
            <Link href="/produtos" className="section__link">
              Ver a coleção completa
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="offline-note">
              <strong>A vitrine está sendo preparada.</strong>
              <p>
                Em instantes os perfumes estarão disponíveis. Se você está
                executando o projeto localmente, confirme se a API está ativa.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section editorial">
        <div className="container editorial__grid">
          <div className="editorial__intro">
            <p className="eyebrow">Nossa assinatura</p>
            <h2>Perfume é memória em movimento.</h2>
            <p>
              Cada composição nasce de um encontro entre matéria-prima,
              clima e pele. Nosso papel é traduzir esse encontro em uma
              experiência clara, sensorial e duradoura.
            </p>
            <Link href="/produtos" className="btn btn--ghost">
              Conhecer a coleção
            </Link>
          </div>

          <div className="pillars">
            {pillars.map((pillar) => (
              <article className="pillar" key={pillar.number}>
                <span>{pillar.number}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
