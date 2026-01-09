/**
 * Koursa - useRefresh Hook
 * Hook pour gerer le pull-to-refresh
 */

import { useState, useCallback } from 'react';

interface UseRefreshReturn {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
}

/**
 * Hook pour gerer le pull-to-refresh
 * @param refreshFunction La fonction a executer lors du refresh
 * @returns L'etat de rafraichissement et la fonction de refresh
 */
export function useRefresh(
  refreshFunction: () => Promise<void>
): UseRefreshReturn {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshFunction();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshFunction]);

  return {
    refreshing,
    onRefresh,
  };
}

/**
 * Hook pour gerer plusieurs sources de refresh
 */
export function useMultiRefresh(
  refreshFunctions: Array<() => Promise<void>>
): UseRefreshReturn {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(refreshFunctions.map((fn) => fn()));
    } catch (error) {
      console.error('Multi-refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshFunctions]);

  return {
    refreshing,
    onRefresh,
  };
}

export default useRefresh;
