import type { ProductSummary } from '@joice/domain';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api';

export interface ApiMedia {
  id: string;
  url: string;
  alt: string;
  type: 'IMAGE' | 'VIDEO';
  sortOrder: number;
}

export interface ApiProduct extends ProductSummary {
  media?: ApiMedia[];
}

export interface ProductListResponse {
  items: ApiProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  offline?: boolean;
}

export interface FacetsResponse {
  families: { value: string; count: number }[];
  genders: { value: string; count: number }[];
  offline?: boolean;
}

export interface VariantDetail {
  sku: string;
  ean: string;
  volumeMl: number;
  priceCents: number;
  compareAtCents: number | null;
  status: string;
  availableQuantity: number;
  product: ApiProduct;
}

export interface OrderResponse {
  id: string;
  number: string;
  status: string;
  syncStatus: string;
  totalCents: number;
  createdAt?: string;
  customer?: {
    name: string;
    email: string;
    phone?: string | null;
  };
  items: {
    sku: string;
    quantity: number;
    unitPriceCents: number;
    totalCents: number;
  }[];
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: init?.cache ?? 'no-store',
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Falha na API (${response.status}).`;
    try {
      const body = (await response.json()) as {
        message?: string | string[];
      };
      if (body.message) {
        message = Array.isArray(body.message)
          ? body.message.join(' ')
          : body.message;
      }
    } catch {
      // mantém a mensagem padrão
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function getProducts(
  params: {
    q?: string;
    family?: string;
    gender?: string;
    page?: number;
    pageSize?: number;
  } = {},
): Promise<ProductListResponse> {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.family) search.set('family', params.family);
  if (params.gender) search.set('gender', params.gender);
  if (params.page && params.page > 1) search.set('page', String(params.page));
  if (params.pageSize) search.set('pageSize', String(params.pageSize));

  try {
    return await apiFetch<ProductListResponse>(
      `/catalog/products?${search.toString()}`,
    );
  } catch {
    return {
      items: [],
      total: 0,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 12,
      totalPages: 1,
      offline: true,
    };
  }
}

export async function getFacets(): Promise<FacetsResponse> {
  try {
    return await apiFetch<FacetsResponse>('/catalog/facets');
  } catch {
    return { families: [], genders: [], offline: true };
  }
}

export async function getProduct(slug: string): Promise<ApiProduct | null> {
  try {
    return await apiFetch<ApiProduct>(
      `/catalog/products/${encodeURIComponent(slug)}`,
    );
  } catch {
    return null;
  }
}

export async function getOrder(id: string): Promise<OrderResponse | null> {
  try {
    return await apiFetch<OrderResponse>(`/orders/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}
