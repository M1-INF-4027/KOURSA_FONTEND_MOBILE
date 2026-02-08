/**
 * Koursa - App Navigator
 * Navigation principale de l'application
 */

import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '../components/ui';

import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/colors';
import { Text } from '../components/ui';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import FichesListScreen from '../screens/fiches/FichesListScreen';
import CreateFicheScreen from '../screens/fiches/CreateFicheScreen';
import FicheDetailScreen from '../screens/fiches/FicheDetailScreen';
import AcademicScreen from '../screens/academic/AcademicScreen';
import UsersScreen from '../screens/users/UsersScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Types de navigation
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Fiches: undefined;
  Academic: undefined;
  Users: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  CreateFiche: { ficheId?: number } | undefined;
  FicheDetail: { ficheId: number };
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Navigation pour les utilisateurs non authentifies
 */
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};


/**
 * Tabs pour les utilisateurs authentifies
 * Les onglets affiches dependent du role de l'utilisateur
 */
const MainTabs = () => {
  const { user } = useAuth();

  const isAdmin = user?.roles.some(
    (r) => r.nom_role === 'Super Administrateur' || r.nom_role === 'Chef de Département'
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
              break;
            case 'Fiches':
              iconName = focused ? 'file-document' : 'file-document-outline';
              break;
            case 'Academic':
              iconName = focused ? 'school' : 'school-outline';
              break;
            case 'Users':
              iconName = focused ? 'account-group' : 'account-group-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account-circle' : 'account-circle-outline';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Accueil' }}
      />
      <Tab.Screen
        name="Fiches"
        component={FichesListScreen}
        options={{ title: 'Fiches' }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Academic"
          component={AcademicScreen}
          options={{ title: 'Académique' }}
        />
      )}
      {isAdmin && (
        <Tab.Screen
          name="Users"
          component={UsersScreen}
          options={{ title: 'Utilisateurs' }}
        />
      )}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

/**
 * Navigation principale avec Stack pour les ecrans modaux
 */
const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <MainStack.Screen
        name="MainTabs"
        component={MainTabs}
      />
      <MainStack.Screen
        name="CreateFiche"
        component={CreateFicheScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      <MainStack.Screen
        name="FicheDetail"
        component={FicheDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </MainStack.Navigator>
  );
};

/**
 * Ecran d'attente d'approbation pour les comptes EN_ATTENTE
 */
const PendingApprovalScreen = () => {
  const { logout, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUser();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.pendingContainer}>
      <View style={styles.pendingCard}>
        <View style={styles.pendingIconContainer}>
          <Icon name="clock-outline" size={64} color={Colors.accent} />
        </View>
        <Text variant="h4" color="primary" style={styles.pendingTitle}>
          Compte en attente
        </Text>
        <Text variant="body" color="secondary" style={styles.pendingMessage}>
          Votre compte est en cours de validation par le chef de departement.
          Vous serez notifie une fois votre compte approuve.
        </Text>
        <TouchableOpacity
          style={styles.pendingRefreshButton}
          onPress={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <ActivityIndicator color={Colors.light} size="small" />
          ) : (
            <>
              <Icon name="refresh" size={20} color={Colors.light} />
              <Text variant="button" color="inverse" style={styles.pendingButtonText}>
                Rafraichir le statut
              </Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.pendingLogoutButton}
          onPress={logout}
        >
          <Icon name="logout" size={20} color={Colors.error} />
          <Text variant="button" color="error" style={styles.pendingButtonText}>
            Se deconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Ecran de chargement
 */
const LoadingScreen = () => {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingLogo}>
        <Text style={styles.loadingLogoText}>K</Text>
      </View>
      <ActivityIndicator size="large" color={Colors.light} style={styles.loadingIndicator} />
    </View>
  );
};

/**
 * Navigateur racine
 */
const AppNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const isPending = isAuthenticated && user?.statut === 'EN_ATTENTE';

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : isPending ? (
        <PendingApprovalScreen />
      ) : (
        <MainNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  // Tab Bar
  tabBar: {
    backgroundColor: Colors.light,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: 8,
    paddingBottom: 8,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  loadingLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingLogoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  loadingIndicator: {
    marginTop: 16,
  },
  // Pending Approval
  pendingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: 24,
  },
  pendingCard: {
    backgroundColor: Colors.light,
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pendingIconContainer: {
    marginBottom: 24,
  },
  pendingTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  pendingMessage: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  pendingRefreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  pendingLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.errorLight,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  pendingButtonText: {
    marginLeft: 8,
  },
});

export default AppNavigator;
