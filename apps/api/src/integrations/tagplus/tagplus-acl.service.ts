import { Inject, Injectable } from '@nestjs/common';
import {
  OrderCreatedPayload,
  TAGPLUS_CLIENT,
  TagPlusClient,
  TagPlusOrderResult,
} from './tagplus.types';

@Injectable()
export class TagPlusAclService {
  constructor(
    @Inject(TAGPLUS_CLIENT) private readonly client: TagPlusClient,
  ) {}

  async createOrder(payload: OrderCreatedPayload): Promise<TagPlusOrderResult> {
    return this.client.createOrder({
      orderId: payload.orderId,
      number: payload.number,
      customer: {
        name: payload.customer.name,
        email: payload.customer.email,
      },
      items: payload.items.map((item) => ({
        sku: item.sku,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
      })),
      totalCents: payload.totalCents,
    });
  }
}
