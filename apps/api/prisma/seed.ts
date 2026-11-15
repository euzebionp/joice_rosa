import { PrismaClient } from '@prisma/client';
import type {
  Concentration,
  Gender,
  OlfactiveFamily,
} from '@prisma/client';

const prisma = new PrismaClient();

const LOCATIONS = [
  { code: 'CD-SP', name: 'Centro de Distribuição São Paulo' },
  { code: 'LOJA-RJ', name: 'Loja Rio de Janeiro' },
  { code: 'LOJA-SP', name: 'Loja São Paulo' },
];

const DEFAULT_STOCK: Record<string, number> = {
  'CD-SP': 20,
  'LOJA-RJ': 6,
  'LOJA-SP': 3,
};

interface SeedVariant {
  volumeMl: number;
  priceCents: number;
  compareAtCents?: number;
}

interface SeedProduct {
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
  variants: SeedVariant[];
  stock?: Record<string, number>;
  variantStock?: Record<number, Record<string, number>>;
}

const products: SeedProduct[] = [
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
    variantStock: {
      30: { 'CD-SP': 0, 'LOJA-RJ': 2, 'LOJA-SP': 0 },
    },
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
    variantStock: {
      100: { 'CD-SP': 3, 'LOJA-RJ': 1, 'LOJA-SP': 0 },
    },
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

function eanFor(sku: string): string {
  let hash = 0;
  for (let index = 0; index < sku.length; index += 1) {
    hash = (hash * 31 + sku.charCodeAt(index)) % 1_000_000_000;
  }
  return `789${String(hash).padStart(10, '0')}`;
}

async function main() {
  for (const product of products) {
    const data = {
      name: product.name,
      brand: 'Joice Rosa',
      line: product.line,
      description: product.description,
      olfactiveFamily: product.family,
      gender: product.gender,
      concentration: product.concentration,
      year: product.year,
      notesTop: product.notesTop,
      notesHeart: product.notesHeart,
      notesBase: product.notesBase,
      status: 'ACTIVE' as const,
      seoTitle: `${product.name} | Joice Rosa Cosméticos`,
      seoDescription: product.seoDescription,
    };

    const savedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: { slug: product.slug, ...data },
    });

    for (const variant of product.variants) {
      const sku = `JR-${product.code}-${variant.volumeMl}`;
      const ean = eanFor(sku);

      const savedVariant = await prisma.productVariant.upsert({
        where: { sku },
        update: {
          productId: savedProduct.id,
          ean,
          volumeMl: variant.volumeMl,
          priceCents: variant.priceCents,
          compareAtCents: variant.compareAtCents ?? null,
          status: 'ACTIVE',
        },
        create: {
          productId: savedProduct.id,
          sku,
          ean,
          volumeMl: variant.volumeMl,
          priceCents: variant.priceCents,
          compareAtCents: variant.compareAtCents ?? null,
          status: 'ACTIVE',
        },
      });

      const stock =
        product.variantStock?.[variant.volumeMl] ??
        product.stock ??
        DEFAULT_STOCK;

      for (const location of LOCATIONS) {
        await prisma.inventory.upsert({
          where: {
            variantId_locationCode: {
              variantId: savedVariant.id,
              locationCode: location.code,
            },
          },
          update: { locationName: location.name },
          create: {
            variantId: savedVariant.id,
            locationCode: location.code,
            locationName: location.name,
            quantity: stock[location.code] ?? 0,
          },
        });
      }
    }
  }

  console.log(`Seed concluído: ${products.length} produtos Joice Rosa.`);
}

main()
  .catch((error) => {
    console.error('Falha no seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
