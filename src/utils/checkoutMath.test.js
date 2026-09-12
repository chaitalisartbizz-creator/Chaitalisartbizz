import { describe, it, expect } from 'vitest';
import { deliveryFee, grandTotal, DELIVERY_THRESHOLD, DELIVERY_CHARGE, SILENT_SHIPPING } from './checkoutMath';

describe('Checkout Math', () => {
  it('should charge delivery fee when subtotal is below threshold', () => {
    expect(deliveryFee(500)).toBe(DELIVERY_CHARGE);
    expect(deliveryFee(DELIVERY_THRESHOLD - 1)).toBe(DELIVERY_CHARGE);
  });

  it('should wave delivery fee when subtotal is at or above threshold', () => {
    expect(deliveryFee(DELIVERY_THRESHOLD)).toBe(0);
    expect(deliveryFee(1500)).toBe(0);
  });

  it('should silently add SILENT_SHIPPING to the grand total', () => {
    // 500 subtotal + 79 delivery + 200 silent = 779
    expect(grandTotal(500)).toBe(500 + DELIVERY_CHARGE + SILENT_SHIPPING);
    
    // 1000 subtotal + 0 delivery + 200 silent = 1200
    expect(grandTotal(1000)).toBe(1000 + 0 + SILENT_SHIPPING);
  });
});
