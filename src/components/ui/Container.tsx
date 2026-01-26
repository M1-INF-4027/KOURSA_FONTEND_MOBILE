/**
 * Koursa - Container Components
 * Composants de mise en page et conteneurs
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from './Text';
import { Icon } from './Icon';
import { Colors } from '../../constants/colors';

interface ScreenContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  safeArea?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
  style?: ViewStyle;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  backgroundColor = Colors.background.primary,
  safeArea = true,
  statusBarStyle = 'dark-content',
  style,
}) => {
  const Container = safeArea ? SafeAreaView : View;

  return (
    <Container style={[styles.screen, { backgroundColor }, style]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      {children}
    </Container>
  );
};

interface ScrollContainerProps {
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
}

export const ScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  refreshing = false,
  onRefresh,
  contentContainerStyle,
  style,
  showsVerticalScrollIndicator = false,
}) => {
  return (
    <ScrollView
      style={[styles.scroll, style]}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
};

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  leftContent,
  rightContent,
  centerContent,
  transparent = false,
  style,
}) => {
  return (
    <View
      style={[
        styles.header,
        !transparent && styles.headerBackground,
        style,
      ]}
    >
      <View style={styles.headerLeft}>
        {leftContent}
        {!leftContent && leftIcon && (
          <TouchableOpacity
            onPress={onLeftPress}
            style={styles.headerButton}
            disabled={!onLeftPress}
          >
            <Icon
              name={leftIcon}
              size={24}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.headerCenter}>
        {centerContent}
        {!centerContent && title && (
          <View style={styles.headerTitleContainer}>
            <Text variant="h5" color="primary" numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text variant="caption" color="secondary" numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.headerRight}>
        {rightContent}
        {!rightContent && rightIcon && (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.headerButton}
            disabled={!onRightPress}
          >
            <Icon
              name={rightIcon}
              size={24}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

interface SectionProps {
  title?: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  rightContent,
  children,
  style,
}) => {
  return (
    <View style={[styles.section, style]}>
      {(title || rightContent) && (
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            {title && (
              <Text variant="h5" color="primary">
                {title}
              </Text>
            )}
            {subtitle && (
              <Text variant="caption" color="secondary" style={styles.sectionSubtitle}>
                {subtitle}
              </Text>
            )}
          </View>
          {rightContent}
        </View>
      )}
      {children}
    </View>
  );
};

interface DividerProps {
  vertical?: boolean;
  color?: string;
  thickness?: number;
  spacing?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  vertical = false,
  color = Colors.border.light,
  thickness = 1,
  spacing = 16,
  style,
}) => {
  const dividerStyle: ViewStyle = vertical
    ? {
        backgroundColor: color,
        width: thickness,
        marginHorizontal: spacing,
      }
    : {
        backgroundColor: color,
        height: thickness,
        marginVertical: spacing,
      };

  return (
    <View
      style={[
        vertical ? styles.verticalDivider : styles.horizontalDivider,
        dividerStyle,
        style,
      ]}
    />
  );
};

interface SpacerProps {
  size?: number;
  horizontal?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 16,
  horizontal = false,
}) => {
  return (
    <View
      style={{
        [horizontal ? 'width' : 'height']: size,
      }}
    />
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 8,
  },
  headerBackground: {
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  headerLeft: {
    width: 56,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 56,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerButton: {
    padding: 8,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionSubtitle: {
    marginTop: 2,
  },
  horizontalDivider: {
    width: '100%',
  },
  verticalDivider: {
    alignSelf: 'stretch',
  },
});

export default ScreenContainer;
