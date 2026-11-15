import type { Metadata } from 'next';
import Link from 'next/link';
import type { Gender, OlfactiveFamily } from '@joice/domain';
import {
  GENDER_LABELS,
  GENDER_VALUES,
  OLFACTIVE_FAMILY_LABELS,
  OLFACTIVE_FAMILY_VALUES,
} from '@joice/domain';
import { ProductCard } from '@/components/ProductCard';
import { getFacets, getProducts } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Perfumes',
  description:
    'Explore a coleção Joice Rosa Cosméticos: florais, amadeirados, orientais, cítricos e gourmands criados no Brasil.',
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function buildCatalogHref(params: {
  q?: string;
  family?: string;
  gender?: string;
  page?: number;
}): string {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.family) search.set('family', params.family);
  if (params.gender) search.set('gender', params.gender);
  if (params.page && params.page > 1) {
    search.set('page', String(params.page));
  }

  const query = search.toString();
  return query ? `/produtos?${query}` : '/produtos';
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const q = first(params.q)?.trim() || undefined;

  const familyValue = first(params.family);
  const family = OLFACTIVE_FAMILY_VALUES.includes(
    familyValue as OlfactiveFamily,
  )
    ? (familyValue as OlfactiveFamily)
    : undefined;

  const genderValue = first(params.gender);
  const gender = GENDER_VALUES.includes(genderValue as Gender)
    ? (genderValue as Gender)
    : undefined;

  const parsedPage = Number(first(params.page) ?? '1');
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [catalog, facets] = await Promise.all([
    getProducts({
      q,
      family,
      gender,
      page,
      pageSize: 12,
    }),
    getFacets(),
  ]);

  const familyCounts = new Map(
    facets.families.map((item) => [item.value, item.count]),
  );
  const genderCounts = new Map(
    facets.genders.map((item) => [item.value, item.count]),
  );

  const activeFilters = [
    family ? OLFACTIVE_FAMILY_LABELS[family] : null,
    gender ? GENDER_LABELS[gender] : null,
    q ? `“${q}”` : null,
  ].filter(Boolean);

  return (
    <main className="page">
      <div className="container">
        <header className="catalog-head">
          <p className="eyebrow">A coleção</p>
          <h1>Perfumes</h1>
          <p className="catalog-head__lead">
            Oito assinaturas olfativas, três volumes e uma mesma intenção:
            revelar a sua presença sem excesso.
          </p>
        </header>

        <form className="catalog-search" action="/produtos" method="get">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Buscar por nome, nota ou família"
            aria-label="Buscar perfumes"
          />
          {family ? (
            <input type="hidden" name="family" value={family} />
          ) : null}
          {gender ? (
            <input type="hidden" name="gender" value={gender} />
          ) : null}
          <button type="submit" className="btn btn--primary">
            Buscar
          </button>
        </form>

        <section className="filters" aria-label="Filtros">
          <div className="filters__group">
            <span className="filters__label">Família</span>
            <div className="filters__chips">
              <Link
                href={buildCatalogHref({ q, gender })}
                className={`chip${!family ? ' chip--active' : ''}`}
              >
                Todas
              </Link>
              {OLFACTIVE_FAMILY_VALUES.map((value) => (
                <Link
                  key={value}
                  href={buildCatalogHref({
                    q,
                    gender,
                    family: family === value ? undefined : value,
                  })}
                  className={`chip${family === value ? ' chip--active' : ''}`}
                >
                  {OLFACTIVE_FAMILY_LABELS[value]}
                  <small>{familyCounts.get(value) ?? 0}</small>
                </Link>
              ))}
            </div>
          </div>

          <div className="filters__group">
            <span className="filters__label">Para quem</span>
            <div className="filters__chips">
              <Link
                href={buildCatalogHref({ q, family })}
                className={`chip${!gender ? ' chip--active' : ''}`}
              >
                Todos
              </Link>
              {GENDER_VALUES.map((value) => (
                <Link
                  key={value}
                  href={buildCatalogHref({
                    q,
                    family,
                    gender: gender === value ? undefined : value,
                  })}
                  className={`chip${gender === value ? ' chip--active' : ''}`}
                >
                  {GENDER_LABELS[value]}
                  <small>{genderCounts.get(value) ?? 0}</small>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="catalog-meta">
          <span>
            {catalog.total} {catalog.total === 1 ? 'perfume' : 'perfumes'}
            {activeFilters.length > 0
              ? ` · ${activeFilters.join(' · ')}`
              : ''}
          </span>
          {activeFilters.length > 0 ? (
            <Link href="/produtos" className="link-button">
              Limpar filtros
            </Link>
          ) : null}
        </div>

        {catalog.offline ? (
          <div className="offline-note">
            <strong>Catálogo temporariamente indisponível.</strong>
            <p>
              Não foi possível conectar à API. Se você está executando o
              projeto localmente, confirme se a API está ativa na porta 3333.
            </p>
          </div>
        ) : catalog.items.length > 0 ? (
          <div className="product-grid product-grid--catalog">
            {catalog.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Nenhum perfume encontrado.</h2>
            <p>
              Tente outra nota, família olfativa ou remova os filtros para ver
              a coleção completa.
            </p>
            <Link href="/produtos" className="btn btn--primary">
              Ver todos os perfumes
            </Link>
          </div>
        )}

        {catalog.totalPages > 1 ? (
          <nav className="pagination" aria-label="Paginação">
            {page > 1 ? (
              <Link
                href={buildCatalogHref({
                  q,
                  family,
                  gender,
                  page: page - 1,
                })}
                className="btn btn--ghost"
              >
                Anterior
              </Link>
            ) : (
              <span className="btn btn--ghost btn--disabled">Anterior</span>
            )}
            <span>
              Página {page} de {catalog.totalPages}
            </span>
            {page < catalog.totalPages ? (
              <Link
                href={buildCatalogHref({
                  q,
                  family,
                  gender,
                  page: page + 1,
                })}
                className="btn btn--ghost"
              >
                Próxima
              </Link>
            ) : (
              <span className="btn btn--ghost btn--disabled">Próxima</span>
            )}
          </nav>
        ) : null}
      </div>
    </main>
  );
}
