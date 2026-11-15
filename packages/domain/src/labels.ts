import type {
  Concentration,
  Gender,
  OlfactiveFamily,
  OrderStatus,
  SyncStatus,
} from './types';

export const OLFACTIVE_FAMILY_LABELS: Record<OlfactiveFamily, string> = {
  FLORAL: 'Floral',
  AMADEIRADO: 'Amadeirado',
  ORIENTAL: 'Oriental',
  CITRICO: 'Cítrico',
  GOURMAND: 'Gourmand',
  AROMATICO: 'Aromático',
  FRUTADO: 'Frutado',
  COURO: 'Couro',
};

export const GENDER_LABELS: Record<Gender, string> = {
  FEMININO: 'Feminino',
  MASCULINO: 'Masculino',
  UNISSEX: 'Unissex',
};

export const CONCENTRATION_LABELS: Record<Concentration, string> = {
  EAU_DE_COLOGNE: 'Eau de Cologne',
  EAU_DE_TOILETTE: 'Eau de Toilette',
  EAU_DE_PARFUM: 'Eau de Parfum',
  PARFUM: 'Parfum',
  BODY_SPLASH: 'Body Splash',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Aguardando pagamento',
  PAID: 'Pago',
  PROCESSING: 'Em separação',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

export const SYNC_STATUS_LABELS: Record<SyncStatus, string> = {
  PENDING_SYNC: 'Sincronização pendente',
  SYNCED: 'Sincronizado',
  FAILED: 'Falha na sincronização',
  NOT_APPLICABLE: 'Não se aplica',
};

export const OLFACTIVE_FAMILY_VALUES = Object.keys(
  OLFACTIVE_FAMILY_LABELS,
) as OlfactiveFamily[];

export const GENDER_VALUES = Object.keys(GENDER_LABELS) as Gender[];

export const CONCENTRATION_VALUES = Object.keys(
  CONCENTRATION_LABELS,
) as Concentration[];
