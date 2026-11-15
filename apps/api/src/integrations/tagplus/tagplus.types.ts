export interface TagPlusOrderItem {
  sku: string;
  quantity: number;
  unitPriceCents: number;
}

export interface TagPlusOrderInput {
  orderId: string;
  number: string;
  customer: {
    name: string;
    email: string;
  };
  items: TagPlusOrderItem[];
  totalCents: number;
}

export interface TagPlusOrderResult {
  externalId: string;
  status: string;
}

export interface TagPlusProductInput {
  sku: string;
  name: string;
  priceCents: number;
}

export interface TagPlusInventoryInput {
  sku: string;
  quantity: number;
  locationCode?: string;
}

export interface TagPlusClient {
  createOrder(input: TagPlusOrderInput): Promise<TagPlusOrderResult>;
  upsertProduct(input: TagPlusProductInput): Promise<{ externalId: string }>;
  updateInventory(input: TagPlusInventoryInput): Promise<void>;
}

export interface OrderCreatedPayload {
  orderId: string;
  number: string;
  customer: {
    name: string;
    email: string;
  };
  items: TagPlusOrderItem[];
  totalCents: number;
}

export const TAGPLUS_CLIENT = Symbol('TAGPLUS_CLIENT');
