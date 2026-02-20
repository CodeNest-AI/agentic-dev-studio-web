/**
 * Shared test utilities and mocks for component tests.
 */
import { useWindowDimensions } from 'react-native';

// Default desktop dimensions for most tests
export const DESKTOP = { width: 1280, height: 900, scale: 1, fontScale: 1 };
export const MOBILE  = { width: 375,  height: 812, scale: 2, fontScale: 1 };
export const TABLET  = { width: 768,  height: 1024, scale: 2, fontScale: 1 };

/** Call inside beforeEach / it to simulate a screen size. */
export function mockDimensions(dims = DESKTOP) {
  (useWindowDimensions as jest.Mock).mockReturnValue(dims);
}

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => DESKTOP),
}));

// Silence noisy act() warnings in component render tests
jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
  if (typeof msg === 'string' && msg.includes('act(')) return;
  // eslint-disable-next-line no-console
  console.warn(msg, ...args);
});
