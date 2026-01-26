/**
 * Koursa - Chip Components
 * Composants de chips, badges et indicateurs de statut
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

type ChipVariant = 'filled' | 'outlined';
type ChipColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  color?: ChipColor;
  icon?: string;
  onPress?: () => void;
  onDelete?: () => void;
  selected?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const chipColors: Record<ChipColor, { bg: string; bgLight: string; text: string }> = {
  primary: {
    bg: Colors.primary,
    bgLight: Colors.primaryLight,
    text: Colors.primary,
  },
  secondary: {
    bg: Colors.secondary,
    bgLight: Colors.secondaryLight,
    text: Colors.secondary,
  },
  success: {
    bg: Colors.success,
    bgLight: Colors.successLight,
    text: Colors.success,
  },
  warning: {
    bg: Colors.warning,
    bgLight: Colors.warningLight,
    text: Colors.warning,
  },
  error: {
    bg: Colors.error,
    bgLight: Colors.errorLight,
    text: Colors.error,
  },
  info: {
    bg: Colors.info,
    bgLight: Colors.infoLight,
    text: Colors.info,
  },
};

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'filled',
  color = 'primary',
  icon,
  onPress,
  onDelete,
  selected = false,
  disabled = false,
  style,
}) => {
  const colorConfig = chipColors[color];
  const isOutlined = variant === 'outlined';

  const backgroundColor = selected
    ? colorConfig.bg
    : isOutlined
    ? 'transparent'
    : colorConfig.bgLight;

  const textColor = selected
    ? Colors.text.inverse
    : colorConfig.text;

  const borderColor = isOutlined ? colorConfig.bg : 'transparent';

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.chip,
        {
          backgroundColor,
          borderColor,
          borderWidth: isOutlined ? 1 : 0,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          size={16}
          color={textColor}
          style={styles.chipIcon}
        />
      )}
      <Text variant="caption" style={{ color: textColor, fontWeight: '500' }}>
        {label}
      </Text>
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          disabled={disabled}
          style={styles.deleteButton}
        >
          <Icon name="close" size={14} color={textColor} />
        </TouchableOpacity>
      )}
    </Container>
  );
};

interface BadgeProps {
  count?: number;
  maxCount?: number;
  dot?: boolean;
  color?: ChipColor;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  maxCount = 99,
  dot = false,
  color = 'error',
  style,
}) => {
  const colorConfig = chipColors[color];

  if (dot) {
    return (
      <View
        style={[
          styles.badgeDot,
          { backgroundColor: colorConfig.bg },
          style,
        ]}
      />
    );
  }

  if (count === undefined || count === 0) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colorConfig.bg },
        style,
      ]}
    >
      <Text
        variant="caption"
        style={styles.badgeText}
      >
        {displayCount}
      </Text>
    </View>
  );
};

type FicheStatus = 'brouillon' | 'en_attente' | 'validee' | 'refusee';

interface StatusBadgeProps {
  status: FicheStatus;
  style?: ViewStyle;
}

const statusConfig: Record<FicheStatus, { label: string; color: ChipColor; icon: string }> = {
  brouillon: {
    label: 'Brouillon',
    color: 'secondary',
    icon: 'pencil',
  },
  en_attente: {
    label: 'En attente',
    color: 'warning',
    icon: 'clock',
  },
  validee: {
    label: 'Validée',
    color: 'success',
    icon: 'check-circle',
  },
  refusee: {
    label: 'Refusée',
    color: 'error',
    icon: 'close-circle',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  style,
}) => {
  const config = statusConfig[status];
  if (!config) return null;

  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={config.icon}
      variant="filled"
      style={style}
    />
  );
};

type SeanceType = 'CM' | 'TD' | 'TP' | 'EXAMEN' | 'RATTRAPAGE';

interface SeanceTypeBadgeProps {
  type: SeanceType;
  style?: ViewStyle;
}

const seanceTypeConfig: Record<SeanceType, { label: string; color: ChipColor; icon: string }> = {
  CM: {
    label: 'CM',
    color: 'primary',
    icon: 'book-open',
  },
  TD: {
    label: 'TD',
    color: 'info',
    icon: 'clipboard-list',
  },
  TP: {
    label: 'TP',
    color: 'success',
    icon: 'settings',
  },
  EXAMEN: {
    label: 'Examen',
    color: 'error',
    icon: 'file-document',
  },
  RATTRAPAGE: {
    label: 'Rattrapage',
    color: 'warning',
    icon: 'refresh',
  },
};

export const SeanceTypeBadge: React.FC<SeanceTypeBadgeProps> = ({
  type,
  style,
}) => {
  const config = seanceTypeConfig[type];
  if (!config) return null;

  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={config.icon}
      variant="filled"
      style={style}
    />
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  chipIcon: {
    marginRight: 4,
  },
  deleteButton: {
    marginLeft: 4,
    padding: 2,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: Colors.text.inverse,
    fontSize: 11,
    fontWeight: '600',
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default Chip;
