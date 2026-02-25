/**
 * Koursa - App Navigator
 * Navigation principale de l'application
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Icon, Text, Avatar } from '../components/ui';

import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';

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
import NotificationsScreen from '../screens/notifications/NotificationsScreen';

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
  EditFiche: { ficheId: number };
  FicheDetail: { ficheId: number };
  Notifications: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator();

// Helper to check if user is Chef de Departement
const isChef = (user: any) => {
  return user?.roles?.some(
    (r: any) =>
      r.nom_role === 'Chef de Département' || r.nom_role === 'Chef de Departement'
  );
};

const isEnseignant = (user: any) => {
  return user?.roles?.some((r: any) => r.nom_role === 'Enseignant');
};

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
 * Main Stack Navigator (shared between Drawer and non-Drawer users)
 */
const MainStackNavigator = () => {
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
        name="EditFiche"
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
      <MainStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </MainStack.Navigator>
  );
};

/**
 * Custom Drawer Content for Chef de Departement
 */
const ChefDrawerContent = (props: DrawerContentComponentProps) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const getUserInitials = () => {
    const first = user?.first_name?.[0] || '';
    const last = user?.last_name?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  const navigateToTab = (tabName: string) => {
    props.navigation.closeDrawer();
    props.navigation.navigate('MainStack', {
      screen: 'MainTabs',
      params: { screen: tabName },
    });
  };

  const navigateToScreen = (screenName: string) => {
    props.navigation.closeDrawer();
    props.navigation.navigate('MainStack', { screen: screenName });
  };

  const DrawerItem = ({
    icon,
    label,
    onPress,
    badge,
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    badge?: number;
  }) => (
    <TouchableOpacity style={styles.drawerItem} activeOpacity={0.7} onPress={onPress}>
      <Icon name={icon} size={22} color={Colors.text.secondary} />
      <Text variant="body" style={styles.drawerItemLabel}>
        {label}
      </Text>
      {badge !== undefined && badge > 0 && (
        <View style={styles.drawerBadge}>
          <Text variant="caption" style={styles.drawerBadgeText}>
            {badge > 99 ? '99+' : badge}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <Avatar initials={getUserInitials()} size="lg" color={Colors.accent} />
        <View style={styles.drawerHeaderInfo}>
          <Text variant="label" style={styles.drawerUserName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text variant="caption" color="tertiary">
            {user?.email}
          </Text>
        </View>
      </View>

      {/* Section Chef de Departement */}
      <View style={styles.drawerSection}>
        <Text variant="caption" style={styles.drawerSectionTitle}>
          CHEF DE DEPARTEMENT
        </Text>
        <DrawerItem
          icon="view-dashboard-outline"
          label="Tableau de bord"
          onPress={() => navigateToTab('Dashboard')}
        />
        <DrawerItem
          icon="account-group-outline"
          label="Gestion utilisateurs"
          onPress={() => navigateToTab('Users')}
        />
        <DrawerItem
          icon="school-outline"
          label="Structure academique"
          onPress={() => navigateToTab('Academic')}
        />
      </View>

      {/* Section Enseignant (si aussi role Enseignant) */}
      {isEnseignant(user) && (
        <View style={styles.drawerSection}>
          <Text variant="caption" style={styles.drawerSectionTitle}>
            ENSEIGNANT
          </Text>
          <DrawerItem
            icon="file-document-outline"
            label="Mes fiches"
            onPress={() => navigateToTab('Fiches')}
          />
          <DrawerItem
            icon="bell-outline"
            label="Notifications"
            onPress={() => navigateToScreen('Notifications')}
            badge={unreadCount}
          />
        </View>
      )}

      {/* Divider + Actions */}
      <View style={styles.drawerDivider} />
      <DrawerItem
        icon="account-circle-outline"
        label="Profil"
        onPress={() => navigateToTab('Profile')}
      />
      <DrawerItem
        icon="logout"
        label="Deconnexion"
        onPress={logout}
      />
    </DrawerContentScrollView>
  );
};

/**
 * Drawer Navigator for Chef de Departement
 */
const ChefDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <ChefDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
        drawerStyle: {
          width: 280,
        },
      }}>
      <Drawer.Screen name="MainStack" component={MainStackNavigator} />
    </Drawer.Navigator>
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
  const { navigationRef } = useNotifications();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {isAuthenticated ? (
        isChef(user) ? <ChefDrawerNavigator /> : <MainStackNavigator />
      ) : (
        <AuthNavigator />
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
  // Drawer
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    marginBottom: Spacing.sm,
  },
  drawerHeaderInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  drawerUserName: {
    marginBottom: 2,
  },
  drawerSection: {
    paddingTop: Spacing.sm,
  },
  drawerSectionTitle: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    color: Colors.text.tertiary,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  drawerItemLabel: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  drawerBadge: {
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  drawerBadgeText: {
    color: Colors.light,
    fontSize: 11,
    fontWeight: '700',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.base,
  },
});

export default AppNavigator;
