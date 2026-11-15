import { formatBRL } from './money';
import type { CartLine } from './types';
import { formatVolume } from './volume';

export const DEFAULT_WHATSAPP_NUMBER = '5534997693393';

export interface WhatsAppMessageOptions {
  name?: string;
  number?: string;
}

export function buildWhatsAppMessage(
  lines: CartLine[],
  options: Pick<WhatsAppMessageOptions, 'name'> = {},
): string {
  const rows = lines.map(
    (line) =>
      `• ${line.quantity}x ${line.product.name} — ${formatVolume(line.variant.volumeMl)} — ${formatBRL(line.totalCents)}`,
  );

  const total = lines.reduce((sum, line) => sum + line.totalCents, 0);
  const name = options.name?.trim();

  return [
    'Olá, Joice Rosa! Gostaria de fazer um pedido:',
    '',
    ...rows,
    '',
    `Total: ${formatBRL(total)}`,
    ...(name ? ['', `Nome: ${name}`] : []),
  ].join('\n');
}

export function buildWhatsAppUrl(
  lines: CartLine[],
  options: WhatsAppMessageOptions = {},
): string {
  const number = (options.number ?? DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, '');
  const message = buildWhatsAppMessage(lines, { name: options.name });

  return `https://wa.me/${number || DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
