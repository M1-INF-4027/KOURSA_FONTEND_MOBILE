/**
 * Koursa UI - Card Component
 * Composant carte personnalise avec variantes
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/spacing';

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
}

const getVariantStyles = (variant: CardVariant): ViewStyle => {
  switch (variant) {
    case 'elevated':
      return {
        backgroundColor: Colors.light,
        ...Shadows.md,
      };
    case 'outlined':
      return {
        backgroundColor: Colors.light,
        borderWidth: 1,
        borderColor: Colors.border.light,
      };
    case 'filled':
      return {
        backgroundColor: Colors.background.secondary,
      };
    default:
      return {
        backgroundColor: Colors.light,
        ...Shadows.sm,
      };
  }
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  onPress,
  style,
  padding = 'base',
}) => {
  const variantStyles = getVariantStyles(variant);

  const content = (
    <View
      style={[
        styles.container,
        variantStyles,
        { padding: Spacing[padding] },
        style,
      ]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// Card Header
interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerContent}>
        <View style={styles.headerText}>
          {title}
          {subtitle}
        </View>
        {action && <View style={styles.headerAction}>{action}</View>}
      </View>
    </View>
  );
};

// Card Content
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

// Card Footer
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

// Stat Card pour dashboard
interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = Colors.primary,
  onPress,
}) => {
  const content = (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      {icon && <View style={styles.statIcon}>{icon}</View>}
      <View style={styles.statContent}>
        <View style={styles.statValue}>
          <Text style={styles.statValueText}>{value}</Text>
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// Import Text pour StatCard
import { Text } from './Text';

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  header: {
    marginBottom: Spacing.sm,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  headerAction: {
    marginLeft: Spacing.sm,
  },
  content: {
    marginVertical: Spacing.xs,
  },
  footer: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  // Stat Card
  statCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
  statIcon: {
    marginRight: Spacing.md,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    marginBottom: Spacing.xs,
  },
  statValueText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.light,
    opacity: 0.9,
  },
});

export default Card;
