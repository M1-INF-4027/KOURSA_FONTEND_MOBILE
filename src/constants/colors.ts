/**
 * Koursa Design System - Colors
 * Palette de couleurs officielle de l'application
 */

export const Colors = {
  // Couleurs principales de la marque
  primary: '#0019A6',      // Bleu foncé - Couleur principale
  secondary: '#4596F4',    // Bleu clair - Couleur secondaire
  accent: '#F7B016',       // Jaune/Orange - Couleur d'accent
  dark: '#131313',         // Noir - Texte et fonds sombres
  light: '#FFFFFF',        // Blanc - Fonds clairs

  // Variantes du primary
  primaryLight: '#1A3BC7',
  primaryDark: '#000D6B',
  primarySurface: '#E8EAFF',

  // Variantes du secondary
  secondaryLight: '#6DB5FF',
  secondaryDark: '#2A70C2',
  secondarySurface: '#E3F2FF',

  // Variantes de l'accent
  accentLight: '#FFD54F',
  accentDark: '#C78C00',
  accentSurface: '#FFF8E1',

  // Couleurs semantiques
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#059669',

  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorDark: '#DC2626',

  warning: '#F7B016',
  warningLight: '#FEF3C7',
  warningDark: '#D97706',

  info: '#4596F4',
  infoLight: '#DBEAFE',
  infoDark: '#2563EB',

  // Neutres
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Couleurs de fond
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F7FA',
    tertiary: '#E8EAFF',
    dark: '#131313',
    darkSecondary: '#1E1E1E',
  },

  // Couleurs de texte
  text: {
    primary: '#131313',
    secondary: '#525252',
    tertiary: '#737373',
    inverse: '#FFFFFF',
    link: '#4596F4',
    accent: '#F7B016',
  },

  // Couleurs de bordure
  border: {
    light: '#E5E5E5',
    medium: '#D4D4D4',
    dark: '#A3A3A3',
    focus: '#4596F4',
  },

  // Overlay
  overlay: {
    light: 'rgba(255, 255, 255, 0.9)',
    dark: 'rgba(19, 19, 19, 0.7)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },

  // Statuts des fiches
  status: {
    soumise: '#F7B016',
    validee: '#10B981',
    refusee: '#EF4444',
    enAttente: '#737373',
  },

  // Types de seances
  seance: {
    CM: '#0019A6',
    TD: '#4596F4',
    TP: '#F7B016',
  },

  // Roles
  roles: {
    superAdmin: '#EF4444',
    chefDepartement: '#7C3AED',
    enseignant: '#0019A6',
    delegue: '#10B981',
  },

  // Transparent
  transparent: 'transparent',
} as const;

// Theme sombre
export const DarkColors = {
  ...Colors,
  background: {
    primary: '#131313',
    secondary: '#1E1E1E',
    tertiary: '#262626',
    dark: '#0A0A0A',
    darkSecondary: '#171717',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A3A3A3',
    tertiary: '#737373',
    inverse: '#131313',
    link: '#6DB5FF',
    accent: '#FFD54F',
  },
  border: {
    light: '#404040',
    medium: '#525252',
    dark: '#737373',
    focus: '#6DB5FF',
  },
  primarySurface: '#1A1A3D',
  secondarySurface: '#1A2A3D',
  accentSurface: '#3D3A1A',
} as const;

export type ColorScheme = typeof Colors;
