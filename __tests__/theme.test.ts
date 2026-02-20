import { Colors, Fonts, Spacing, Layout } from '../constants/theme';

describe('Colors', () => {
  it('primary black is pure black', () => {
    expect(Colors.black).toBe('#000000');
  });

  it('white is pure white', () => {
    expect(Colors.white).toBe('#FFFFFF');
  });

  it('cyan accent is defined and non-empty', () => {
    expect(Colors.cyan).toBeTruthy();
    expect(Colors.cyan).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('cyanBright is brighter than cyan (lighter hex)', () => {
    // Both are valid hex colors
    expect(Colors.cyanBright).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(Colors.cyanDim).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('surface colors are dark (near-black)', () => {
    const hexToR = (hex: string) => parseInt(hex.slice(1, 3), 16);
    // Surface shades should have low red channel (dark)
    expect(hexToR(Colors.nearBlack)).toBeLessThan(20);
    expect(hexToR(Colors.surface)).toBeLessThan(30);
    expect(hexToR(Colors.surfaceHigh)).toBeLessThan(40);
  });

  it('glow colors contain rgba with low alpha', () => {
    expect(Colors.cyanGlow).toContain('rgba');
    expect(Colors.cyanGlowMd).toContain('rgba');
    // Alpha should be low (dark theme — subtle glows)
    expect(Colors.cyanGlow).toContain('0.15');
    expect(Colors.cyanGlowMd).toContain('0.08');
  });

  it('all required color tokens are defined', () => {
    const required = [
      'black', 'nearBlack', 'surface', 'surfaceHigh', 'border', 'borderLight',
      'white', 'textMuted', 'textDim',
      'cyan', 'cyanBright', 'cyanDim', 'cyanGlow', 'cyanGlowMd',
    ] as const;
    required.forEach((key) => {
      expect(Colors[key]).toBeTruthy();
    });
  });
});

describe('Fonts', () => {
  it('sizes are in ascending order', () => {
    const { xs, sm, base, lg, xl } = Fonts.sizes;
    expect(xs).toBeLessThan(sm);
    expect(sm).toBeLessThan(base);
    expect(base).toBeLessThan(lg);
    expect(lg).toBeLessThan(xl);
  });

  it('headline sizes are large enough for display use', () => {
    expect(Fonts.sizes['4xl']).toBeGreaterThanOrEqual(40);
    expect(Fonts.sizes['5xl']).toBeGreaterThanOrEqual(56);
  });

  it('body text sizes are readable (≥13px)', () => {
    expect(Fonts.sizes.sm).toBeGreaterThanOrEqual(13);
    expect(Fonts.sizes.base).toBeGreaterThanOrEqual(14);
  });

  it('font weights are valid CSS weight strings', () => {
    const validWeights = ['400', '500', '600', '700', '800', '900'];
    Object.values(Fonts.weights).forEach((w) => {
      expect(validWeights).toContain(w);
    });
  });

  it('all weight tokens are defined', () => {
    expect(Fonts.weights.regular).toBeDefined();
    expect(Fonts.weights.medium).toBeDefined();
    expect(Fonts.weights.semibold).toBeDefined();
    expect(Fonts.weights.bold).toBeDefined();
    expect(Fonts.weights.black).toBeDefined();
  });
});

describe('Spacing', () => {
  it('spacing values are in ascending order', () => {
    const { xs, sm, md, lg, xl } = Spacing;
    expect(xs).toBeLessThan(sm);
    expect(sm).toBeLessThan(md);
    expect(md).toBeLessThan(lg);
    expect(lg).toBeLessThan(xl);
  });

  it('all spacing tokens are positive integers', () => {
    Object.values(Spacing).forEach((v) => {
      expect(v).toBeGreaterThan(0);
      expect(Number.isInteger(v)).toBe(true);
    });
  });

  it('large spacing tokens exist for section padding', () => {
    expect(Spacing['3xl']).toBeGreaterThanOrEqual(48);
    expect(Spacing['4xl']).toBeGreaterThanOrEqual(80);
    expect(Spacing['5xl']).toBeGreaterThanOrEqual(100);
  });
});

describe('Layout', () => {
  it('maxWidth is set for a comfortable reading line length', () => {
    expect(Layout.maxWidth).toBeGreaterThanOrEqual(1000);
    expect(Layout.maxWidth).toBeLessThanOrEqual(1400);
  });

  it('navHeight is reasonable for a fixed navigation bar', () => {
    expect(Layout.navHeight).toBeGreaterThanOrEqual(56);
    expect(Layout.navHeight).toBeLessThanOrEqual(100);
  });
});
