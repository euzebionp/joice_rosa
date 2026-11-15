import { GENDER_VALUES, OLFACTIVE_FAMILY_VALUES } from './labels';
import type {
  CatalogPage,
  CatalogProduct,
  CatalogVariant,
  Concentration,
  Gender,
  OlfactiveFamily,
} from './types';

interface CatalogVariantSeed {
  volumeMl: number;
  priceCents: number;
  compareAtCents?: number;
}

interface CatalogProductSeed {
  slug: string;
  code: string;
  name: string;
  line: string;
  family: OlfactiveFamily;
  gender: Gender;
  concentration: Concentration;
  year: number;
  description: string;
  seoDescription: string;
  notesTop: string[];
  notesHeart: string[];
  notesBase: string[];
  variants: CatalogVariantSeed[];
}

const productSeeds: CatalogProductSeed[] = [
  {
    slug: 'noir-absolu',
    code: 'NOIR',
    name: 'Noir Absolu',
    line: 'Signature',
    family: 'ORIENTAL',
    gender: 'UNISSEX',
    concentration: 'EAU_DE_PARFUM',
    year: 2024,
    description:
      'Uma composição noturna e envolvente. A bergamota abre caminho para um coração de âmbar e incenso, enquanto sândalo e patchouli deixam uma assinatura quente e inesquecível.',
    seoDescription:
      'Noir Absolu: eau de parfum oriental amadeirado da Joice Rosa Cosméticos, com âmbar, incenso e sândalo.',
    notesTop: ['bergamota', 'pimenta rosa', 'cardamomo'],
    notesHeart: ['âmbar', 'baunilha', 'incenso'],
    notesBase: ['sândalo', 'patchouli', 'musk'],
    variants: [
      { volumeMl: 30, priceCents: 18900 },
      { volumeMl: 50, priceCents: 27900 },
      { volumeMl: 100, priceCents: 42900, compareAtCents: 49900 },
    ],
  },
  {
    slug: 'blanc-eternel',
    code: 'BLANC',
    name: 'Blanc Éternel',
    line: 'Signature',
    family: 'FLORAL',
    gender: 'FEMININO',
    concentration: 'EAU_DE_PARFUM',
    year: 2023,
    description:
      'Um floral luminoso e atemporal. Pera e neroli conduzem a um buquê de jasmim, rosa e íris, assentado em baunilha e cashmeran.',
    seoDescription:
      'Blanc Éternel: eau de parfum floral feminino da Joice Rosa Cosméticos, com jasmim, rosa e íris.',
    notesTop: ['pera', 'neroli', 'bergamota'],
    notesHeart: ['jasmim', 'rosa', 'íris'],
    notesBase: ['baunilha', 'cashmeran', 'musk'],
    variants: [
      { volumeMl: 30, priceCents: 16900 },
      { volumeMl: 50, priceCents: 24900 },
      { volumeMl: 100, priceCents: 38900 },
    ],
  },
  {
    slug: 'vetiver-atlantico',
    code: 'VETIVER',
    name: 'Vetiver Atlântico',
    line: 'Atelier',
    family: 'AMADEIRADO',
    gender: 'MASCULINO',
    concentration: 'EAU_DE_TOILETTE',
    year: 2024,
    description:
      'Frescor mineral e madeiras nobres. Limão siciliano e gengibre encontram vetiver e cipreste, finalizados com âmbar e couro.',
    seoDescription:
      'Vetiver Atlântico: eau de toilette amadeirado masculino da Joice Rosa Cosméticos, com vetiver e cipreste.',
    notesTop: ['limão siciliano', 'gengibre', 'bergamota'],
    notesHeart: ['vetiver', 'cipreste', 'sálvia'],
    notesBase: ['âmbar', 'couro', 'musk'],
    variants: [
      { volumeMl: 30, priceCents: 14900 },
      { volumeMl: 50, priceCents: 21900 },
      { volumeMl: 100, priceCents: 33900 },
    ],
  },
  {
    slug: 'citrus-sol',
    code: 'CITRUS',
    name: 'Citrus Sol',
    line: 'Atelier',
    family: 'CITRICO',
    gender: 'UNISSEX',
    concentration: 'EAU_DE_TOILETTE',
    year: 2022,
    description:
      'Um cítrico solar e vibrante. Laranja, limão e bergamota se entrelaçam ao neroli e ao petit grain, com fundo de musk e cedro.',
    seoDescription:
      'Citrus Sol: eau de toilette cítrico unissex da Joice Rosa Cosméticos, com laranja, neroli e cedro.',
    notesTop: ['laranja', 'limão', 'bergamota'],
    notesHeart: ['neroli', 'petit grain', 'chá branco'],
    notesBase: ['musk', 'cedro', 'âmbar'],
    variants: [
      { volumeMl: 30, priceCents: 12900 },
      { volumeMl: 50, priceCents: 18900 },
      { volumeMl: 100, priceCents: 28900 },
    ],
  },
  {
    slug: 'gourmand-rouge',
    code: 'GOURMAND',
    name: 'Gourmand Rouge',
    line: 'Signature',
    family: 'GOURMAND',
    gender: 'FEMININO',
    concentration: 'EAU_DE_PARFUM',
    year: 2025,
    description:
      'Um gourmand intenso e sedutor. Framboesa e amêndoa abrem para praliné, baunilha e café, sobre tonka e sândalo.',
    seoDescription:
      'Gourmand Rouge: eau de parfum gourmand feminino da Joice Rosa Cosméticos, com praliné, baunilha e café.',
    notesTop: ['framboesa', 'amêndoa', 'bergamota'],
    notesHeart: ['praliné', 'baunilha', 'café'],
    notesBase: ['tonka', 'sândalo', 'musk'],
    variants: [
      { volumeMl: 30, priceCents: 19900 },
      { volumeMl: 50, priceCents: 28900 },
      { volumeMl: 100, priceCents: 44900 },
    ],
  },
  {
    slug: 'oud-imperial',
    code: 'OUD',
    name: 'Oud Imperial',
    line: 'Les Précieux',
    family: 'ORIENTAL',
    gender: 'UNISSEX',
    concentration: 'PARFUM',
    year: 2025,
    description:
      'Oud nobre em uma composição opulenta. Açafrão e framboesa contrastam com rosa e oud, enquanto âmbar, couro e patchouli prolongam a experiência.',
    seoDescription:
      'Oud Imperial: parfum oriental unissex da Joice Rosa Cosméticos, com oud, rosa e açafrão.',
    notesTop: ['açafrão', 'framboesa', 'pimenta preta'],
    notesHeart: ['oud', 'rosa', 'gerânio'],
    notesBase: ['âmbar', 'couro', 'patchouli'],
    variants: [
      { volumeMl: 30, priceCents: 24900 },
      { volumeMl: 50, priceCents: 35900 },
      { volumeMl: 100, priceCents: 54900 },
    ],
  },
  {
    slug: 'jardim-secreto',
    code: 'JARDIM',
    name: 'Jardim Secreto',
    line: 'Les Jardins',
    family: 'FLORAL',
    gender: 'FEMININO',
    concentration: 'EAU_DE_TOILETTE',
    year: 2023,
    description:
      'Um floral verde e delicado. Folhas verdes e bergamota abraçam peônia, rosa e lírio, com um fundo de musk e cedro.',
    seoDescription:
      'Jardim Secreto: eau de toilette floral feminino da Joice Rosa Cosméticos, com peônia, rosa e lírio.',
    notesTop: ['bergamota', 'folhas verdes', 'pera'],
    notesHeart: ['peônia', 'rosa', 'lírio'],
    notesBase: ['musk', 'cedro', 'âmbar'],
    variants: [
      { volumeMl: 30, priceCents: 13900 },
      { volumeMl: 50, priceCents: 19900 },
      { volumeMl: 100, priceCents: 29900 },
    ],
  },
  {
    slug: 'aqua-botanica',
    code: 'AQUA',
    name: 'Aqua Botânica',
    line: 'Les Jardins',
    family: 'AROMATICO',
    gender: 'MASCULINO',
    concentration: 'EAU_DE_TOILETTE',
    year: 2024,
    description:
      'Um aromático refrescante e elegante. Hortelã e limão se unem à lavanda e sálvia, sobre vetiver e musk.',
    seoDescription:
      'Aqua Botânica: eau de toilette aromático masculino da Joice Rosa Cosméticos, com hortelã, lavanda e vetiver.',
    notesTop: ['hortelã', 'limão', 'bergamota'],
    notesHeart: ['lavanda', 'sálvia', 'gerânio'],
    notesBase: ['vetiver', 'musk', 'cedro'],
    variants: [
      { volumeMl: 30, priceCents: 13900 },
      { volumeMl: 50, priceCents: 20900 },
      { volumeMl: 100, priceCents: 31900 },
    ],
  },
];

