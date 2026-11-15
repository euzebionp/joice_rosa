export type OlfactiveFamily =
  | 'FLORAL'
  | 'AMADEIRADO'
  | 'ORIENTAL'
  | 'CITRICO'
  | 'GOURMAND'
  | 'AROMATICO'
  | 'FRUTADO'
  | 'COURO';

export type Gender = 'FEMININO' | 'MASCULINO' | 'UNISSEX';

export type Concentration =
  | 'EAU_DE_COLOGNE'
  | 'EAU_DE_TOILETTE'
  | 'EAU_DE_PARFUM'
  | 'PARFUM'
  | 'BODY_SPLASH';

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type SyncStatus =
  | 'PENDING_SYNC'
  | 'SYNCED'
  | 'FAILED'
  | 'NOT_APPLICABLE';

export interface ProductNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface CatalogVariant {
  sku: string;
  ean: string;
  volumeMl: number;
  priceCents: number;
  compareAtCents: number | null;
}

export interface ProductVariant {
  id: string;
  sku: string;
  ean: string;
  volumeMl: number;
  priceCents: number;
  compareAtCents: number | null;
  status: ProductStatus;
  availableQuantity: number;
}

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  brand: string;
  line: string | null;
  olfactiveFamily: OlfactiveFamily;
  gender: Gender;
  concentration: Concentration;
  year: number | null;
  description: string;
  notes: ProductNotes;
  priceFromCents: number;
  inStock: boolean;
  variants: ProductVariant[];
}

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  line: string | null;
  olfactiveFamily: OlfactiveFamily;
  gender: Gender;
  concentration: Concentration;
  year: number | null;
  description: string;
  seoDescription: string;
  notes: ProductNotes;
  variants: CatalogVariant[];
}

export type StockMode = 'mock' | 'tagplus';

export interface StockEntry {
  sku: string;
  quantity: number;
  available: boolean;
  checkedAt: string;
}

export type StockMap = Record<string, StockEntry>;

export interface StockSnapshot {
  checkedAt: string;
  mode: StockMode;
  items: StockMap;
  offline: boolean;
}

export interface CartItem {
  sku: string;
  quantity: number;
}

export interface CartLine {
  sku: string;
  product: CatalogProduct;
  variant: CatalogVariant;
  quantity: number;
  availableQuantity: number;
  available: boolean;
  unitPriceCents: number;
  totalCents: number;
}

export interface CartValidation {
  lines: CartLine[];
  issues: string[];
  valid: boolean;
  totalCents: number;
}

export interface CatalogPage {
  items: CatalogProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
