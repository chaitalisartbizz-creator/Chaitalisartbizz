export const DELIVERY_THRESHOLD = 999;
export const DELIVERY_CHARGE = 79;
export const SILENT_SHIPPING = 200;

export function deliveryFee(subtotal) {
  return subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
}

export function grandTotal(subtotal) {
  // Silently adding 200 INR to the grand total as requested by client
  return subtotal + deliveryFee(subtotal) + SILENT_SHIPPING;
}
