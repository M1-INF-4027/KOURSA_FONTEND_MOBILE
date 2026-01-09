/**
 * Koursa Design System - Spacing & Layout
 * Systeme d'espacement et de mise en page
 */

// Espacement de base (multiple de 4)
export const Spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
  '7xl': 96,
} as const;

// Rayons de bordure
export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  full: 9999,
} as const;

// Largeurs de bordure
export const BorderWidth = {
  none: 0,
  thin: 0.5,
  base: 1,
  medium: 1.5,
  thick: 2,
  heavy: 4,
} as const;

// Tailles d'icones
export const IconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  base: 24,
  lg: 28,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
} as const;

// Tailles d'avatar
export const AvatarSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  base: 48,
  lg: 56,
  xl: 64,
  '2xl': 80,
  '3xl': 96,
  '4xl': 128,
} as const;

// Hauteurs de composants
export const ComponentHeights = {
  inputSmall: 40,
  input: 48,
  inputLarge: 56,
  buttonSmall: 36,
  button: 48,
  buttonLarge: 56,
  header: 56,
  tabBar: 60,
  card: 'auto',
} as const;

// Ombres
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 16,
  },
} as const;

// Z-Index
export const ZIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
} as const;
