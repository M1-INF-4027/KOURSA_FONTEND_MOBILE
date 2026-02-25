/**
 * Koursa - Create Fiche Screen
 * Creation de fiche de suivi edge-to-edge professionnel
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenContainer,
  Text,
  Input,
  TextArea,
  Button,
  Card,
  CardContent,
  Chip,
  Section,
  Spacer,
  IconButton,
  Icon,
} from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { ConfirmDialog } from '../../components/ui/Dialog';
import { fichesSuiviService, unitesEnseignementService } from '../../api/services';
import { UniteEnseignement, EnseignantSimple, TypeSeance } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/spacing';

interface Props {
  navigation: any;
  route?: {
    params?: {
      ficheId?: number;
    };
  };
}

const CreateFicheScreen: React.FC<Props> = ({ navigation, route }) => {
  const ficheId = route?.params?.ficheId;
  const isEditMode = !!ficheId;
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const [ues, setUes] = useState<UniteEnseignement[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFiche, setLoadingFiche] = useState(isEditMode);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Form state
  const [selectedUe, setSelectedUe] = useState<number | null>(null);
  const [selectedEnseignant, setSelectedEnseignant] = useState<number | null>(null);
  const [dateCours, setDateCours] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [salle, setSalle] = useState('');
  const [typeSeance, setTypeSeance] = useState<TypeSeance>('CM');
  const [titreChapitre, setTitreChapitre] = useState('');
  const [contenuAborde, setContenuAborde] = useState('');
  const [showUePicker, setShowUePicker] = useState(false);
  const [showEnseignantPicker, setShowEnseignantPicker] = useState(false);

  // Form errors
  const [errors, setErrors] = useState({
    ue: '',
    enseignant: '',
    dateCours: '',
    heureDebut: '',
    heureFin: '',
    titreChapitre: '',
    contenuAborde: '',
  });

  useEffect(() => {
    loadUes();
  }, []);

  // Load fiche data in edit mode
  useEffect(() => {
    if (isEditMode && ficheId) {
      loadFicheData();
    }
  }, [ficheId]);

  const loadFicheData = async () => {
    try {
      const response = await fichesSuiviService.getById(ficheId!);
      const fiche = response.data;
      setSelectedUe(fiche.ue);
      setSelectedEnseignant(fiche.enseignant);
      setDateCours(fiche.date_cours || '');
      setHeureDebut(fiche.heure_debut || '');
      setHeureFin(fiche.heure_fin || '');
      setSalle(fiche.salle || '');
      setTypeSeance((fiche.type_seance as TypeSeance) || 'CM');
      setTitreChapitre(fiche.titre_chapitre || '');
      setContenuAborde(fiche.contenu_aborde || '');
    } catch (err) {
      showError('Impossible de charger la fiche', 'Erreur');
      navigation.goBack();
    } finally {
      setLoadingFiche(false);
    }
  };

  const loadUes = async () => {
    try {
      const response = await unitesEnseignementService.getAll();
      setUes(response.data);
    } catch (err) {
      console.error('Error loading UEs:', err);
      showError('Impossible de charger les UEs', 'Erreur');
    }
  };

  const getSelectedUeLabel = () => {
    if (!selectedUe) return 'Selectionner une UE';
    const ue = ues.find((u) => u.id === selectedUe);
    return ue ? `${ue.code_ue} - ${ue.libelle_ue}` : 'Selectionner une UE';
  };

  const getSelectedUeEnseignants = (): EnseignantSimple[] => {
    if (!selectedUe) return [];
    const ue = ues.find((u) => u.id === selectedUe);
    return ue?.enseignants_details || [];
  };

  const getSelectedEnseignantLabel = () => {
    if (!selectedEnseignant) return 'Selectionner un enseignant';
    const enseignants = getSelectedUeEnseignants();
    const ens = enseignants.find((e) => e.id === selectedEnseignant);
    return ens ? ens.nom_complet : 'Selectionner un enseignant';
  };

  const validateForm = () => {
    const newErrors = {
      ue: '',
      enseignant: '',
      dateCours: '',
      heureDebut: '',
      heureFin: '',
      titreChapitre: '',
      contenuAborde: '',
    };
    let isValid = true;

    if (!selectedUe) {
      newErrors.ue = 'Veuillez selectionner une UE';
      isValid = false;
    }

    if (!selectedEnseignant) {
      newErrors.enseignant = 'Veuillez selectionner un enseignant';
      isValid = false;
    }

    if (!dateCours) {
      newErrors.dateCours = 'La date est requise';
      isValid = false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateCours)) {
      newErrors.dateCours = 'Format: AAAA-MM-JJ';
      isValid = false;
    }

    if (!heureDebut) {
      newErrors.heureDebut = 'Requise';
      isValid = false;
    } else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(heureDebut)) {
      newErrors.heureDebut = 'Format: HH:MM (00:00-23:59)';
      isValid = false;
    }

    if (!heureFin) {
      newErrors.heureFin = 'Requise';
      isValid = false;
    } else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(heureFin)) {
      newErrors.heureFin = 'Format: HH:MM (00:00-23:59)';
      isValid = false;
    }

    if (heureDebut && heureFin && !newErrors.heureDebut && !newErrors.heureFin) {
      if (heureFin <= heureDebut) {
        newErrors.heureFin = "L'heure de fin doit etre apres le debut";
        isValid = false;
      }
    }

    if (!titreChapitre.trim()) {
      newErrors.titreChapitre = 'Le titre est requis';
      isValid = false;
    }

    if (!contenuAborde.trim()) {
      newErrors.contenuAborde = 'Le contenu est requis';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ue: selectedUe!,
        enseignant: selectedEnseignant!,
        date_cours: dateCours,
        heure_debut: heureDebut,
        heure_fin: heureFin,
        salle,
        type_seance: typeSeance,
        titre_chapitre: titreChapitre,
        contenu_aborde: contenuAborde,
      };

      if (isEditMode && ficheId) {
        // Update the fiche then resoumettre
        await fichesSuiviService.update(ficheId, payload);
        await fichesSuiviService.resoumettre(ficheId);
      } else {
        await fichesSuiviService.create(payload);
      }
      setShowSuccessDialog(true);
    } catch (err: any) {
      showError(
        err.response?.data?.message || err.response?.data?.detail || (isEditMode ? 'Erreur lors de la modification' : 'Erreur lors de la creation'),
        'Echec'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    navigation.goBack();
  };

  const seanceTypes: { value: TypeSeance; label: string; icon: string }[] = [
    { value: 'CM', label: 'Cours Magistral', icon: 'school' },
    { value: 'TD', label: 'Travaux Diriges', icon: 'pencil' },
    { value: 'TP', label: 'Travaux Pratiques', icon: 'flask' },
  ];

  if (loadingFiche) {
    return (
      <ScreenContainer backgroundColor={Colors.primary} statusBarStyle="light-content" edges={[]}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <View style={styles.headerRow}>
            <IconButton icon="close" size={22} color={Colors.light} onPress={() => navigation.goBack()} />
            <Text variant="h5" style={styles.headerTitle}>Modifier la fiche</Text>
            <View style={{ width: 40 }} />
          </View>
        </View>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.primary}
      statusBarStyle="light-content"
      edges={[]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerRow}>
          <IconButton
            icon="close"
            size={22}
            color={Colors.light}
            onPress={() => navigation.goBack()}
          />
          <Text variant="h5" style={styles.headerTitle}>
            {isEditMode ? 'Modifier la fiche' : 'Nouvelle fiche'}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Section: Informations du cours */}
          <Section title="Informations du cours">
            {/* Selecteur UE */}
            <Text variant="label" style={styles.label}>
              Unite d'enseignement *
            </Text>
            <TouchableOpacity
              style={[
                styles.uePicker,
                errors.ue ? styles.uePickerError : null,
              ]}
              activeOpacity={0.7}
              onPress={() => setShowUePicker(!showUePicker)}>
              <Text
                variant="body"
                color={selectedUe ? 'primary' : 'tertiary'}
                style={styles.uePickerText}>
                {getSelectedUeLabel()}
              </Text>
              <Icon
                name={showUePicker ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>
            {errors.ue ? (
              <Text variant="caption" style={styles.errorText}>
                {errors.ue}
              </Text>
            ) : null}

            {/* Liste des UEs */}
            {showUePicker && (
              <Card style={styles.ueList}>
                <CardContent>
                  {ues.map((ue) => (
                    <TouchableOpacity
                      key={ue.id}
                      style={[
                        styles.ueItem,
                        selectedUe === ue.id && styles.ueItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedUe(ue.id);
                        // Auto-select si un seul enseignant
                        const enseignants = ue.enseignants_details || [];
                        setSelectedEnseignant(enseignants.length === 1 ? enseignants[0].id : null);
                        setShowUePicker(false);
                        setErrors({ ...errors, ue: '', enseignant: '' });
                      }}>
                      <Text
                        variant="body"
                        color={selectedUe === ue.id ? 'primary' : 'primary'}>
                        {ue.code_ue} - {ue.libelle_ue}
                      </Text>
                      {selectedUe === ue.id && (
                        <Icon name="check" size={20} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </CardContent>
              </Card>
            )}

            <Spacer size={22} />

            {/* Selecteur Enseignant */}
            {selectedUe && (
              <>
                <Text variant="label" style={styles.label}>
                  Enseignant *
                </Text>
                <TouchableOpacity
                  style={[
                    styles.uePicker,
                    errors.enseignant ? styles.uePickerError : null,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setShowEnseignantPicker(!showEnseignantPicker)}>
                  <Text
                    variant="body"
                    color={selectedEnseignant ? 'primary' : 'tertiary'}
                    style={styles.uePickerText}>
                    {getSelectedEnseignantLabel()}
                  </Text>
                  <Icon
                    name={showEnseignantPicker ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={Colors.text.secondary}
                  />
                </TouchableOpacity>
                {errors.enseignant ? (
                  <Text variant="caption" style={styles.errorText}>
                    {errors.enseignant}
                  </Text>
                ) : null}

                {showEnseignantPicker && (
                  <Card style={styles.ueList}>
                    <CardContent>
                      {getSelectedUeEnseignants().length === 0 ? (
                        <Text variant="body" color="tertiary" style={{ padding: Spacing.sm }}>
                          Aucun enseignant assigne a cette UE
                        </Text>
                      ) : (
                        getSelectedUeEnseignants().map((ens) => (
                          <TouchableOpacity
                            key={ens.id}
                            style={[
                              styles.ueItem,
                              selectedEnseignant === ens.id && styles.ueItemSelected,
                            ]}
                            onPress={() => {
                              setSelectedEnseignant(ens.id);
                              setShowEnseignantPicker(false);
                              setErrors({ ...errors, enseignant: '' });
                            }}>
                            <Text
                              variant="body"
                              color={selectedEnseignant === ens.id ? 'primary' : 'primary'}>
                              {ens.nom_complet}
                            </Text>
                            {selectedEnseignant === ens.id && (
                              <Icon name="check" size={20} color={Colors.primary} />
                            )}
                          </TouchableOpacity>
                        ))
                      )}
                    </CardContent>
                  </Card>
                )}

                <Spacer size={22} />
              </>
            )}

            <Input
              label="Date du cours *"
              placeholder="2025-01-15"
              value={dateCours}
              onChangeText={(text) => {
                setDateCours(text);
                setErrors({ ...errors, dateCours: '' });
              }}
              leftIcon="calendar"
              error={errors.dateCours}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input
                  label="Heure debut *"
                  placeholder="08:00"
                  value={heureDebut}
                  onChangeText={(text) => {
                    setHeureDebut(text);
                    setErrors({ ...errors, heureDebut: '' });
                  }}
                  leftIcon="clock-outline"
                  error={errors.heureDebut}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="Heure fin *"
                  placeholder="10:00"
                  value={heureFin}
                  onChangeText={(text) => {
                    setHeureFin(text);
                    setErrors({ ...errors, heureFin: '' });
                  }}
                  leftIcon="clock-outline"
                  error={errors.heureFin}
                />
              </View>
            </View>

            <Input
              label="Salle"
              placeholder="Amphi A, Salle 101..."
              value={salle}
              onChangeText={setSalle}
              leftIcon="door"
            />

            {/* Type de seance */}
            <Text variant="label" style={styles.label}>
              Type de seance *
            </Text>
            <View style={styles.seanceTypes}>
              {seanceTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.seanceType,
                    typeSeance === type.value && styles.seanceTypeSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setTypeSeance(type.value)}>
                  <Icon
                    name={type.icon}
                    size={24}
                    color={
                      typeSeance === type.value ? Colors.light : Colors.primary
                    }
                  />
                  <Text
                    variant="caption"
                    style={[
                      styles.seanceTypeLabel,
                      typeSeance === type.value && styles.seanceTypeLabelSelected,
                    ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section>

          {/* Section: Contenu pedagogique */}
          <Section title="Contenu pedagogique">
            <Input
              label="Titre du chapitre *"
              placeholder="Ex: Introduction aux algorithmes"
              value={titreChapitre}
              onChangeText={(text) => {
                setTitreChapitre(text);
                setErrors({ ...errors, titreChapitre: '' });
              }}
              leftIcon="book-open-variant"
              error={errors.titreChapitre}
            />

            <TextArea
              label="Contenu aborde *"
              placeholder="Decrivez le contenu aborde pendant la seance..."
              value={contenuAborde}
              onChangeText={(text) => {
                setContenuAborde(text);
                setErrors({ ...errors, contenuAborde: '' });
              }}
              numberOfLines={6}
              error={errors.contenuAborde}
            />
          </Section>

          <Spacer size="lg" />

          <Button
            title={loading ? (isEditMode ? 'Modification...' : 'Soumission...') : (isEditMode ? 'Modifier et resoumettre' : 'Soumettre la fiche')}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            icon={isEditMode ? 'refresh' : 'send'}
          />

          <Spacer size="3xl" />
        </ScrollView>
      </View>

      {/* Success Dialog */}
      <ConfirmDialog
        visible={showSuccessDialog}
        title="Succes"
        message={isEditMode
          ? "Votre fiche a ete modifiee et resoumise pour validation."
          : "Votre fiche de suivi a ete creee avec succes et soumise pour validation."}
        confirmText="OK"
        onConfirm={handleSuccessConfirm}
        onCancel={handleSuccessConfirm}
        type="success"
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  // Header
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: Colors.light,
    flex: 1,
    textAlign: 'center',
  },
  // Content
  content: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingTop: Spacing.xl,
  },
  // Labels
  label: {
    marginBottom: Spacing.sm,
    color: Colors.text.secondary,
  },
  // UE Picker
  uePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  uePickerError: {
    borderColor: Colors.status.error,
  },
  uePickerText: {
    flex: 1,
  },
  ueList: {
    marginTop: Spacing.sm,
    maxHeight: 200,
  },
  ueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  ueItemSelected: {
    backgroundColor: Colors.primaryLight,
  },
  errorText: {
    color: Colors.status.error,
    marginTop: Spacing.xs,
  },
  // Row layout
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  // Seance types
  seanceTypes: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  seanceType: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border.light,
  },
  seanceTypeSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  seanceTypeLabel: {
    marginTop: Spacing.xs,
    textAlign: 'center',
    color: Colors.text.primary,
  },
  seanceTypeLabelSelected: {
    color: Colors.light,
  },
});

export default CreateFicheScreen;
