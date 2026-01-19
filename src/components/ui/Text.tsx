/**
 * Koursa - Text Component
 * Composant de texte avec variantes typographiques
 */

import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'bodySmall' | 'caption' | 'label' | 'button';
type TextColor = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'error' | 'success' | 'warning' | 'link' | 'accent';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
  onPress?: () => void;
}

const variantStyles: Record<TextVariant, TextStyle> = {
  h1: { fontSize: 32, fontWeight: 'bold', lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: 'bold', lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h5: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  h6: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  body: { fontSize: 16, fontWeight: 'normal', lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: 'normal', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: 'normal', lineHeight: 16 },
  label: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  button: { fontSize: 16, fontWeight: '600', lineHeight: 24, textTransform: 'uppercase' },
};

const colorMap: Record<TextColor, string> = {
  primary: Colors.text.primary,
  secondary: Colors.text.secondary,
  tertiary: Colors.text.tertiary,
  inverse: Colors.text.inverse,
  error: Colors.error,
  success: Colors.success,
  warning: Colors.warning,
  link: Colors.text.link,
  accent: Colors.text.accent,
};

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  style,
  numberOfLines,
  onPress,
}) => {
  return (
    <RNText
      style={[
        variantStyles[variant],
        { color: colorMap[color] },
        style,
      ]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </RNText>
  );
};

export default Text;
