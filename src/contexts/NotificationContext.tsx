import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Platform, AppState } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainerRef } from '@react-navigation/native';
import { useAuth } from './AuthContext';
import { fcmService } from '../api/services';
import { notificationsService } from '../api/notifications';

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  navigationRef: React.RefObject<NavigationContainerRef<any> | null>;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  refreshUnreadCount: async () => {},
  navigationRef: { current: null },
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const navigationRef = useRef<NavigationContainerRef<any> | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const response = await notificationsService.getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch {
      // Silently fail
    }
  }, []);

  const navigateToFiche = useCallback((ficheId: string | number) => {
    const nav = navigationRef.current;
    if (nav && ficheId) {
      (nav as any).navigate('FicheDetail', { ficheId: Number(ficheId) });
    }
  }, []);

  const registerFCMToken = useCallback(async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        if (token) {
          await fcmService.registerToken(token);
        }
      }
    } catch (error) {
      console.warn('FCM token registration failed:', error);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    // Register FCM token
    registerFCMToken();

    // Listen for token refresh
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
      try {
        await fcmService.registerToken(token);
      } catch {
        // Silently fail
      }
    });

    // Foreground message handler
    const unsubscribeMessage = messaging().onMessage(async () => {
      setUnreadCount((prev) => prev + 1);
    });

    // Background tap handler
    const unsubscribeNotificationOpen = messaging().onNotificationOpenedApp((remoteMessage) => {
      const data = remoteMessage.data;
      if (data?.related_object_id && data?.type !== 'COMPTE_APPROUVE') {
        setTimeout(() => navigateToFiche(data.related_object_id as string), 500);
      }
    });

    // App killed tap handler
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage?.data?.related_object_id && remoteMessage.data.type !== 'COMPTE_APPROUVE') {
          setTimeout(() => navigateToFiche(remoteMessage.data!.related_object_id as string), 1000);
        }
      });

    // Initial fetch
    refreshUnreadCount();

    // Polling every 30s
    pollingRef.current = setInterval(refreshUnreadCount, 30000);

    // Refresh on app foreground
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        refreshUnreadCount();
      }
    });

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeMessage();
      unsubscribeNotificationOpen();
      appStateSubscription.remove();
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isAuthenticated, registerFCMToken, refreshUnreadCount, navigateToFiche]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount, navigationRef }}>
      {children}
    </NotificationContext.Provider>
  );
};
