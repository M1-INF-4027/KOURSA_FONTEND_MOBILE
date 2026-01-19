/**
 * Koursa - useApi Hook
 * Hook personnalise pour les appels API avec gestion d'etat
 */

import { useState, useCallback } from 'react';
import { useToast } from '../components/ui';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
}

interface UseApiOptions {
  showErrorToast?: boolean;
}

/**
 * Hook pour gerer les appels API avec etat de chargement et erreurs
 */
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<{ data: T }>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { showErrorToast = true } = options;
  const { showError } = useToast();

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiFunction(...args);
        setState({ data: response.data, loading: false, error: null });
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          'Une erreur est survenue';

        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));

        if (showErrorToast) {
          showError(errorMessage);
        }

        return null;
      }
    },
    [apiFunction, showErrorToast, showError]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

/**
 * Hook pour les requetes avec chargement initial automatique
 */
export function useApiOnMount<T>(
  apiFunction: () => Promise<{ data: T }>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const api = useApi(apiFunction, options);

  // Note: L'appel initial doit etre fait dans un useEffect dans le composant
  // pour eviter les problemes de rendu

  return api;
}

export default useApi;
