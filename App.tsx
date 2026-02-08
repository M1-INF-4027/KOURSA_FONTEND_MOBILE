/**
 * Koursa - Application Mobile
 * Systeme de gestion academique et de suivi pedagogique
 *
 * Couleurs: #0019A6, #131313, #4596F4, #F7B016, #FFFFFF
 * Police logo: Alfa Slab One
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, LogBox, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';

import { AuthProvider } from './src/contexts/AuthContext';
import { ToastProvider } from './src/components/ui/Toast';
import AppNavigator from './src/navigation/AppNavigator';
import { Colors } from './src/constants/colors';
import { setBackgroundMessageHandler } from './src/services/NotificationService';

// Configurer le handler pour les messages en arriere-plan
setBackgroundMessageHandler();

// Ignorer certains warnings en dev
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Ecouter les notifications recues quand l'app est au premier plan
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const title = remoteMessage.notification?.title || 'Notification';
      const body = remoteMessage.notification?.body || '';
      Alert.alert(title, body);
    });
    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ToastProvider>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={Colors.primary}
              translucent
            />
            <AppNavigator />
          </ToastProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
