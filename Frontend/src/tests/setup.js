import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup the DOM after each test
afterEach(() => {
  cleanup();
});

// Mock scrollIntoView since it's not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = function() {};
