/**
 * Koursa - Card Components
 * Composants de cartes avec variantes
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { Colors } from '../../constants/colors';

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

const variantStyles: Record<CardVariant, ViewStyle> = {
  elevated: {
    backgroundColor: Colors.background.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outlined: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  filled: {
    backgroundColor: Colors.background.secondary,
  },
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  onPress,
  style,
  padding = 16,
}) => {
  const cardStyle = [
    styles.card,
    variantStyles[variant],
    { padding },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightContent?: React.ReactNode;
  style?: ViewStyle;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightContent,
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerLeft}>
        {leftIcon && (
          <View style={styles.headerIcon}>
            <Icon name={leftIcon} size={24} color={Colors.primary} />
          </View>
        )}
        <View style={styles.headerText}>
          <Text variant="h5" color="primary">
            {title}
          </Text>
          {subtitle && (
            <Text variant="caption" color="secondary" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightContent && <View style={styles.headerRight}>{rightContent}</View>}
    </View>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor?: string;
  iconBackgroundColor?: string;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  onPress?: () => void;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconColor = Colors.primary,
  iconBackgroundColor = Colors.primaryLight,
  subtitle,
  trend,
  onPress,
  style,
}) => {
  return (
    <Card variant="elevated" onPress={onPress} style={StyleSheet.flatten([styles.statCard, style])}>
      <View style={styles.statHeader}>
        <View
          style={[
            styles.statIconContainer,
            { backgroundColor: iconBackgroundColor },
          ]}
        >
          <Icon name={icon} size={24} color={iconColor} />
        </View>
        {trend && (
          <View
            style={[
              styles.trendBadge,
              {
                backgroundColor:
                  trend.direction === 'up' ? Colors.successLight : Colors.errorLight,
              },
            ]}
          >
            <Icon
              name={trend.direction === 'up' ? 'trending-up' : 'trending-down'}
              size={14}
              color={trend.direction === 'up' ? Colors.success : Colors.error}
            />
            <Text
              variant="caption"
              style={{
                color: trend.direction === 'up' ? Colors.success : Colors.error,
                marginLeft: 2,
              }}
            >
              {Math.abs(trend.value)}%
            </Text>
          </View>
        )}
      </View>
      <Text variant="h3" color="primary" style={styles.statValue}>
        {value}
      </Text>
      <Text variant="bodySmall" color="secondary">
        {title}
      </Text>
      {subtitle && (
        <Text variant="caption" color="tertiary" style={styles.statSubtitle}>
          {subtitle}
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 12,
  },
  subtitle: {
    marginTop: 2,
  },
  content: {
    marginVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  statCard: {
    minWidth: 150,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statValue: {
    marginBottom: 4,
  },
  statSubtitle: {
    marginTop: 4,
  },
});

export default Card;
