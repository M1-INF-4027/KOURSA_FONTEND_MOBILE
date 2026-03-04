/**
 * Koursa - Create Fiche Screen
 * Creation de fiche de suivi edge-to-edge professionnel
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import { AlertDialog } from '../../components/ui/Dialog';
import { fichesSuiviService, unitesEnseignementService, sallesService } from '../../api/services';
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
  const [sallesList, setSallesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFiche, setLoadingFiche] = useState(isEditMode);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);

  // Form state
  const [selectedUe, setSelectedUe] = useState<number | null>(null);
  const [selectedEnseignant, setSelectedEnseignant] = useState<number | null>(null);
  const [dateCours, setDateCours] = useState(new Date().toISOString().split('T')[0]);
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [selectedSalle, setSelectedSalle] = useState<number | null>(null);
  const [showSallePicker, setShowSallePicker] = useState(false);
  const [typeSeance, setTypeSeance] = useState<TypeSeance>('CM');
  const [titreChapitre, setTitreChapitre] = useState('');
  const [contenuAborde, setContenuAborde] = useState('');
  const [showUePicker, setShowUePicker] = useState(false);
  const [showEnseignantPicker, setShowEnseignantPicker] = useState(false);

  // Date/Time picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDebutPicker, setShowDebutPicker] = useState(false);
  const [showFinPicker, setShowFinPicker] = useState(false);

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
      setSelectedSalle(fiche.salle || null);
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
      const [ueResponse, sallesResponse] = await Promise.all([
        unitesEnseignementService.getAll(),
        sallesService.getAll(),
      ]);
      const data = Array.isArray(ueResponse.data) ? ueResponse.data : ueResponse.data?.results || [];
      setUes(data);
      const sallesData = Array.isArray(sallesResponse.data) ? sallesResponse.data : sallesResponse.data?.results || [];
      setSallesList(sallesData.filter((s: any) => s.est_active));
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

  const getSelectedSalleLabel = () => {
    if (!selectedSalle) return 'Selectionner une salle (optionnel)';
    const salle = sallesList.find((s) => s.id === selectedSalle);
    if (!salle) return 'Selectionner une salle (optionnel)';
    return salle.batiment ? `${salle.nom_salle} (${salle.batiment})` : salle.nom_salle;
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

  const checkConflicts = async (): Promise<any[]> => {
    if (!dateCours || !heureDebut || !heureFin) return [];
    try {
      const res = await fichesSuiviService.checkConflicts({
        salle: selectedSalle || null,
        enseignant: selectedEnseignant || null,
        date_cours: dateCours,
        heure_debut: heureDebut,
        heure_fin: heureFin,
        exclude_fiche_id: isEditMode && ficheId ? ficheId : undefined,
      });
      return res.data.conflicts || [];
    } catch {
      return [];
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Check conflicts before submitting
      const detectedConflicts = await checkConflicts();
      setConflicts(detectedConflicts);

      const payload = {
        ue: selectedUe!,
        enseignant: selectedEnseignant!,
        date_cours: dateCours,
        heure_debut: heureDebut,
        heure_fin: heureFin,
        salle: selectedSalle || null,
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
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        // Map backend snake_case field names to camelCase state keys
        const fieldMap: Record<string, string> = {
          date_cours: 'dateCours',
          heure_debut: 'heureDebut',
          heure_fin: 'heureFin',
          titre_chapitre: 'titreChapitre',
          contenu_aborde: 'contenuAborde',
          ue: 'ue',
          enseignant: 'enseignant',
        };

        const fieldErrors: Record<string, string> = {};
        const nonFieldMessages: string[] = [];

        for (const [key, value] of Object.entries(data)) {
          const msg = Array.isArray(value) ? value[0] : String(value);

          if (key === 'detail') {
            nonFieldMessages.push(msg);
          } else if (key === 'non_field_errors') {
            const msgs = Array.isArray(value) ? value : [value];
            nonFieldMessages.push(...msgs.map(String));
          } else if (fieldMap[key]) {
            fieldErrors[fieldMap[key]] = msg;
          } else {
            nonFieldMessages.push(msg);
          }
        }

        if (Object.keys(fieldErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
          showError('Veuillez corriger les erreurs dans le formulaire', 'Echec');
        }

        if (nonFieldMessages.length > 0) {
          showError(nonFieldMessages.join('\n'), 'Echec');
        }

        if (Object.keys(fieldErrors).length === 0 && nonFieldMessages.length === 0) {
          showError(isEditMode ? 'Erreur lors de la modification' : 'Erreur lors de la creation', 'Echec');
        }
      } else {
        showError(isEditMode ? 'Erreur lors de la modification' : 'Erreur lors de la creation', 'Echec');
      }
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

  // Date/Time picker limits
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - 30);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);

  const parseDate = (dateStr: string): Date => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date();
  };

  const parseTime = (timeStr: string): Date => {
    const d = new Date();
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      d.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
    }
    return d;
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      setDateCours(`${y}-${m}-${d}`);
      setErrors((prev) => ({ ...prev, dateCours: '' }));
    }
  };

  const handleDebutChange = (_event: any, selectedTime?: Date) => {
    setShowDebutPicker(Platform.OS === 'ios');
    if (selectedTime) {
      const h = String(selectedTime.getHours()).padStart(2, '0');
      const m = String(selectedTime.getMinutes()).padStart(2, '0');
      setHeureDebut(`${h}:${m}`);
      setErrors((prev) => ({ ...prev, heureDebut: '' }));
    }
  };

  const handleFinChange = (_event: any, selectedTime?: Date) => {
    setShowFinPicker(Platform.OS === 'ios');
    if (selectedTime) {
      const h = String(selectedTime.getHours()).padStart(2, '0');
      const m = String(selectedTime.getMinutes()).padStart(2, '0');
      setHeureFin(`${h}:${m}`);
      setErrors((prev) => ({ ...prev, heureFin: '' }));
    }
  };

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
                  {ues.length === 0 ? (
                    <View style={{ padding: Spacing.md, alignItems: 'center' }}>
                      <Icon name="alert-circle-outline" size={32} color={Colors.text.tertiary} />
                      <Text variant="body" color="tertiary" style={{ marginTop: Spacing.sm, textAlign: 'center' }}>
                        Aucune UE disponible pour votre niveau
                      </Text>
                      <Text variant="caption" color="tertiary" style={{ marginTop: Spacing.xs, textAlign: 'center' }}>
                        Contactez votre chef de departement
                      </Text>
                    </View>
                  ) : (
                    ues.map((ue) => (
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
                    ))
                  )}
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

            {/* Date picker */}
            <Text variant="label" style={styles.label}>
              Date du cours *
            </Text>
            <TouchableOpacity
              style={[styles.pickerButton, errors.dateCours ? styles.pickerButtonError : null]}
              activeOpacity={0.7}
              onPress={() => setShowDatePicker(true)}>
              <Icon name="calendar" size={20} color={Colors.gray[400]} style={{ marginRight: Spacing.sm }} />
              <Text variant="body" color={dateCours ? 'primary' : 'tertiary'} style={{ flex: 1 }}>
                {dateCours || 'Selectionner une date'}
              </Text>
            </TouchableOpacity>
            {errors.dateCours ? (
              <Text variant="caption" style={styles.errorText}>{errors.dateCours}</Text>
            ) : null}
            {showDatePicker && (
              <DateTimePicker
                value={parseDate(dateCours)}
                mode="date"
                display="default"
                minimumDate={minDate}
                maximumDate={maxDate}
                onChange={handleDateChange}
              />
            )}

            <Spacer size="sm" />

            {/* Heure debut / fin pickers */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text variant="label" style={styles.label}>
                  Heure debut *
                </Text>
                <TouchableOpacity
                  style={[styles.pickerButton, errors.heureDebut ? styles.pickerButtonError : null]}
                  activeOpacity={0.7}
                  onPress={() => setShowDebutPicker(true)}>
                  <Icon name="clock-outline" size={20} color={Colors.gray[400]} style={{ marginRight: Spacing.sm }} />
                  <Text variant="body" color={heureDebut ? 'primary' : 'tertiary'} style={{ flex: 1 }}>
                    {heureDebut || 'HH:MM'}
                  </Text>
                </TouchableOpacity>
                {errors.heureDebut ? (
                  <Text variant="caption" style={styles.errorText}>{errors.heureDebut}</Text>
                ) : null}
                {showDebutPicker && (
                  <DateTimePicker
                    value={heureDebut ? parseTime(heureDebut) : new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleDebutChange}
                  />
                )}
              </View>
              <View style={styles.halfInput}>
                <Text variant="label" style={styles.label}>
                  Heure fin *
                </Text>
                <TouchableOpacity
                  style={[styles.pickerButton, errors.heureFin ? styles.pickerButtonError : null]}
                  activeOpacity={0.7}
                  onPress={() => setShowFinPicker(true)}>
                  <Icon name="clock-outline" size={20} color={Colors.gray[400]} style={{ marginRight: Spacing.sm }} />
                  <Text variant="body" color={heureFin ? 'primary' : 'tertiary'} style={{ flex: 1 }}>
                    {heureFin || 'HH:MM'}
                  </Text>
                </TouchableOpacity>
                {errors.heureFin ? (
                  <Text variant="caption" style={styles.errorText}>{errors.heureFin}</Text>
                ) : null}
                {showFinPicker && (
                  <DateTimePicker
                    value={heureFin ? parseTime(heureFin) : new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleFinChange}
                  />
                )}
              </View>
            </View>

            {/* Salle Picker */}
            <Text variant="label" style={styles.label}>
              Salle
            </Text>
            <TouchableOpacity
              style={styles.uePicker}
              activeOpacity={0.7}
              onPress={() => setShowSallePicker(!showSallePicker)}>
              <Text
                variant="body"
                color={selectedSalle ? 'primary' : 'tertiary'}
                style={styles.uePickerText}>
                {getSelectedSalleLabel()}
              </Text>
              <Icon
                name={showSallePicker ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>

            {showSallePicker && (
              <Card style={styles.ueList}>
                <CardContent>
                  {/* Option to clear selection */}
                  <TouchableOpacity
                    style={[styles.ueItem, !selectedSalle && styles.ueItemSelected]}
                    onPress={() => {
                      setSelectedSalle(null);
                      setShowSallePicker(false);
                    }}>
                    <Text variant="body" color="tertiary">Aucune salle</Text>
                    {!selectedSalle && <Icon name="check" size={20} color={Colors.primary} />}
                  </TouchableOpacity>
                  {sallesList.map((s) => (
                    <TouchableOpacity
                      key={s.id}
                      style={[
                        styles.ueItem,
                        selectedSalle === s.id && styles.ueItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedSalle(s.id);
                        setShowSallePicker(false);
                      }}>
                      <Text variant="body" color={selectedSalle === s.id ? 'primary' : 'primary'}>
                        {s.nom_salle}{s.batiment ? ` (${s.batiment})` : ''}
                      </Text>
                      {selectedSalle === s.id && (
                        <Icon name="check" size={20} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </CardContent>
              </Card>
            )}

            <Spacer size={12} />

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

          {/* Conflicts warning */}
          {conflicts.length > 0 && (
            <Card style={styles.conflictCard}>
              <CardContent>
                <View style={styles.conflictHeader}>
                  <Icon name="alert" size={20} color={Colors.status.warning} />
                  <Text variant="subtitle" style={styles.conflictTitle}>Conflits detectes</Text>
                </View>
                {conflicts.map((c: any, i: number) => (
                  <Text key={i} variant="caption" style={styles.conflictMessage}>
                    {c.type === 'salle' ? '🏫 ' : '👨‍🏫 '}{c.message}
                  </Text>
                ))}
                <Text variant="caption" color="tertiary" style={{ marginTop: Spacing.sm }}>
                  Ces conflits sont informatifs. Vous pouvez quand meme soumettre la fiche.
                </Text>
              </CardContent>
            </Card>
          )}

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
      <AlertDialog
        visible={showSuccessDialog}
        onDismiss={handleSuccessConfirm}
        title="Succes"
        message={isEditMode
          ? "Votre fiche a ete modifiee et resoumise. Elle est en attente de validation par l'enseignant."
          : "Votre fiche de suivi a ete creee avec succes. Elle est en attente de validation par l'enseignant."}
        confirmText="OK"
        onConfirm={handleSuccessConfirm}
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
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  pickerButtonError: {
    borderColor: Colors.status.error,
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
  conflictCard: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.status.warning,
    marginTop: Spacing.md,
  },
  conflictHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  conflictTitle: {
    color: Colors.status.warning,
    fontWeight: '700',
  },
  conflictMessage: {
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
});

export default CreateFicheScreen;
