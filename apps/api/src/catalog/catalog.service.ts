import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProductStatus } from '@prisma/client';
import type { ProductSummary } from '@joice/domain';
import { PrismaService } from '../common/prisma.service';
import { ListProductsQueryDto } from './dto/list-products.query';

const productInclude = Prisma.validator<Prisma.ProductInclude>()({
  variants: {
    where: { status: ProductStatus.ACTIVE },
    include: { inventory: true },
    orderBy: { volumeMl: 'asc' },
  },
  media: { orderBy: { sortOrder: 'asc' } },
});

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

function toProductSummary(product: ProductWithRelations): ProductSummary {
  const variants = product.variants.map((variant) => ({
    id: variant.id,
    sku: variant.sku,
    ean: variant.ean,
    volumeMl: variant.volumeMl,
    priceCents: variant.priceCents,
    compareAtCents: variant.compareAtCents,
    status: variant.status,
    availableQuantity: variant.inventory.reduce(
      (total, position) =>
        total + Math.max(0, position.quantity - position.reserved),
      0,
    ),
  }));

  const priceFromCents =
    variants.length > 0
      ? Math.min(...variants.map((variant) => variant.priceCents))
      : 0;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    line: product.line,
    olfactiveFamily: product.olfactiveFamily,
    gender: product.gender,
    concentration: product.concentration,
    year: product.year,
    description: product.description,
    notes: {
      top: product.notesTop,
      heart: product.notesHeart,
      base: product.notesBase,
    },
    priceFromCents,
    inStock: variants.some((variant) => variant.availableQuantity > 0),
    variants,
  };
}

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListProductsQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 12;
    const search = query.q?.trim();

    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.ACTIVE,
      ...(query.family ? { olfactiveFamily: query.family } : {}),
      ...(query.gender ? { gender: query.gender } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { line: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { notesTop: { has: search } },
              { notesHeart: { has: search } },
              { notesBase: { has: search } },
            ],
          }
        : {}),
    };

    const [total, products] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items: products.map(toProductSummary),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: ProductStatus.ACTIVE },
      include: productInclude,
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return {
      ...toProductSummary(product),
      media: product.media,
    };
  }

  async findVariantBySku(sku: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { sku },
      include: {
        inventory: true,
        product: { include: productInclude },
      },
    });

    if (!variant) {
      throw new NotFoundException('SKU não encontrado.');
    }

    return {
      sku: variant.sku,
      ean: variant.ean,
      volumeMl: variant.volumeMl,
      priceCents: variant.priceCents,
      compareAtCents: variant.compareAtCents,
      status: variant.status,
      availableQuantity: variant.inventory.reduce(
        (total, position) =>
          total + Math.max(0, position.quantity - position.reserved),
        0,
      ),
      product: toProductSummary(variant.product),
    };
  }

  async facets() {
    const [families, genders] = await Promise.all([
      this.prisma.product.groupBy({
        by: ['olfactiveFamily'],
        where: { status: ProductStatus.ACTIVE },
        orderBy: { olfactiveFamily: 'asc' },
        _count: { _all: true },
      }),
      this.prisma.product.groupBy({
        by: ['gender'],
        where: { status: ProductStatus.ACTIVE },
        orderBy: { gender: 'asc' },
        _count: { _all: true },
      }),
    ]);

    return {
      families: families
        .map((family) => ({
          value: family.olfactiveFamily,
          count: family._count._all,
        }))
        .sort((a, b) => b.count - a.count),
      genders: genders
        .map((gender) => ({
          value: gender.gender,
          count: gender._count._all,
        }))
        .sort((a, b) => b.count - a.count),
    };
  }
}
