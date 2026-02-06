// Types pour les utilisateurs
export interface Role {
  id: number;
  nom_role: string;
}

export type StatutCompte = 'EN_ATTENTE' | 'ACTIF' | 'INACTIF';

export interface Utilisateur {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  statut: StatutCompte;
  roles: Role[];
  niveau_represente: number | null;
}

// Types pour la structure academique
export interface Faculte {
  id: number;
  nom_faculte: string;
}

export interface Departement {
  id: number;
  nom_departement: string;
  faculte: number;
  nom_faculte: string;
  chef_departement: number | null;
  nom_chef: string | null;
}

export interface Filiere {
  id: number;
  nom_filiere: string;
  departement: number;
  nom_departement: string;
}

export interface Niveau {
  id: number;
  nom_niveau: string;
  filiere: number;
  nom_filiere: string;
}

// Types pour l'enseignement
export interface UniteEnseignement {
  id: number;
  code_ue: string;
  libelle_ue: string;
  semestre: number;
  enseignants: number[];
  niveaux: number[];
}

export type TypeSeance = 'CM' | 'TD' | 'TP';
export type StatutFiche = 'SOUMISE' | 'VALIDEE' | 'REFUSEE';

export interface FicheSuivi {
  id: number;
  ue: number;
  nom_ue: string;
  delegue: number | null;
  nom_delegue: string | null;
  enseignant: number | null;
  nom_enseignant: string | null;
  date_cours: string;
  heure_debut: string;
  heure_fin: string;
  duree: string;
  salle: string;
  type_seance: TypeSeance;
  titre_chapitre: string;
  contenu_aborde: string;
  statut: StatutFiche;
  motif_refus: string;
  date_soumission: string;
  date_validation: string | null;
}

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  access: string;
  refresh: string;
  user: Utilisateur;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  roles_ids: number[];
  niveau_represente?: number;
}

export interface AuthState {
  user: Utilisateur | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Types pour le dashboard
export interface DashboardStats {
  heures_validees_ce_mois: number;
  fiches_en_retard_de_validation: number;
  repartition_heures_par_ue_ce_mois: {
    code_ue: string;
    libelle_ue: string;
    heures_effectuees: number;
  }[];
}
