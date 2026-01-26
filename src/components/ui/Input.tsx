/**
 * Koursa - Input Components
 * Composants d'entrée de texte avec variantes
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { Colors } from '../../constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  disabled = false,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return Colors.error;
    if (isFocused) return Colors.primary;
    return Colors.border.light;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="label" color="secondary" style={styles.label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: disabled ? Colors.background.secondary : Colors.background.primary,
          },
        ]}
      >
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={error ? Colors.error : Colors.text.tertiary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            disabled && styles.disabledInput,
            inputStyle,
          ]}
          placeholderTextColor={Colors.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          {...textInputProps}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIconButton}
          >
            <Icon
              name={rightIcon}
              size={20}
              color={error ? Colors.error : Colors.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text variant="caption" color="error" style={styles.errorText}>
          {error}
        </Text>
      )}
      {hint && !error && (
        <Text variant="caption" color="tertiary" style={styles.hintText}>
          {hint}
        </Text>
      )}
    </View>
  );
};

interface PasswordInputProps extends Omit<InputProps, 'rightIcon' | 'onRightIconPress' | 'secureTextEntry'> {}

export const PasswordInput: React.FC<PasswordInputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      secureTextEntry={!showPassword}
      rightIcon={showPassword ? 'eye-off' : 'eye'}
      onRightIconPress={() => setShowPassword(!showPassword)}
    />
  );
};

interface TextAreaProps extends InputProps {
  numberOfLines?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  numberOfLines = 4,
  containerStyle,
  inputStyle,
  ...props
}) => {
  return (
    <Input
      {...props}
      multiline
      numberOfLines={numberOfLines}
      containerStyle={containerStyle}
      inputStyle={StyleSheet.flatten([
        styles.textArea,
        { minHeight: numberOfLines * 24 },
        inputStyle,
      ]) as TextStyle}
      textAlignVertical="top"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: Colors.background.primary,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  disabledInput: {
    color: Colors.text.tertiary,
  },
  leftIcon: {
    marginLeft: 12,
  },
  rightIconButton: {
    padding: 12,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  hintText: {
    marginTop: 4,
    marginLeft: 4,
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});

export default Input;
