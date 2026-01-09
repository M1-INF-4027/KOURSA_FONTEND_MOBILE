/**
 * Koursa - Application Mobile
 * Systeme de gestion academique et de suivi pedagogique
 *
 * Couleurs: #0019A6, #131313, #4596F4, #F7B016, #FFFFFF
 * Police logo: Alfa Slab One
 */

import React from 'react';
import { StatusBar, useColorScheme, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from './src/contexts/AuthContext';
import { ToastProvider } from './src/components/ui/Toast';
import AppNavigator from './src/navigation/AppNavigator';
import { Colors } from './src/constants/colors';

// Ignorer certains warnings en dev
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

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