function eanForSku(sku: string): string {
  let hash = 0;
  for (let index = 0; index < sku.length; index += 1) {
    hash = (hash * 31 + sku.charCodeAt(index)) % 1_000_000_000;
  }
  return `789${String(hash).padStart(10, '0')}`;
}

function buildProduct(seed: CatalogProductSeed): CatalogProduct {
  const variants: CatalogVariant[] = seed.variants.map((variant) => {
    const sku = `JR-${seed.code}-${variant.volumeMl}`;
    return {
      sku,
      ean: eanForSku(sku),
      volumeMl: variant.volumeMl,
      priceCents: variant.priceCents,
      compareAtCents: variant.compareAtCents ?? null,
    };
  });

  return {
    id: seed.slug,
    slug: seed.slug,
    name: seed.name,
    brand: 'Joice Rosa',
    line: seed.line,
    olfactiveFamily: seed.family,
    gender: seed.gender,
    concentration: seed.concentration,
    year: seed.year,
    description: seed.description,
    seoDescription: seed.seoDescription,
    notes: {
      top: seed.notesTop,
      heart: seed.notesHeart,
      base: seed.notesBase,
    },
    variants,
  };
}

export const CATALOG: CatalogProduct[] = productSeeds.map(buildProduct);

const catalogBySlug = new Map(CATALOG.map((product) => [product.slug, product]));

