/**
 * Koursa UI - Container & Layout Components
 * Composants de mise en page edge-to-edge
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StatusBar,
  Platform,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

interface ScreenContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  statusBarColor?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
}

/**
 * Container principal pour les ecrans edge-to-edge
 */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  backgroundColor = Colors.background.primary,
  statusBarStyle = 'dark-content',
  statusBarColor,
  edges = ['top', 'bottom'],
  style,
}) => {
  const insets = useSafeAreaInsets();

  const paddingStyle: ViewStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return (
    <View style={[styles.screen, { backgroundColor }, paddingStyle, style]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarColor || backgroundColor}
        translucent={Platform.OS === 'android'}
      />
      {children}
    </View>
  );
};

interface ScrollContainerProps extends ScreenContainerProps {
  refreshing?: boolean;
  onRefresh?: () => void;
  contentPadding?: boolean;
}

/**
 * Container scrollable edge-to-edge
 */
export const ScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  backgroundColor = Colors.background.primary,
  statusBarStyle = 'dark-content',
  statusBarColor,
  edges = ['top'],
  refreshing,
  onRefresh,
  contentPadding = true,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarColor || backgroundColor}
        translucent={Platform.OS === 'android'}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          contentPadding && styles.scrollContent,
          {
            paddingTop: edges.includes('top') ? insets.top + Spacing.base : Spacing.base,
            paddingBottom: edges.includes('bottom') ? insets.bottom + Spacing.xl : Spacing.xl,
          },
          style,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing || false}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          ) : undefined
        }>
        {children}
      </ScrollView>
    </View>
  );
};

/**
 * Header personnalise edge-to-edge
 */
interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  backgroundColor?: string;
  transparent?: boolean;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  backgroundColor = Colors.primary,
  transparent = false,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const { Text } = require('./Text');

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + Spacing.sm,
          backgroundColor: transparent ? 'transparent' : backgroundColor,
        },
        style,
      ]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>{leftAction}</View>
        <View style={styles.headerCenter}>
          {title && (
            <Text
              variant="h5"
              style={[
                styles.headerTitle,
                { color: transparent ? Colors.text.primary : Colors.light },
              ]}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              variant="caption"
              style={[
                styles.headerSubtitle,
                { color: transparent ? Colors.text.secondary : Colors.light },
              ]}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.headerRight}>{rightAction}</View>
      </View>
    </View>
  );
};

/**
 * Section avec titre
 */
interface SectionProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Section: React.FC<SectionProps> = ({
  title,
  action,
  children,
  style,
}) => {
  const { Text } = require('./Text');

  return (
    <View style={[styles.section, style]}>
      {(title || action) && (
        <View style={styles.sectionHeader}>
          {title && (
            <Text variant="h6" style={styles.sectionTitle}>
              {title}
            </Text>
          )}
          {action && <View style={styles.sectionAction}>{action}</View>}
        </View>
      )}
      {children}
    </View>
  );
};

/**
 * Divider
 */
interface DividerProps {
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({ style }) => {
  return <View style={[styles.divider, style]} />;
};

/**
 * Spacer
 */
interface SpacerProps {
  size?: keyof typeof Spacing;
}

export const Spacer: React.FC<SpacerProps> = ({ size = 'base' }) => {
  return <View style={{ height: Spacing[size] }} />;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },
  // Header
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  headerLeft: {
    width: 48,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 48,
    alignItems: 'flex-end',
  },
  headerTitle: {
    textAlign: 'center',
  },
  headerSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  // Section
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    flex: 1,
  },
  sectionAction: {},
  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.md,
  },
});

export default ScreenContainer;
