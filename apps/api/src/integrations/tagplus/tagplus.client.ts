import {
  TagPlusClient,
  TagPlusInventoryInput,
  TagPlusOrderInput,
  TagPlusOrderResult,
  TagPlusProductInput,
} from './tagplus.types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockTagPlusClient implements TagPlusClient {
  private sequence = 0;

  async createOrder(input: TagPlusOrderInput): Promise<TagPlusOrderResult> {
    await delay(250);
    this.sequence += 1;
    return {
      externalId: `MOCK-ORDER-${Date.now()}-${this.sequence}-${input.number}`,
      status: 'RECEIVED',
    };
  }

  async upsertProduct(input: TagPlusProductInput): Promise<{ externalId: string }> {
    await delay(100);
    return { externalId: `MOCK-PRODUCT-${input.sku}` };
  }

  async updateInventory(input: TagPlusInventoryInput): Promise<void> {
    await delay(50);
    void input;
  }
}

export class HttpTagPlusClient implements TagPlusClient {
  private readonly baseUrl = (process.env.TAGPLUS_BASE_URL ?? '').replace(/\/$/, '');
  private readonly token = process.env.TAGPLUS_TOKEN ?? '';
  private readonly timeoutMs = Number(process.env.TAGPLUS_TIMEOUT_MS ?? 8000);

  private headers(): Record<string, string> {
    if (!this.baseUrl || !this.token) {
      throw new Error('TAGPLUS_BASE_URL e TAGPLUS_TOKEN são obrigatórios no modo http.');
    }
    return {
      'content-type': 'application/json',
      authorization: `Bearer ${this.token}`,
    };
  }

  async createOrder(input: TagPlusOrderInput): Promise<TagPlusOrderResult> {
    const response = await fetch(`${this.baseUrl}/pedidos`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        numeroPedido: input.number,
        cliente: {
          nome: input.customer.name,
          email: input.customer.email,
        },
        itens: input.items.map((item) => ({
          codigo: item.sku,
          quantidade: item.quantity,
          valorUnitario: item.unitPriceCents / 100,
        })),
        valorTotal: input.totalCents / 100,
      }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      throw new Error(`TagPlus respondeu ${response.status} ao criar o pedido.`);
    }

    const data = (await response.json()) as {
      id?: string | number;
      pedidoId?: string | number;
      status?: string;
    };
    const externalId = data.id ?? data.pedidoId;

    if (externalId === undefined) {
      throw new Error('TagPlus não retornou o identificador do pedido.');
    }

    return { externalId: String(externalId), status: data.status ?? 'RECEIVED' };
  }

  async upsertProduct(input: TagPlusProductInput): Promise<{ externalId: string }> {
    const response = await fetch(`${this.baseUrl}/produtos`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        codigo: input.sku,
        nome: input.name,
        preco: input.priceCents / 100,
      }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      throw new Error(`TagPlus respondeu ${response.status} ao sincronizar o produto.`);
    }

    const data = (await response.json()) as {
      id?: string | number;
      produtoId?: string | number;
    };
    const externalId = data.id ?? data.produtoId;

    if (externalId === undefined) {
      throw new Error('TagPlus não retornou o identificador do produto.');
    }

    return { externalId: String(externalId) };
  }

  async updateInventory(input: TagPlusInventoryInput): Promise<void> {
    const response = await fetch(`${this.baseUrl}/estoques`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        codigo: input.sku,
        quantidade: input.quantity,
        local: input.locationCode,
      }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      throw new Error(`TagPlus respondeu ${response.status} ao atualizar o estoque.`);
    }
  }
}
