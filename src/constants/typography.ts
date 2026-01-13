/**
 * Koursa Design System - Typography
 * Systeme typographique de l'application
 */

import { TextStyle, Platform } from 'react-native';

// Font family selon la plateforme
const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

// Tailles de police
export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

// Poids de police
export const FontWeights = {
  thin: '100' as TextStyle['fontWeight'],
  light: '300' as TextStyle['fontWeight'],
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
  black: '900' as TextStyle['fontWeight'],
} as const;

// Hauteurs de ligne
export const LineHeights = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// Espacement des lettres
export const LetterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const;

// Styles de texte predefinies
export const Typography = {
  // Titres
  h1: {
    fontFamily,
    fontSize: FontSizes['4xl'],
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes['4xl'] * LineHeights.tight,
    letterSpacing: LetterSpacing.tight,
  } as TextStyle,

  h2: {
    fontFamily,
    fontSize: FontSizes['3xl'],
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes['3xl'] * LineHeights.tight,
    letterSpacing: LetterSpacing.tight,
  } as TextStyle,

  h3: {
    fontFamily,
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes['2xl'] * LineHeights.snug,
  } as TextStyle,

  h4: {
    fontFamily,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.xl * LineHeights.snug,
  } as TextStyle,

  h5: {
    fontFamily,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.lg * LineHeights.normal,
  } as TextStyle,

  h6: {
    fontFamily,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.base * LineHeights.normal,
  } as TextStyle,

  // Corps de texte
  bodyLarge: {
    fontFamily,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.lg * LineHeights.relaxed,
  } as TextStyle,

  body: {
    fontFamily,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.base * LineHeights.relaxed,
  } as TextStyle,

  bodySmall: {
    fontFamily,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.md * LineHeights.normal,
  } as TextStyle,

  // Labels
  labelLarge: {
    fontFamily,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.md * LineHeights.normal,
    letterSpacing: LetterSpacing.wide,
  } as TextStyle,

  label: {
    fontFamily,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.sm * LineHeights.normal,
    letterSpacing: LetterSpacing.wide,
  } as TextStyle,

  labelSmall: {
    fontFamily,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.xs * LineHeights.normal,
    letterSpacing: LetterSpacing.wider,
    textTransform: 'uppercase',
  } as TextStyle,

  // Caption
  caption: {
    fontFamily,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.sm * LineHeights.normal,
  } as TextStyle,

  // Boutons
  button: {
    fontFamily,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.base * LineHeights.normal,
    letterSpacing: LetterSpacing.wide,
  } as TextStyle,

  buttonSmall: {
    fontFamily,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.md * LineHeights.normal,
    letterSpacing: LetterSpacing.wide,
  } as TextStyle,
} as const;
