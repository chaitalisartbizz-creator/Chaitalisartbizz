import '@testing-library/jest-dom';
import { vi } from 'vitest';

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(element) {
    if (this.callback) {
      this.callback([{ isIntersecting: true, target: element }]);
    }
  }
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = MockIntersectionObserver;
