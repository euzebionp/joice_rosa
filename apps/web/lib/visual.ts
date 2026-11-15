import type { OlfactiveFamily } from '@joice/domain';

export const FAMILY_GRADIENTS: Record<OlfactiveFamily, string> = {
  FLORAL:
    'radial-gradient(circle at 18% 18%, #fbe4ee, transparent 55%), linear-gradient(145deg, #f3d4e2, #c98fb0)',
  AMADEIRADO:
    'radial-gradient(circle at 82% 16%, #e8d8bf, transparent 55%), linear-gradient(145deg, #d8c2a2, #8a6746)',
  ORIENTAL:
    'radial-gradient(circle at 24% 18%, #6b4166, transparent 55%), linear-gradient(145deg, #4a2a4c, #2a142f)',
  CITRICO:
    'radial-gradient(circle at 18% 18%, #fbf3b8, transparent 55%), linear-gradient(145deg, #efe29a, #b9c66a)',
  GOURMAND:
    'radial-gradient(circle at 82% 18%, #f6d9bf, transparent 55%), linear-gradient(145deg, #e6bd97, #a96545)',
  AROMATICO:
    'radial-gradient(circle at 18% 18%, #dff0e2, transparent 55%), linear-gradient(145deg, #c7e0cf, #719b7d)',
  FRUTADO:
    'radial-gradient(circle at 82% 18%, #ffd9d1, transparent 55%), linear-gradient(145deg, #f3b9a6, #c56a5a)',
  COURO:
    'radial-gradient(circle at 18% 18%, #d9c5b4, transparent 55%), linear-gradient(145deg, #b79a7f, #5e4231)',
};

export function familyGradient(family: OlfactiveFamily): string {
  return FAMILY_GRADIENTS[family] ?? FAMILY_GRADIENTS.ORIENTAL;
}
