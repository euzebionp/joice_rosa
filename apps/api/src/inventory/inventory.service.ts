import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async availability(sku: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { sku },
      include: {
        inventory: { orderBy: { locationCode: 'asc' } },
        product: { select: { name: true, slug: true } },
      },
    });

    if (!variant) {
      throw new NotFoundException('SKU não encontrado.');
    }

    const locations = variant.inventory.map((position) => ({
      locationCode: position.locationCode,
      locationName: position.locationName,
      quantity: position.quantity,
      reserved: position.reserved,
      available: Math.max(0, position.quantity - position.reserved),
    }));

    return {
      sku: variant.sku,
      product: variant.product,
      availableQuantity: locations.reduce(
        (total, location) => total + location.available,
        0,
      ),
      locations,
    };
  }
}
