/**
 * Koursa - Profile Screen
 * Ecran de gestion du profil utilisateur
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenContainer,
  Text,
  Card,
  CardContent,
  Avatar,
  Chip,
  Input,
  PasswordInput,
  Button,
  Section,
  Spacer,
  Divider,
  Icon,
} from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { usersService } from '../../api/services';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';

interface Props {
  navigation: any;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, updateUser, logout } = useAuth();
  const { showSuccess, showError } = useToast();

  // Edition des infos personnelles
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [savingInfo, setSavingInfo] = useState(false);

  // Changement de mot de passe
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({ newPassword: '', confirmPassword: '' });

  const getUserInitials = () => {
    const first = user?.first_name?.[0] || '';
    const last = user?.last_name?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'Super Administrateur':
        return Colors.status.error;
      case 'Chef de Departement':
        return Colors.accent;
      case 'Enseignant':
        return Colors.primary;
      case 'Delegue':
      case 'Délégué':
        return Colors.secondary;
      default:
        return Colors.gray[500];
    }
  };

  const getRoleChipColor = (roleName: string): 'error' | 'accent' | 'primary' | 'success' | 'neutral' => {
    switch (roleName) {
      case 'Super Administrateur':
        return 'error';
      case 'Chef de Departement':
        return 'accent';
      case 'Enseignant':
        return 'primary';
      case 'Delegue':
      case 'Délégué':
        return 'success';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'ACTIF':
        return 'Actif';
      case 'INACTIF':
        return 'Inactif';
      case 'EN_ATTENTE':
        return 'En attente';
      default:
        return statut;
    }
  };

  const getStatusColor = (): 'success' | 'error' | 'warning' | 'neutral' => {
    switch (user?.statut) {
      case 'ACTIF':
        return 'success';
      case 'INACTIF':
        return 'error';
      case 'EN_ATTENTE':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingInfo(true);
    try {
      const res = await usersService.update(user.id, {
        first_name: firstName,
        last_name: lastName,
      });
      updateUser(res.data);
      showSuccess('Profil mis a jour');
    } catch {
      showError('Erreur lors de la mise a jour', 'Erreur');
    } finally {
      setSavingInfo(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    const errors = { newPassword: '', confirmPassword: '' };
    let valid = true;

    if (newPassword.length < 6) {
      errors.newPassword = 'Le mot de passe doit contenir au moins 6 caracteres';
      valid = false;
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      valid = false;
    }

    setPasswordErrors(errors);
    if (!valid || !user) return;

    setSavingPassword(true);
    try {
      await usersService.changePassword(user.id, newPassword);
      showSuccess('Mot de passe modifie');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors({ newPassword: '', confirmPassword: '' });
    } catch {
      showError('Erreur lors du changement de mot de passe', 'Erreur');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <ScreenContainer
      backgroundColor={Colors.primary}
      statusBarStyle="light-content"
      edges={[]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text variant="h5" style={styles.headerTitle}>
          Mon Profil
        </Text>
      </View>

      {/* Contenu */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing['3xl'] }]}
        showsVerticalScrollIndicator={false}>
        {/* Carte utilisateur */}
        <View style={styles.avatarContainer}>
          <Avatar
            initials={getUserInitials()}
            size="2xl"
            color={user?.roles?.[0] ? getRoleColor(user.roles[0].nom_role) : Colors.primary}
          />
          <Text variant="h5" style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text variant="body" color="secondary" style={styles.userEmail}>
            {user?.email}
          </Text>
          <View style={styles.rolesContainer}>
            {user?.roles?.map((role) => (
              <Chip
                key={role.id}
                label={role.nom_role}
                color={getRoleChipColor(role.nom_role)}
                size="small"
              />
            ))}
            <Chip
              label={getStatusLabel(user?.statut || '')}
              color={getStatusColor()}
              size="small"
              variant="outlined"
            />
          </View>
        </View>

        <Divider />
        <Spacer size="lg" />

        {/* Informations personnelles */}
        <Section title="Informations personnelles">
          <Card>
            <CardContent>
              <Input
                label="Prenom"
                value={firstName}
                onChangeText={setFirstName}
                leftIcon="account"
              />
              <Spacer size="md" />
              <Input
                label="Nom"
                value={lastName}
                onChangeText={setLastName}
                leftIcon="account"
              />
              <Spacer size="md" />
              <Input
                label="Email"
                value={user?.email || ''}
                editable={false}
                leftIcon="email-outline"
              />
              <Spacer size="lg" />
              <Button
                title="Enregistrer"
                onPress={handleSaveProfile}
                variant="primary"
                icon="check"
                loading={savingInfo}
                disabled={savingInfo}
              />
            </CardContent>
          </Card>
        </Section>

        {/* Changer le mot de passe */}
        <Section title="Changer le mot de passe">
          <Card>
            <CardContent>
              <PasswordInput
                label="Nouveau mot de passe"
                value={newPassword}
                onChangeText={(text: string) => {
                  setNewPassword(text);
                  if (passwordErrors.newPassword) {
                    setPasswordErrors((prev) => ({ ...prev, newPassword: '' }));
                  }
                }}
                leftIcon="lock-outline"
                error={passwordErrors.newPassword}
              />
              <Spacer size="md" />
              <PasswordInput
                label="Confirmer le mot de passe"
                value={confirmPassword}
                onChangeText={(text: string) => {
                  setConfirmPassword(text);
                  if (passwordErrors.confirmPassword) {
                    setPasswordErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }
                }}
                leftIcon="lock-check-outline"
                error={passwordErrors.confirmPassword}
              />
              <Spacer size="lg" />
              <Button
                title="Changer le mot de passe"
                onPress={handleChangePassword}
                variant="outline"
                icon="lock-outline"
                loading={savingPassword}
                disabled={savingPassword || !newPassword}
              />
            </CardContent>
          </Card>
        </Section>

        <Spacer size="xl" />

        {/* Deconnexion */}
        <Button
          title="Se deconnecter"
          onPress={logout}
          variant="danger"
          icon="logout"
          fullWidth
        />

        <Spacer size="xl" />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.light,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
  },
  scrollContent: {
    padding: Spacing.base,
    paddingTop: Spacing.xl,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  userName: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  userEmail: {
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
});

export default ProfileScreen;
