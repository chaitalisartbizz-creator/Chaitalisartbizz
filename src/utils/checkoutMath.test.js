import { describe, it, expect } from 'vitest';
import { deliveryFee, grandTotal, DELIVERY_CHARGE } from './checkoutMath';

describe('Checkout Math', () => {
  it('should always charge delivery fee', () => {
    expect(deliveryFee(500)).toBe(DELIVERY_CHARGE);
    expect(deliveryFee(1500)).toBe(DELIVERY_CHARGE); // No free shipping
  });

  it('should calculate grand total correctly', () => {
    // 500 subtotal + 300 delivery = 800
    expect(grandTotal(500)).toBe(500 + DELIVERY_CHARGE);
    
    // 1000 subtotal + 300 delivery = 1300
    expect(grandTotal(1000)).toBe(1000 + DELIVERY_CHARGE);
  });
});
