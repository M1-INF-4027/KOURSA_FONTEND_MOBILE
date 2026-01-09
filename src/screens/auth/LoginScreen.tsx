/**
 * Koursa - Login Screen
 * Ecran de connexion edge-to-edge professionnel
 */

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenContainer,
  Text,
  LogoText,
  Input,
  PasswordInput,
  Button,
  Spacer,
} from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/spacing';

interface Props {
  navigation: any;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { showError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'L\'email est requis';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      showError(err.message || 'Erreur de connexion', 'Echec');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer
      backgroundColor={Colors.primary}
      statusBarStyle="light-content"
      edges={[]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        {/* Header avec logo */}
        <View style={[styles.header, { paddingTop: insets.top + Spacing['2xl'] }]}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>K</Text>
            </View>
          </View>
          <LogoText style={styles.logoText}>KOURSA</LogoText>
          <Text variant="body" style={styles.tagline}>
            Gestion academique et suivi pedagogique
          </Text>
        </View>

        {/* Formulaire */}
        <View style={[styles.formContainer, { paddingBottom: insets.bottom + Spacing.xl }]}>
          <View style={styles.form}>
            <Text variant="h4" style={styles.formTitle}>
              Connexion
            </Text>
            <Text variant="body" color="secondary" style={styles.formSubtitle}>
              Connectez-vous a votre compte
            </Text>

            <Spacer size="lg" />

            <Input
              label="Adresse email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              leftIcon="email-outline"
              error={errors.email}
            />

            <PasswordInput
              label="Mot de passe"
              placeholder="Votre mot de passe"
              value={password}
              onChangeText={setPassword}
              leftIcon="lock-outline"
              error={errors.password}
            />

            <Button
              title={loading ? 'Connexion...' : 'Se connecter'}
              onPress={handleLogin}
              loading={loading}
              fullWidth
              style={styles.loginButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text variant="caption" color="tertiary" style={styles.dividerText}>
                ou
              </Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Creer un compte"
              onPress={() => navigation.navigate('Register')}
              variant="outline"
              fullWidth
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
  logoContainer: {
    marginBottom: Spacing.base,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  logoIcon: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  logoText: {
    color: Colors.light,
    marginBottom: Spacing.xs,
  },
  tagline: {
    color: Colors.light,
    opacity: 0.9,
    textAlign: 'center',
  },
  // Form
  formContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    paddingTop: Spacing['2xl'],
    paddingHorizontal: Spacing.lg,
  },
  form: {
    flex: 1,
  },
  formTitle: {
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    marginBottom: Spacing.sm,
  },
  loginButton: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.light,
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
  },
});

export default LoginScreen;