const catalogBySku = new Map<
  string,
  { product: CatalogProduct; variant: CatalogVariant }
>();

for (const product of CATALOG) {
  for (const variant of product.variants) {
    catalogBySku.set(variant.sku, { product, variant });
  }
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return catalogBySlug.get(slug);
}

export function getCatalogProductBySku(sku: string): CatalogProduct | undefined {
  return catalogBySku.get(sku)?.product;
}

export function getCatalogVariantBySku(
  sku: string,
): { product: CatalogProduct; variant: CatalogVariant } | undefined {
  return catalogBySku.get(sku);
}

export function getAllSkus(): string[] {
  return Array.from(catalogBySku.keys());
}

export function getPriceFromCents(product: CatalogProduct): number {
  return product.variants.reduce(
    (minimum, variant) => Math.min(minimum, variant.priceCents),
    Number.POSITIVE_INFINITY,
  );
}

export function getFeaturedProducts(slugs: string[]): CatalogProduct[] {
  return slugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is CatalogProduct => product !== undefined);
}

export function filterCatalog(params: {
  q?: string;
  family?: OlfactiveFamily;
  gender?: Gender;
  page?: number;
  pageSize?: number;
} = {}): CatalogPage {
  const query = params.q ? normalizeText(params.q.trim()) : '';
  const pageSize = Math.max(1, params.pageSize ?? 12);

  const matches = CATALOG.filter((product) => {
    if (params.family && product.olfactiveFamily !== params.family) {
      return false;
    }

    if (params.gender && product.gender !== params.gender) {
      return false;
    }

    if (!query) {
      return true;
    }

    const searchable = normalizeText(
      [
        product.name,
        product.line ?? '',
        product.description,
        ...product.notes.top,
        ...product.notes.heart,
        ...product.notes.base,
      ].join(' '),
    );

    return searchable.includes(query);
  });

  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
  const page = Math.min(Math.max(1, params.page ?? 1), totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: matches.slice(start, start + pageSize),
    total: matches.length,
    page,
    pageSize,
    totalPages,
  };
}

export function getFamilyCounts(): Record<OlfactiveFamily, number> {
  const counts = Object.fromEntries(
    OLFACTIVE_FAMILY_VALUES.map((value) => [value, 0]),
  ) as Record<OlfactiveFamily, number>;

  for (const product of CATALOG) {
    counts[product.olfactiveFamily] += 1;
  }

  return counts;
}

export function getGenderCounts(): Record<Gender, number> {
  const counts = Object.fromEntries(
    GENDER_VALUES.map((value) => [value, 0]),
  ) as Record<Gender, number>;

  for (const product of CATALOG) {
    counts[product.gender] += 1;
  }

  return counts;
}
