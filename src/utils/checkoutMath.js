export const DELIVERY_THRESHOLD = Infinity; // No free shipping
export const DELIVERY_CHARGE = 300;
export const SILENT_SHIPPING = 0; // Removed silent shipping

export function deliveryFee(subtotal) {
  return DELIVERY_CHARGE;
}

export function grandTotal(subtotal) {
  return subtotal + deliveryFee(subtotal) + SILENT_SHIPPING;
}
