import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { ProductStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const quantities = new Map<string, number>();
    for (const item of dto.items) {
      quantities.set(item.sku, (quantities.get(item.sku) ?? 0) + item.quantity);
    }

    const skus = [...quantities.keys()];
    const variants = await this.prisma.productVariant.findMany({
      where: { sku: { in: skus }, status: ProductStatus.ACTIVE },
      include: { inventory: true },
    });
    const bySku = new Map(variants.map((variant) => [variant.sku, variant]));

    const missing = skus.filter((sku) => !bySku.has(sku));
    if (missing.length > 0) {
      throw new BadRequestException(`SKUs inválidos: ${missing.join(', ')}.`);
    }

    for (const [sku, quantity] of quantities) {
      const variant = bySku.get(sku)!;
      const available = variant.inventory.reduce(
        (total, position) =>
          total + Math.max(0, position.quantity - position.reserved),
        0,
      );
      if (available < quantity) {
        throw new BadRequestException(
          `Estoque insuficiente para ${sku}. Disponível: ${available}.`,
        );
      }
    }

    const items = [...quantities.entries()].map(([sku, quantity]) => {
      const variant = bySku.get(sku)!;
      return {
        variantId: variant.id,
        sku,
        quantity,
        unitPriceCents: variant.priceCents,
        totalCents: variant.priceCents * quantity,
      };
    });

    const subtotalCents = items.reduce(
      (total, item) => total + item.totalCents,
      0,
    );
    const number = `JR-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '')}-${randomBytes(3).toString('hex').toUpperCase()}`;

    const order = await this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { email: dto.email.toLowerCase() },
        update: {
          name: dto.name,
          phone: dto.phone ?? undefined,
          document: dto.document ?? undefined,
        },
        create: {
          email: dto.email.toLowerCase(),
          name: dto.name,
          phone: dto.phone ?? null,
          document: dto.document ?? null,
        },
      });

      const created = await tx.order.create({
        data: {
          number,
          status: 'PENDING',
          syncStatus: 'PENDING_SYNC',
          customerId: customer.id,
          subtotalCents,
          totalCents: subtotalCents,
          items: { create: items },
        },
        include: { items: true, customer: true },
      });

      for (const item of items) {
        let remaining = item.quantity;
        const positions = await tx.inventory.findMany({
          where: { variantId: item.variantId },
          orderBy: { locationCode: 'asc' },
        });

        for (const position of positions) {
          if (remaining <= 0) {
            break;
          }

          const take = Math.min(
            Math.max(0, position.quantity - position.reserved),
            remaining,
          );
          if (take === 0) {
            continue;
          }

          const updated = await tx.$executeRaw`
            UPDATE "Inventory"
            SET "reserved" = "reserved" + ${take}, "updatedAt" = NOW()
            WHERE "id" = ${position.id}
              AND ("quantity" - "reserved") >= ${take}
          `;

          if (updated === 0) {
            remaining = -1;
            break;
          }
          remaining -= take;
        }

        if (remaining !== 0) {
          throw new BadRequestException(
            `Estoque insuficiente para ${item.sku}.`,
          );
        }
      }

      await tx.outboxEvent.create({
        data: {
          type: 'order.created',
          aggregateId: created.id,
          payload: {
            orderId: created.id,
            number: created.number,
            customer: {
              name: customer.name,
              email: customer.email,
            },
            items: created.items.map((item) => ({
              sku: item.sku,
              quantity: item.quantity,
              unitPriceCents: item.unitPriceCents,
            })),
            totalCents: created.totalCents,
          },
        },
      });

      return created;
    });

    return {
      id: order.id,
      number: order.number,
      status: order.status,
      syncStatus: order.syncStatus,
      totalCents: order.totalCents,
      items: order.items.map((item) => ({
        sku: item.sku,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
        totalCents: item.totalCents,
      })),
    };
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        customer: { select: { name: true, email: true, phone: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    return order;
  }
}
