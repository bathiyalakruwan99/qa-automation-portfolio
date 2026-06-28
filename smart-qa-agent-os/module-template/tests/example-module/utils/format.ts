export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function parseCurrency(text: string): number {
  return parseFloat(text.replace(/[^0-9.]/g, ''));
}
