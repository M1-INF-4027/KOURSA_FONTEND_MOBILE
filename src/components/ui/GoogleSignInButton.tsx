/**
 * Koursa UI - Google Sign-In Button
 * Bouton style Google avec icone G et texte personnalisable
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, ComponentHeights, Shadows } from '../../constants/spacing';

interface GoogleSignInButtonProps {
  onPress: () => void;
  loading?: boolean;
  title?: string;
  style?: ViewStyle;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  loading = false,
  title = 'Continuer avec Google',
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
      style={[styles.button, style]}>
      {loading ? (
        <ActivityIndicator size="small" color={Colors.text.primary} />
      ) : (
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.googleG}>G</Text>
          </View>
          <Text style={styles.text}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: ComponentHeights.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light,
    borderWidth: 1.5,
    borderColor: Colors.border.medium,
    borderRadius: BorderRadius.md,
    width: '100%',
    ...Shadows.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  googleG: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4285F4',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});

export default GoogleSignInButton;
