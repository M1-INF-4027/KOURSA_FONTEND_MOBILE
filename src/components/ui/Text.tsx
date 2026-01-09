/**
 * Koursa UI - Text Component
 * Composant texte personnalise avec styles predefinies
 */

import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

type TextVariant = keyof typeof Typography;
type TextColor = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'link' | 'accent' | 'error' | 'success';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  align?: TextStyle['textAlign'];
  children: React.ReactNode;
}

const getColorValue = (color: TextColor): string => {
  const colorMap: Record<TextColor, string> = {
    primary: Colors.text.primary,
    secondary: Colors.text.secondary,
    tertiary: Colors.text.tertiary,
    inverse: Colors.text.inverse,
    link: Colors.text.link,
    accent: Colors.text.accent,
    error: Colors.error,
    success: Colors.success,
  };
  return colorMap[color];
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'primary',
  align,
  style,
  children,
  ...props
}) => {
  const textStyle: TextStyle = {
    ...Typography[variant],
    color: getColorValue(color),
    ...(align && { textAlign: align }),
  };

  return (
    <RNText style={[textStyle, style]} {...props}>
      {children}
    </RNText>
  );
};

// Composant special pour le logo avec Alfa Slab One
export const LogoText: React.FC<Omit<TextProps, 'variant'>> = ({
  style,
  children,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles.logo,
        { color: Colors.primary },
        style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  logo: {
    fontFamily: 'AlfaSlabOne-Regular', // Police a installer
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: 1,
  },
});

export default Text;
