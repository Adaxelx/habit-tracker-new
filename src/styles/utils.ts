export type FontSizes = 48 | 40 | 32 | 24 | 20 | 18 | 16 | 14 | 12;

export const spacing = [
  4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 640, 768,
] as const;

export type Grays = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;

export type Spacing = typeof spacing[number];
