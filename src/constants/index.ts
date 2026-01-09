/**
 * Koursa Design System - Constants
 * Export centralise de toutes les constantes
 */

export * from './colors';
export * from './typography';
export * from './spacing';

// Configuration de l'application
export const AppConfig = {
  name: 'Koursa',
  version: '1.0.0',
  apiTimeout: 10000,
  maxRetries: 3,
} as const;

// Messages d'erreur
export const ErrorMessages = {
  network: 'Erreur de connexion. Verifiez votre connexion internet.',
  server: 'Erreur serveur. Veuillez reessayer plus tard.',
  unauthorized: 'Session expiree. Veuillez vous reconnecter.',
  validation: 'Veuillez verifier les informations saisies.',
  unknown: 'Une erreur inattendue s\'est produite.',
} as const;

// Messages de succes
export const SuccessMessages = {
  login: 'Connexion reussie !',
  register: 'Inscription reussie !',
  ficheCreated: 'Fiche de suivi creee avec succes.',
  ficheValidated: 'Fiche validee avec succes.',
  ficheRefused: 'Fiche refusee.',
  saved: 'Modifications enregistrees.',
  deleted: 'Element supprime avec succes.',
} as const;

// Labels des statuts
export const StatusLabels = {
  SOUMISE: 'En attente',
  VALIDEE: 'Validee',
  REFUSEE: 'Refusee',
  EN_ATTENTE: 'En attente',
  ACTIF: 'Actif',
  INACTIF: 'Inactif',
} as const;

// Labels des types de seance
export const SeanceLabels = {
  CM: 'Cours Magistral',
  TD: 'Travaux Diriges',
  TP: 'Travaux Pratiques',
} as const;

// Labels des roles
export const RoleLabels = {
  'Super Administrateur': 'Super Admin',
  'Chef de Departement': 'Chef Dept.',
  'Enseignant': 'Enseignant',
  'Delegue': 'Delegue',
} as const;
