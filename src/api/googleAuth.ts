import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import api from './config';
import { AuthTokenResponse } from '../types';

// Web Client ID depuis google-services.json (type 3 = web)
const WEB_CLIENT_ID = '248579793606-0k33616oncb75k24v04824suptcheov5.apps.googleusercontent.com';

/**
 * Configure Google Sign-In avec le webClientId Firebase.
 * A appeler une seule fois au demarrage de l'app.
 */
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
  });
};

/**
 * Lance le flow Google Sign-In natif, puis signe avec Firebase Auth.
 * Retourne le Firebase ID token + les infos utilisateur.
 */
export const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();

  if (!response.data?.idToken) {
    throw new Error('Impossible de recuperer le token Google.');
  }

  // Creer un credential Google pour Firebase
  const googleCredential = auth.GoogleAuthProvider.credential(response.data.idToken);

  // Signer avec Firebase Auth
  const firebaseUser = await auth().signInWithCredential(googleCredential);

  // Recuperer le Firebase ID token pour le backend (force refresh pour eviter les tokens expires)
  const firebaseIdToken = await firebaseUser.user.getIdToken(true);

  return {
    idToken: firebaseIdToken,
    email: firebaseUser.user.email || response.data.user.email,
    firstName: response.data.user.givenName || '',
    lastName: response.data.user.familyName || '',
  };
};

/**
 * Envoie le Firebase ID token au backend pour login (utilisateur existant).
 */
export const googleLogin = (idToken: string) =>
  api.post<AuthTokenResponse | { status: string; email: string; first_name: string; last_name: string }>(
    '/auth/google/',
    { id_token: idToken },
  );

/**
 * Envoie le Firebase ID token au backend pour inscription + login.
 */
export const googleRegister = (
  idToken: string,
  rolesIds: number[],
  niveauRepresente: number | null,
) =>
  api.post<AuthTokenResponse>('/auth/google/', {
    id_token: idToken,
    roles_ids: rolesIds,
    niveau_represente: niveauRepresente,
  });

/**
 * Deconnexion Google + Firebase (revoquer les sessions locales).
 */
export const googleSignOut = async () => {
  try {
    await GoogleSignin.signOut();
    await auth().signOut();
  } catch {
    // Ignorer les erreurs de sign out
  }
};
