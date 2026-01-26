/**
 * Koursa - Button Component
 * Composants de boutons avec variantes et états
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { Colors } from '../../constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: {
      backgroundColor: Colors.primary,
    },
    text: {
      color: Colors.text.inverse,
    },
  },
  secondary: {
    container: {
      backgroundColor: Colors.secondary,
    },
    text: {
      color: Colors.text.inverse,
    },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: Colors.primary,
    },
    text: {
      color: Colors.primary,
    },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
    },
    text: {
      color: Colors.primary,
    },
  },
  danger: {
    container: {
      backgroundColor: Colors.error,
    },
    text: {
      color: Colors.text.inverse,
    },
  },
  success: {
    container: {
      backgroundColor: Colors.success,
    },
    text: {
      color: Colors.text.inverse,
    },
  },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle; iconSize: number }> = {
  small: {
    container: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    text: {
      fontSize: 14,
    },
    iconSize: 16,
  },
  medium: {
    container: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 10,
    },
    text: {
      fontSize: 16,
    },
    iconSize: 20,
  },
  large: {
    container: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
    },
    text: {
      fontSize: 18,
    },
    iconSize: 24,
  },
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  onPress,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const isDisabled = disabled || loading;

  const textColor = (isDisabled
    ? Colors.text.tertiary
    : variantStyle.text.color) as string;

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={styles.loader}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Icon
              name={icon}
              size={sizeStyle.iconSize}
              color={textColor}
              style={styles.iconLeft}
            />
          )}
          <Text
            variant="button"
            style={[
              sizeStyle.text,
              { color: textColor },
              styles.buttonText,
            ]}
          >
            {children}
          </Text>
          {icon && iconPosition === 'right' && (
            <Icon
              name={icon}
              size={sizeStyle.iconSize}
              color={textColor}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        variantStyle.container,
        sizeStyle.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {renderContent()}
      </View>
    </TouchableOpacity>
  );
};

interface IconButtonProps {
  icon: string;
  onPress?: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

// Helper to ensure color is a string
const colorToString = (color: string | undefined): string | undefined => {
  return color as string | undefined;
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 24,
  color = Colors.text.primary,
  backgroundColor = 'transparent',
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.iconButton,
        {
          backgroundColor,
          width: size + 16,
          height: size + 16,
          borderRadius: (size + 16) / 2,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Icon
        name={icon}
        size={size}
        color={disabled ? Colors.text.tertiary : color as string}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textTransform: 'none',
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  loader: {
    marginRight: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
