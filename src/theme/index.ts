import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Couleurs personnalisees pour Koursa
const koursaColors = {
  primary: '#1E88E5',      // Bleu principal
  secondary: '#26A69A',    // Vert-bleu secondaire
  tertiary: '#7E57C2',     // Violet pour accents
  error: '#E53935',        // Rouge erreur
  success: '#43A047',      // Vert succes
  warning: '#FB8C00',      // Orange avertissement
  info: '#039BE5',         // Bleu info
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: koursaColors.primary,
    secondary: koursaColors.secondary,
    tertiary: koursaColors.tertiary,
    error: koursaColors.error,
    // Couleurs de surface
    background: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceVariant: '#E3F2FD',
    // Couleurs de texte
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#212121',
    onSurface: '#212121',
  },
  roundness: 12,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: koursaColors.primary,
    secondary: koursaColors.secondary,
    tertiary: koursaColors.tertiary,
    error: koursaColors.error,
    // Couleurs de surface
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#1A237E',
    // Couleurs de texte
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#FAFAFA',
    onSurface: '#FAFAFA',
  },
  roundness: 12,
};

// Couleurs utilitaires pour les statuts
export const statusColors = {
  soumise: '#FB8C00',    // Orange - En attente
  validee: '#43A047',    // Vert - Validee
  refusee: '#E53935',    // Rouge - Refusee
  en_attente: '#9E9E9E', // Gris - En attente compte
  actif: '#43A047',      // Vert - Actif
  inactif: '#E53935',    // Rouge - Inactif
};

// Couleurs pour les types de seance
export const seanceColors = {
  CM: '#1E88E5',  // Bleu - Cours Magistral
  TD: '#26A69A',  // Vert - Travaux Diriges
  TP: '#7E57C2',  // Violet - Travaux Pratiques
};

// Couleurs pour les roles
export const roleColors = {
  'Super Administrateur': '#E53935',
  'Chef de Departement': '#7E57C2',
  'Enseignant': '#1E88E5',
  'Delegue': '#26A69A',
};
