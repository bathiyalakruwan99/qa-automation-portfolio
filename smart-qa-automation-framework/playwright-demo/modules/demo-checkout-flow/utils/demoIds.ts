export function uniqueOrderRef(prefix = 'ORD-DEMO'): string {
  const stamp = Date.now().toString().slice(-7);
  return `${prefix}-${stamp}`;
}

export function uniqueCartRef(prefix = 'CART-DEMO'): string {
  const stamp = Date.now().toString().slice(-7);
  return `${prefix}-${stamp}`;
}
