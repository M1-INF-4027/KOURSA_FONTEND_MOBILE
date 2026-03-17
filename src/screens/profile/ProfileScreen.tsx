/**
 * Koursa - Profile Screen
 * Ecran de gestion du profil utilisateur
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
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
import { usersService, filieresService, niveauxService } from '../../api/services';
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

  // Logout confirmation
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Delegate level change
  const isDelegue = user?.roles?.some((r: any) => r.nom_role === 'Délégué' || r.nom_role === 'Delegue') ?? false;
  const [showLevelDialog, setShowLevelDialog] = useState(false);
  const [allFilieres, setAllFilieres] = useState<any[]>([]);
  const [allNiveaux, setAllNiveaux] = useState<any[]>([]);
  const [selectedFiliere, setSelectedFiliere] = useState<number | null>(null);
  const [selectedNiveau, setSelectedNiveau] = useState<number | null>(null);
  const [savingLevel, setSavingLevel] = useState(false);

  const loadLevelData = async () => {
    try {
      const [filRes, nivRes] = await Promise.all([filieresService.getAll(), niveauxService.getAll()]);
      setAllFilieres(filRes.data);
      setAllNiveaux(nivRes.data);
    } catch { /* silent */ }
  };

  const filteredNiveaux = selectedFiliere
    ? allNiveaux.filter((n: any) => (n.filiere || n.filiere_id) === selectedFiliere)
    : allNiveaux;

  const handleChangeLevel = async () => {
    if (!selectedNiveau) {
      showError('Veuillez selectionner un niveau');
      return;
    }
    setSavingLevel(true);
    try {
      await usersService.changerNiveau(selectedNiveau);
      showSuccess('Niveau mis a jour avec succes');
      setShowLevelDialog(false);
      // Refresh user data
      const res = await usersService.update(user!.id, {});
      updateUser(res.data);
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      showError(detail || 'Erreur lors du changement de niveau', 'Erreur');
    } finally {
      setSavingLevel(false);
    }
  };

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

        {/* Changement de classe (delegue uniquement) */}
        {isDelegue && (
          <Section title="Changement de classe">
            <Card>
              <CardContent>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md }}>
                  <Icon name="swap-horizontal" size={24} color={Colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text variant="subtitle">Nouvelle annee academique ?</Text>
                    <Text variant="caption" color="tertiary">
                      Mettez a jour votre classe si vous avez change de niveau ou de filiere.
                    </Text>
                  </View>
                </View>
                <Button
                  title="Changer de classe"
                  onPress={() => {
                    loadLevelData();
                    setShowLevelDialog(true);
                  }}
                  variant="outline"
                  icon="school"
                  fullWidth
                />
              </CardContent>
            </Card>
          </Section>
        )}

        <Spacer size="xl" />

        {/* Deconnexion */}
        <Button
          title="Se deconnecter"
          onPress={() => setShowLogoutDialog(true)}
          variant="danger"
          icon="logout"
          fullWidth
        />

        <Spacer size="xl" />
      </ScrollView>

      {/* Level Change Dialog */}
      <Modal
        visible={showLevelDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLevelDialog(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowLevelDialog(false)}
          />
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <View style={styles.modalIconRow}>
              <View style={[styles.logoutIconContainer, { backgroundColor: Colors.primary + '15' }]}>
                <Icon name="school" size={28} color={Colors.primary} />
              </View>
            </View>
            <Text variant="h6" style={styles.modalTitle}>Changer de classe</Text>
            <Text variant="body" color="secondary" style={styles.modalMessage}>
              Selectionnez votre nouvelle filiere et votre nouveau niveau.
            </Text>

            {/* Filiere picker */}
            <Text variant="label" style={{ marginBottom: Spacing.xs, color: Colors.text.secondary }}>Filiere</Text>
            <ScrollView style={{ maxHeight: 120, marginBottom: Spacing.md }} nestedScrollEnabled>
              {allFilieres.map((f: any) => (
                <TouchableOpacity
                  key={f.id}
                  style={{
                    padding: Spacing.sm,
                    borderRadius: BorderRadius.sm,
                    backgroundColor: selectedFiliere === f.id ? Colors.primary + '15' : 'transparent',
                    marginBottom: 2,
                  }}
                  onPress={() => { setSelectedFiliere(f.id); setSelectedNiveau(null); }}>
                  <Text variant="body" color={selectedFiliere === f.id ? 'primary' : 'primary'}>
                    {f.nom_filiere}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Niveau picker */}
            {selectedFiliere && (
              <>
                <Text variant="label" style={{ marginBottom: Spacing.xs, color: Colors.text.secondary }}>Niveau</Text>
                <ScrollView style={{ maxHeight: 120, marginBottom: Spacing.md }} nestedScrollEnabled>
                  {filteredNiveaux.map((n: any) => (
                    <TouchableOpacity
                      key={n.id}
                      style={{
                        padding: Spacing.sm,
                        borderRadius: BorderRadius.sm,
                        backgroundColor: selectedNiveau === n.id ? Colors.primary + '15' : 'transparent',
                        marginBottom: 2,
                      }}
                      onPress={() => setSelectedNiveau(n.id)}>
                      <Text variant="body" color={selectedNiveau === n.id ? 'primary' : 'primary'}>
                        {n.nom_niveau}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowLevelDialog(false)}>
                <Text variant="label" style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalLogoutButton, { backgroundColor: Colors.primary }]}
                onPress={handleChangeLevel}>
                {savingLevel ? (
                  <ActivityIndicator size="small" color={Colors.light} />
                ) : (
                  <>
                    <Icon name="check" size={18} color={Colors.light} />
                    <Text variant="label" style={styles.modalLogoutText}>Confirmer</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Dialog */}
      <Modal
        visible={showLogoutDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutDialog(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowLogoutDialog(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalIconRow}>
              <View style={styles.logoutIconContainer}>
                <Icon name="logout" size={28} color={Colors.error} />
              </View>
            </View>
            <Text variant="h6" style={styles.modalTitle}>Se deconnecter</Text>
            <Text variant="body" color="secondary" style={styles.modalMessage}>
              Etes-vous sur de vouloir vous deconnecter de votre compte ?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowLogoutDialog(false)}>
                <Text variant="label" style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalLogoutButton}
                onPress={() => {
                  setShowLogoutDialog(false);
                  logout();
                }}>
                <Icon name="logout" size={18} color={Colors.light} />
                <Text variant="label" style={styles.modalLogoutText}>Se deconnecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // Logout Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: Colors.light,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '85%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  modalIconRow: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoutIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
  },
  modalCancelText: {
    color: Colors.text.secondary,
  },
  modalLogoutButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  modalLogoutText: {
    color: Colors.light,
  },
});

export default ProfileScreen;
