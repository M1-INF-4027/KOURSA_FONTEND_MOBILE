/**
 * Koursa UI - Chip & Badge Components
 * Composants pour les tags, badges et indicateurs
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { Text } from './Text';
import { Icon } from './Icon';

type ChipVariant = 'filled' | 'outlined';
type ChipColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  color?: ChipColor;
  icon?: string;
  onPress?: () => void;
  onDelete?: () => void;
  selected?: boolean;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

const getColorScheme = (color: ChipColor) => {
  const schemes = {
    primary: {
      bg: Colors.primarySurface,
      bgFilled: Colors.primary,
      text: Colors.primary,
      textFilled: Colors.light,
      border: Colors.primary,
    },
    secondary: {
      bg: Colors.secondarySurface,
      bgFilled: Colors.secondary,
      text: Colors.secondary,
      textFilled: Colors.light,
      border: Colors.secondary,
    },
    accent: {
      bg: Colors.accentSurface,
      bgFilled: Colors.accent,
      text: Colors.accentDark,
      textFilled: Colors.dark,
      border: Colors.accent,
    },
    success: {
      bg: Colors.successLight,
      bgFilled: Colors.success,
      text: Colors.successDark,
      textFilled: Colors.light,
      border: Colors.success,
    },
    warning: {
      bg: Colors.warningLight,
      bgFilled: Colors.warning,
      text: Colors.warningDark,
      textFilled: Colors.dark,
      border: Colors.warning,
    },
    error: {
      bg: Colors.errorLight,
      bgFilled: Colors.error,
      text: Colors.errorDark,
      textFilled: Colors.light,
      border: Colors.error,
    },
    neutral: {
      bg: Colors.gray[100],
      bgFilled: Colors.gray[600],
      text: Colors.gray[700],
      textFilled: Colors.light,
      border: Colors.gray[400],
    },
  };
  return schemes[color];
};

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'filled',
  color = 'primary',
  icon,
  onPress,
  onDelete,
  selected = false,
  size = 'medium',
  style,
}) => {
  const scheme = getColorScheme(color);
  const isFilled = variant === 'filled' || selected;

  const containerStyle: ViewStyle = {
    backgroundColor: isFilled ? scheme.bgFilled : scheme.bg,
    borderColor: scheme.border,
    borderWidth: variant === 'outlined' && !selected ? 1 : 0,
    height: size === 'small' ? 24 : 32,
    paddingHorizontal: size === 'small' ? Spacing.sm : Spacing.md,
  };

  const textColor = isFilled ? scheme.textFilled : scheme.text;
  const fontSize = size === 'small' ? 10 : 12;
  const iconSize = size === 'small' ? 12 : 16;

  const content = (
    <View style={[styles.chip, containerStyle, style]}>
      {icon && (
        <Icon
          name={icon}
          size={iconSize}
          color={textColor}
          style={styles.chipIcon}
        />
      )}
      <Text
        style={[
          styles.chipLabel,
          { color: textColor, fontSize },
        ]}>
        {label}
      </Text>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Icon name="close" size={iconSize} color={textColor} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// Badge pour notifications
interface BadgeProps {
  count?: number;
  dot?: boolean;
  color?: ChipColor;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  dot = false,
  color = 'error',
  children,
  style,
}) => {
  const scheme = getColorScheme(color);
  const showBadge = dot || (count !== undefined && count > 0);

  if (!showBadge) {
    return <>{children}</>;
  }

  const displayCount = count && count > 99 ? '99+' : count;

  return (
    <View style={[styles.badgeContainer, style]}>
      {children}
      <View
        style={[
          dot ? styles.badgeDot : styles.badge,
          { backgroundColor: scheme.bgFilled },
        ]}>
        {!dot && count !== undefined && (
          <Text style={styles.badgeText}>{displayCount}</Text>
        )}
      </View>
    </View>
  );
};

// Status Badge pour les fiches
interface StatusBadgeProps {
  status: 'SOUMISE' | 'VALIDEE' | 'REFUSEE';
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const statusConfig = {
    SOUMISE: { label: 'En attente', color: 'warning' as ChipColor, icon: 'clock-outline' },
    VALIDEE: { label: 'Validee', color: 'success' as ChipColor, icon: 'check-circle-outline' },
    REFUSEE: { label: 'Refusee', color: 'error' as ChipColor, icon: 'close-circle-outline' },
  };

  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={config.icon}
      size={size}
    />
  );
};

// Seance Type Badge
interface SeanceTypeBadgeProps {
  type: 'CM' | 'TD' | 'TP';
  size?: 'small' | 'medium';
}

export const SeanceTypeBadge: React.FC<SeanceTypeBadgeProps> = ({
  type,
  size = 'small',
}) => {
  const typeConfig = {
    CM: { label: 'CM', color: 'primary' as ChipColor },
    TD: { label: 'TD', color: 'secondary' as ChipColor },
    TP: { label: 'TP', color: 'accent' as ChipColor },
  };

  const config = typeConfig[type];

  return <Chip label={config.label} color={config.color} size={size} />;
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.full,
  },
  chipIcon: {
    marginRight: Spacing.xs,
  },
  chipLabel: {
    fontWeight: '600',
  },
  deleteButton: {
    marginLeft: Spacing.xs,
    padding: 2,
  },
  // Badge
  badgeContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    color: Colors.light,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Chip;
