/**
 * Koursa UI - Button Component
 * Bouton personnalise avec variantes et etats
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, ComponentHeights, Shadows } from '../../constants/spacing';
import { Text } from './Text';
import { Icon } from './Icon';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

const getVariantStyles = (variant: ButtonVariant, disabled: boolean) => {
  const baseStyles = {
    container: {} as ViewStyle,
    text: {} as TextStyle,
  };

  if (disabled) {
    return {
      container: {
        backgroundColor: Colors.gray[200],
        borderWidth: 0,
      },
      text: {
        color: Colors.gray[400],
      },
    };
  }

  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: Colors.primary,
          ...Shadows.md,
        },
        text: {
          color: Colors.light,
        },
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: Colors.secondary,
          ...Shadows.sm,
        },
        text: {
          color: Colors.light,
        },
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: Colors.primary,
        },
        text: {
          color: Colors.primary,
        },
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
        },
        text: {
          color: Colors.primary,
        },
      };
    case 'danger':
      return {
        container: {
          backgroundColor: Colors.error,
          ...Shadows.sm,
        },
        text: {
          color: Colors.light,
        },
      };
    case 'success':
      return {
        container: {
          backgroundColor: Colors.success,
          ...Shadows.sm,
        },
        text: {
          color: Colors.light,
        },
      };
    default:
      return baseStyles;
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return {
        container: {
          height: ComponentHeights.buttonSmall,
          paddingHorizontal: Spacing.md,
        },
        text: Typography.buttonSmall,
        iconSize: 18,
      };
    case 'large':
      return {
        container: {
          height: ComponentHeights.buttonLarge,
          paddingHorizontal: Spacing.xl,
        },
        text: Typography.button,
        iconSize: 24,
      };
    default:
      return {
        container: {
          height: ComponentHeights.button,
          paddingHorizontal: Spacing.lg,
        },
        text: Typography.button,
        iconSize: 20,
      };
  }
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}) => {
  const variantStyles = getVariantStyles(variant, disabled || loading);
  const sizeStyles = getSizeStyles(size);

  const textColor = variantStyles.text.color || Colors.light;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.container,
        sizeStyles.container,
        variantStyles.container,
        fullWidth && styles.fullWidth,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Icon
              name={icon}
              size={sizeStyles.iconSize}
              color={textColor}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              sizeStyles.text,
              variantStyles.text,
            ]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Icon
              name={icon}
              size={sizeStyles.iconSize}
              color={textColor}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// Bouton icone seul
interface IconButtonProps {
  icon: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: number;
  disabled?: boolean;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'ghost',
  size = 24,
  disabled = false,
  style,
}) => {
  const variantStyles = getVariantStyles(variant, disabled);
  const buttonSize = size + Spacing.base;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.iconButton,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
        },
        variantStyles.container,
        style,
      ]}>
      <Icon
        name={icon}
        size={size}
        color={variantStyles.text.color || Colors.primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
