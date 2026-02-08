/**
 * Koursa - Fiche Detail Screen
 * Ecran de detail d'une fiche de suivi avec actions de validation
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Text, Icon } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { fichesSuiviService, authService } from '../../api/services';
import { FicheSuivi, StatutFiche } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { MainStackParamList } from '../../navigation/AppNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type FicheDetailRouteProp = RouteProp<MainStackParamList, 'FicheDetail'>;

const FicheDetailScreen: React.FC = () => {
  const route = useRoute<FicheDetailRouteProp>();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { ficheId } = route.params;

  const [fiche, setFiche] = useState<FicheSuivi | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [motifRefus, setMotifRefus] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');

  const isEnseignantConcerne = user?.roles.some(r => r.nom_role === 'Enseignant')
    && fiche?.enseignant === user?.id;
  const canValidate = isEnseignantConcerne && fiche?.statut === 'SOUMISE';
  const canResubmit = fiche?.delegue === user?.id && fiche?.statut === 'REFUSEE';

  const loadFiche = useCallback(async () => {
    try {
      const response = await fichesSuiviService.getById(ficheId);
      setFiche(response.data);
    } catch (error) {
      console.error('Error loading fiche:', error);
      Alert.alert('Erreur', 'Impossible de charger la fiche');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [ficheId, navigation]);

  useEffect(() => {
    loadFiche();
  }, [loadFiche]);

  const getStatusColor = (status: StatutFiche) => {
    switch (status) {
      case 'SOUMISE':
        return Colors.status.soumise;
      case 'VALIDEE':
        return Colors.status.validee;
      case 'REFUSEE':
        return Colors.status.refusee;
      default:
        return Colors.gray[500];
    }
  };

  const getStatusLabel = (status: StatutFiche) => {
    switch (status) {
      case 'SOUMISE':
        return 'En attente de validation';
      case 'VALIDEE':
        return 'Validee';
      case 'REFUSEE':
        return 'Refusee';
      default:
        return status;
    }
  };

  const handleValidate = () => {
    setShowPasswordModal(true);
  };

  const handleConfirmValidation = async () => {
    if (!password.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre mot de passe');
      return;
    }

    setActionLoading(true);
    try {
      const tokenResponse = await authService.confirmPassword(password);
      const validationToken = tokenResponse.data.validation_token;
      await fichesSuiviService.valider(ficheId, validationToken);
      setShowPasswordModal(false);
      setPassword('');
      Alert.alert('Succes', 'Fiche validee avec succes');
      loadFiche();
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Erreur lors de la validation';
      Alert.alert('Erreur', message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResubmit = () => {
    navigation.navigate('CreateFiche', { ficheId });
  };

  const handleRefuse = async () => {
    if (!motifRefus.trim()) {
      Alert.alert('Erreur', 'Veuillez indiquer un motif de refus');
      return;
    }

    setActionLoading(true);
    try {
      await fichesSuiviService.refuser(ficheId, motifRefus.trim());
      setShowRefuseModal(false);
      setMotifRefus('');
      Alert.alert('Succes', 'Fiche refusee');
      loadFiche();
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Erreur lors du refus';
      Alert.alert('Erreur', message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!fiche) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h5" color="primary" style={styles.headerTitle}>
          Detail de la fiche
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Status Card */}
        <View
          style={[
            styles.statusCard,
            { backgroundColor: getStatusColor(fiche.statut) + '20' },
          ]}
        >
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor(fiche.statut) }]}
          >
            <Text variant="label" color="inverse">
              {fiche.statut}
            </Text>
          </View>
          <Text variant="body" color="primary" style={styles.statusText}>
            {getStatusLabel(fiche.statut)}
          </Text>
          {fiche.date_validation && (
            <Text variant="bodySmall" color="secondary">
              Validee le {fiche.date_validation}
            </Text>
          )}
        </View>

        {/* Refus Reason */}
        {fiche.statut === 'REFUSEE' && fiche.motif_refus && (
          <View style={styles.refusCard}>
            <View style={styles.refusHeader}>
              <Icon name="alert-circle" size={20} color={Colors.error} />
              <Text variant="label" color="error" style={styles.refusTitle}>
                Motif du refus
              </Text>
            </View>
            <Text variant="body" color="primary">
              {fiche.motif_refus}
            </Text>
          </View>
        )}

        {/* Main Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.typeBadge, { backgroundColor: Colors.seance[fiche.type_seance] }]}>
              <Text variant="label" color="inverse">
                {fiche.type_seance}
              </Text>
            </View>
          </View>

          <Text variant="h5" color="primary" style={styles.ueTitle}>
            {fiche.nom_ue}
          </Text>

          <Text variant="h6" color="secondary" style={styles.chapitreTitle}>
            {fiche.titre_chapitre}
          </Text>
        </View>

        {/* Details */}
        <View style={styles.card}>
          <Text variant="h6" color="primary" style={styles.sectionTitle}>
            Informations
          </Text>

          <View style={styles.detailItem}>
            <Icon name="calendar" size={20} color={Colors.gray[500]} />
            <View style={styles.detailContent}>
              <Text variant="bodySmall" color="tertiary">
                Date du cours
              </Text>
              <Text variant="body" color="primary">
                {fiche.date_cours}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="clock-outline" size={20} color={Colors.gray[500]} />
            <View style={styles.detailContent}>
              <Text variant="bodySmall" color="tertiary">
                Horaire
              </Text>
              <Text variant="body" color="primary">
                {fiche.heure_debut} - {fiche.heure_fin} ({fiche.duree})
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="map-marker" size={20} color={Colors.gray[500]} />
            <View style={styles.detailContent}>
              <Text variant="bodySmall" color="tertiary">
                Salle
              </Text>
              <Text variant="body" color="primary">
                {fiche.salle}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="school" size={20} color={Colors.gray[500]} />
            <View style={styles.detailContent}>
              <Text variant="bodySmall" color="tertiary">
                Classe
              </Text>
              <Text variant="body" color="primary">
                {fiche.classe || '-'}{fiche.semestre ? ` (S${fiche.semestre})` : ''}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="account" size={20} color={Colors.gray[500]} />
            <View style={styles.detailContent}>
              <Text variant="bodySmall" color="tertiary">
                Enseignant
              </Text>
              <Text variant="body" color="primary">
                {fiche.nom_enseignant || 'Non assigne'}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="account-edit" size={20} color={Colors.gray[500]} />
            <View style={styles.detailContent}>
              <Text variant="bodySmall" color="tertiary">
                Soumis par
              </Text>
              <Text variant="body" color="primary">
                {fiche.nom_delegue || 'Inconnu'}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="calendar-check" size={20} color={Colors.gray[500]} />
            <View style={styles.detailContent}>
              <Text variant="bodySmall" color="tertiary">
                Date de soumission
              </Text>
              <Text variant="body" color="primary">
                {fiche.date_soumission}
              </Text>
            </View>
          </View>
        </View>

        {/* Contenu */}
        <View style={styles.card}>
          <Text variant="h6" color="primary" style={styles.sectionTitle}>
            Contenu aborde
          </Text>
          <Text variant="body" color="secondary">
            {fiche.contenu_aborde}
          </Text>
        </View>

        {/* Actions */}
        {canValidate && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.refuseButton]}
              onPress={() => setShowRefuseModal(true)}
              disabled={actionLoading}
            >
              <Icon name="close" size={20} color={Colors.error} />
              <Text variant="button" color="error" style={styles.actionText}>
                Refuser
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.validateButton]}
              onPress={handleValidate}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator color={Colors.light} size="small" />
              ) : (
                <>
                  <Icon name="check" size={20} color={Colors.light} />
                  <Text variant="button" color="inverse" style={styles.actionText}>
                    Valider
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Resubmit Button */}
        {canResubmit && (
          <TouchableOpacity
            style={styles.resubmitButton}
            onPress={handleResubmit}
          >
            <Icon name="pencil" size={20} color={Colors.light} />
            <Text variant="button" color="inverse" style={styles.actionText}>
              Modifier et resoumettre
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Refuse Modal */}
      <Modal
        visible={showRefuseModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRefuseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="h5" color="primary" style={styles.modalTitle}>
              Refuser la fiche
            </Text>
            <Text variant="body" color="secondary" style={styles.modalSubtitle}>
              Veuillez indiquer le motif du refus
            </Text>

            <TextInput
              label="Motif du refus"
              value={motifRefus}
              onChangeText={setMotifRefus}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.motifInput}
              outlineColor={Colors.border.light}
              activeOutlineColor={Colors.primary}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowRefuseModal(false);
                  setMotifRefus('');
                }}
                disabled={actionLoading}
              >
                <Text variant="button" color="secondary">
                  Annuler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmRefuseButton]}
                onPress={handleRefuse}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator color={Colors.light} size="small" />
                ) : (
                  <Text variant="button" color="inverse">
                    Refuser
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Password Confirmation Modal */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="h5" color="primary" style={styles.modalTitle}>
              Confirmer la validation
            </Text>
            <Text variant="body" color="secondary" style={styles.modalSubtitle}>
              Entrez votre mot de passe pour valider cette fiche
            </Text>

            <TextInput
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.motifInput}
              outlineColor={Colors.border.light}
              activeOutlineColor={Colors.primary}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                }}
                disabled={actionLoading}
              >
                <Text variant="button" color="secondary">
                  Annuler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors.success }]}
                onPress={handleConfirmValidation}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator color={Colors.light} size="small" />
                ) : (
                  <Text variant="button" color="inverse">
                    Valider
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.light,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  statusText: {
    textAlign: 'center',
  },
  refusCard: {
    backgroundColor: Colors.errorLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  refusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  refusTitle: {
    marginLeft: 8,
  },
  card: {
    backgroundColor: Colors.light,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ueTitle: {
    marginBottom: 4,
  },
  chapitreTitle: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  refuseButton: {
    backgroundColor: Colors.errorLight,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  validateButton: {
    backgroundColor: Colors.success,
  },
  actionText: {
    marginLeft: 8,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.light,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    marginBottom: 8,
  },
  modalSubtitle: {
    marginBottom: 16,
  },
  motifInput: {
    backgroundColor: Colors.light,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.gray[100],
  },
  confirmRefuseButton: {
    backgroundColor: Colors.error,
  },
  resubmitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
});

export default FicheDetailScreen;
