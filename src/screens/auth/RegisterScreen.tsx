/**
 * Koursa - Register Screen
 * Ecran d'inscription edge-to-edge professionnel
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenContainer,
  Text,
  LogoText,
  Input,
  PasswordInput,
  Button,
  Chip,
  Spacer,
} from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { rolesService } from '../../api/services';
import { Role } from '../../types';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/spacing';

interface Props {
  navigation: any;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const { showError, showSuccess } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await rolesService.getAll();
      // Exclure le role Super Administrateur pour l'inscription publique
      setRoles(response.data.filter((r) => r.nom_role !== 'Super Administrateur'));
    } catch (err) {
      console.error('Error loading roles:', err);
    }
  };

  const toggleRole = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const validate = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!firstName.trim()) {
      newErrors.firstName = 'Le prenom est requis';
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
      isValid = false;
    }

    if (!email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Minimum 8 caracteres';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        roles_ids: selectedRoles,
      });
      showSuccess('Inscription reussie !', 'Bienvenue');
    } catch (err: any) {
      showError(
        err.response?.data?.message || "Erreur lors de l'inscription",
        'Echec'
      );
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
        {/* Header compact */}
        <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>K</Text>
            </View>
          </View>
          <LogoText style={styles.logoText}>KOURSA</LogoText>
        </View>

        {/* Formulaire scrollable */}
        <View style={[styles.formContainer, { paddingBottom: insets.bottom + Spacing.lg }]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <Text variant="h4" style={styles.formTitle}>
              Inscription
            </Text>
            <Text variant="body" color="secondary" style={styles.formSubtitle}>
              Creez votre compte Koursa
            </Text>

            <Spacer size="lg" />

            {/* Nom et Prenom */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input
                  label="Prenom"
                  placeholder="Jean"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  leftIcon="account-outline"
                  error={errors.firstName}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="Nom"
                  placeholder="Dupont"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  leftIcon="account-outline"
                  error={errors.lastName}
                />
              </View>
            </View>

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
              placeholder="Minimum 8 caracteres"
              value={password}
              onChangeText={setPassword}
              leftIcon="lock-outline"
              error={errors.password}
            />

            <PasswordInput
              label="Confirmer le mot de passe"
              placeholder="Repetez le mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              leftIcon="lock-check-outline"
              error={errors.confirmPassword}
            />

            {/* Selection des roles */}
            <Text variant="label" style={styles.rolesLabel}>
              Selectionnez votre role
            </Text>
            <View style={styles.rolesContainer}>
              {roles.map((role) => (
                <Chip
                  key={role.id}
                  label={role.nom_role}
                  selected={selectedRoles.includes(role.id)}
                  onPress={() => toggleRole(role.id)}
                  color={selectedRoles.includes(role.id) ? 'primary' : 'default'}
                  style={styles.roleChip}
                />
              ))}
            </View>

            <Button
              title={loading ? 'Inscription...' : "S'inscrire"}
              onPress={handleRegister}
              loading={loading}
              fullWidth
              style={styles.registerButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text variant="caption" color="tertiary" style={styles.dividerText}>
                ou
              </Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Deja un compte ? Se connecter"
              onPress={() => navigation.navigate('Login')}
              variant="ghost"
              fullWidth
            />

            <Spacer size="xl" />
          </ScrollView>
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
    paddingBottom: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.sm,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  logoIcon: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  logoText: {
    color: Colors.light,
    fontSize: 24,
  },
  // Form
  formContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing['2xl'],
    paddingHorizontal: Spacing.lg,
  },
  formTitle: {
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  rolesLabel: {
    marginBottom: Spacing.sm,
    color: Colors.text.secondary,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  roleChip: {
    marginBottom: Spacing.xs,
  },
  registerButton: {
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

export default RegisterScreen;
