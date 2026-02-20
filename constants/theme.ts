export const Colors = {
  // Primary palette
  black:       '#000000',
  nearBlack:   '#0A0A0A',
  surface:     '#111111',
  surfaceHigh: '#1A1A1A',
  border:      '#222222',
  borderLight: '#333333',

  // Text
  white:       '#FFFFFF',
  textMuted:   '#9CA3AF',
  textDim:     '#6B7280',

  // Accent — cyan
  cyan:        '#06D6F0',
  cyanBright:  '#00EEFF',
  cyanDim:     '#0891B2',
  cyanGlow:    'rgba(6, 214, 240, 0.15)',
  cyanGlowMd:  'rgba(6, 214, 240, 0.08)',
};

export const Fonts = {
  sizes: {
    xs:   11,
    sm:   13,
    base: 15,
    lg:   18,
    xl:   22,
    '2xl': 28,
    '3xl': 36,
    '4xl': 48,
    '5xl': 64,
  },
  weights: {
    regular: '400' as const,
    medium:  '500' as const,
    semibold:'600' as const,
    bold:    '700' as const,
    black:   '900' as const,
  },
};

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  '5xl': 128,
};

export const Layout = {
  maxWidth: 1200,
  navHeight: 72,
};
