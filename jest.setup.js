// Polyfill for Expo 53 winter runtime
global.__ExpoImportMetaRegistry = new Map();
global.__DEV__ = true;

// Default jsdom window to desktop width so RNW's useWindowDimensions returns desktop dims
Object.defineProperty(window, 'innerWidth',  { configurable: true, writable: true, value: 1280 });
Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 900 });
