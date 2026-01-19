import api from './config';
import {
  Utilisateur,
  Role,
  Faculte,
  Departement,
  Filiere,
  Niveau,
  UniteEnseignement,
  FicheSuivi,
  RegisterData,
  LoginCredentials,
  AuthTokenResponse,
  DashboardStats,
} from '../types';

// ==================== AUTH ====================
export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthTokenResponse>('/auth/token/', credentials),

  refreshToken: (refreshToken: string) =>
    api.post<{ access: string }>('/auth/token/refresh/', { refresh: refreshToken }),

  confirmPassword: (password: string) =>
    api.post<{ validation_token: string }>('/users/utilisateurs/confirm-password/', { password }),

  registerFcmToken: (fcmToken: string) =>
    api.post('/users/utilisateurs/register-fcm-token/', { fcm_token: fcmToken }),
};

// ==================== DASHBOARD ====================
export const dashboardService = {
  getRoot: () => api.get('/dashboard/'),

  getStats: () => api.get<DashboardStats>('/dashboard/stats/'),

  exportHeures: (annee?: number, mois?: number) => {
    const params = new URLSearchParams();
    if (annee) params.append('annee', annee.toString());
    if (mois) params.append('mois', mois.toString());
    return api.get(`/dashboard/export-heures/?${params.toString()}`, {
      responseType: 'blob',
    });
  },
};

// ==================== USERS ====================
export const usersService = {
  getAll: () => api.get<Utilisateur[]>('/users/utilisateurs/'),
  getById: (id: number) => api.get<Utilisateur>(`/users/utilisateurs/${id}/`),
  create: (data: RegisterData) => api.post<Utilisateur>('/users/utilisateurs/', data),
  update: (id: number, data: Partial<Utilisateur>) =>
    api.patch<Utilisateur>(`/users/utilisateurs/${id}/`, data),
  delete: (id: number) => api.delete(`/users/utilisateurs/${id}/`),
};

export const rolesService = {
  getAll: () => api.get<Role[]>('/users/roles/'),
  getById: (id: number) => api.get<Role>(`/users/roles/${id}/`),
};

// ==================== ACADEMIC ====================
export const facultesService = {
  getAll: () => api.get<Faculte[]>('/academic/facultes/'),
  getById: (id: number) => api.get<Faculte>(`/academic/facultes/${id}/`),
  create: (data: Partial<Faculte>) => api.post<Faculte>('/academic/facultes/', data),
  update: (id: number, data: Partial<Faculte>) =>
    api.patch<Faculte>(`/academic/facultes/${id}/`, data),
  delete: (id: number) => api.delete(`/academic/facultes/${id}/`),
};

export const departementsService = {
  getAll: () => api.get<Departement[]>('/academic/departements/'),
  getById: (id: number) => api.get<Departement>(`/academic/departements/${id}/`),
  create: (data: Partial<Departement>) =>
    api.post<Departement>('/academic/departements/', data),
  update: (id: number, data: Partial<Departement>) =>
    api.patch<Departement>(`/academic/departements/${id}/`, data),
  delete: (id: number) => api.delete(`/academic/departements/${id}/`),
};

export const filieresService = {
  getAll: () => api.get<Filiere[]>('/academic/filieres/'),
  getById: (id: number) => api.get<Filiere>(`/academic/filieres/${id}/`),
  create: (data: Partial<Filiere>) => api.post<Filiere>('/academic/filieres/', data),
  update: (id: number, data: Partial<Filiere>) =>
    api.patch<Filiere>(`/academic/filieres/${id}/`, data),
  delete: (id: number) => api.delete(`/academic/filieres/${id}/`),
};

export const niveauxService = {
  getAll: () => api.get<Niveau[]>('/academic/niveaux/'),
  getById: (id: number) => api.get<Niveau>(`/academic/niveaux/${id}/`),
  create: (data: Partial<Niveau>) => api.post<Niveau>('/academic/niveaux/', data),
  update: (id: number, data: Partial<Niveau>) =>
    api.patch<Niveau>(`/academic/niveaux/${id}/`, data),
  delete: (id: number) => api.delete(`/academic/niveaux/${id}/`),
};

// ==================== TEACHING ====================
export const unitesEnseignementService = {
  getAll: () => api.get<UniteEnseignement[]>('/teaching/unites-enseignement/'),
  getById: (id: number) =>
    api.get<UniteEnseignement>(`/teaching/unites-enseignement/${id}/`),
  create: (data: Partial<UniteEnseignement>) =>
    api.post<UniteEnseignement>('/teaching/unites-enseignement/', data),
  update: (id: number, data: Partial<UniteEnseignement>) =>
    api.patch<UniteEnseignement>(`/teaching/unites-enseignement/${id}/`, data),
  delete: (id: number) => api.delete(`/teaching/unites-enseignement/${id}/`),
};

export const fichesSuiviService = {
  getAll: () => api.get<FicheSuivi[]>('/teaching/fiches-suivi/'),
  getById: (id: number) => api.get<FicheSuivi>(`/teaching/fiches-suivi/${id}/`),
  create: (data: Partial<FicheSuivi>) =>
    api.post<FicheSuivi>('/teaching/fiches-suivi/', data),
  update: (id: number, data: Partial<FicheSuivi>) =>
    api.patch<FicheSuivi>(`/teaching/fiches-suivi/${id}/`, data),
  delete: (id: number) => api.delete(`/teaching/fiches-suivi/${id}/`),
  // Actions specifiques
  getEnAttente: () => api.get<FicheSuivi[]>('/teaching/fiches-suivi/en-attente/'),
  valider: (id: number) => api.post<FicheSuivi>(`/teaching/fiches-suivi/${id}/valider/`),
  refuser: (id: number, motif: string) =>
    api.post<FicheSuivi>(`/teaching/fiches-suivi/${id}/refuser/`, { motif_refus: motif }),
};
