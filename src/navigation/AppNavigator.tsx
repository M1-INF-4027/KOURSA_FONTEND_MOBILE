/**
 * Koursa - App Navigator
 * Navigation principale de l'application
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
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
  CreateFiche: undefined;
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
 */
const MainTabs = () => {
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
      <Tab.Screen
        name="Academic"
        component={AcademicScreen}
        options={{ title: 'Academique' }}
      />
      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{ title: 'Utilisateurs' }}
      />
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
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
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
});

export default AppNavigator;
