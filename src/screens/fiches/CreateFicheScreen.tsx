/**
 * Koursa - Create Fiche Screen
 * Ecran de creation d'une nouvelle fiche de suivi
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Text, Icon } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { fichesSuiviService, unitesEnseignementService } from '../../api/services';
import { UniteEnseignement, TypeSeance } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const CreateFicheScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [unites, setUnites] = useState<UniteEnseignement[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [formData, setFormData] = useState({
    ue: 0,
    enseignant: 0,
    date_cours: new Date(),
    heure_debut: new Date(),
    heure_fin: new Date(),
    salle: '',
    type_seance: 'CM' as TypeSeance,
    titre_chapitre: '',
    contenu_aborde: '',
  });

  useEffect(() => {
    loadUnites();
  }, []);

  const loadUnites = async () => {
    setLoading(true);
    try {
      const response = await unitesEnseignementService.getAll();
      setUnites(response.data);
    } catch (error) {
      console.error('Error loading UEs:', error);
      Alert.alert('Erreur', 'Impossible de charger les unites d\'enseignement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.ue) {
      Alert.alert('Erreur', 'Veuillez selectionner une unite d\'enseignement');
      return;
    }
    if (!formData.enseignant) {
      Alert.alert('Erreur', 'Veuillez selectionner un enseignant');
      return;
    }
    if (!formData.salle.trim()) {
      Alert.alert('Erreur', 'Veuillez indiquer la salle');
      return;
    }
    if (!formData.titre_chapitre.trim()) {
      Alert.alert('Erreur', 'Veuillez indiquer le titre du chapitre');
      return;
    }
    if (!formData.contenu_aborde.trim()) {
      Alert.alert('Erreur', 'Veuillez decrire le contenu aborde');
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        ue: formData.ue,
        enseignant: formData.enseignant,
        date_cours: formData.date_cours.toISOString().split('T')[0],
        heure_debut: formData.heure_debut.toTimeString().slice(0, 5),
        heure_fin: formData.heure_fin.toTimeString().slice(0, 5),
        salle: formData.salle.trim(),
        type_seance: formData.type_seance,
        titre_chapitre: formData.titre_chapitre.trim(),
        contenu_aborde: formData.contenu_aborde.trim(),
      };

      await fichesSuiviService.create(data);
      Alert.alert('Succes', 'Fiche de suivi creee avec succes', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('Error creating fiche:', error);
      const errorMessage = error.response?.data?.detail ||
        error.response?.data?.message ||
        'Impossible de creer la fiche de suivi';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedUE = unites.find(u => u.id === formData.ue);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text variant="h5" color="primary" style={styles.headerTitle}>
          Nouvelle fiche
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* UE Picker */}
        <View style={styles.inputGroup}>
          <Text variant="label" color="secondary" style={styles.label}>
            Unite d'enseignement *
          </Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={formData.ue}
              onValueChange={(value) => setFormData({ ...formData, ue: value, enseignant: 0 })}
            >
              <Picker.Item label="Selectionner une UE" value={0} />
              {unites.map((ue) => (
                <Picker.Item
                  key={ue.id}
                  label={`${ue.code_ue} - ${ue.libelle_ue}`}
                  value={ue.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Enseignant Picker */}
        {selectedUE && (
          <View style={styles.inputGroup}>
            <Text variant="label" color="secondary" style={styles.label}>
              Enseignant *
            </Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={formData.enseignant}
                onValueChange={(value) => setFormData({ ...formData, enseignant: value })}
              >
                <Picker.Item label="Selectionner un enseignant" value={0} />
                {selectedUE.enseignants.map((ensId) => (
                  <Picker.Item
                    key={ensId}
                    label={`Enseignant #${ensId}`}
                    value={ensId}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {/* Date */}
        <View style={styles.inputGroup}>
          <Text variant="label" color="secondary" style={styles.label}>
            Date du cours *
          </Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name="calendar" size={20} color={Colors.gray[500]} />
            <Text variant="body" color="primary" style={styles.dateText}>
              {formatDate(formData.date_cours)}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.date_cours}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setFormData({ ...formData, date_cours: date });
              }}
            />
          )}
        </View>

        {/* Heures */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text variant="label" color="secondary" style={styles.label}>
              Heure debut *
            </Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Icon name="clock-outline" size={20} color={Colors.gray[500]} />
              <Text variant="body" color="primary" style={styles.dateText}>
                {formatTime(formData.heure_debut)}
              </Text>
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={formData.heure_debut}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowStartTimePicker(false);
                  if (date) setFormData({ ...formData, heure_debut: date });
                }}
              />
            )}
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text variant="label" color="secondary" style={styles.label}>
              Heure fin *
            </Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Icon name="clock-outline" size={20} color={Colors.gray[500]} />
              <Text variant="body" color="primary" style={styles.dateText}>
                {formatTime(formData.heure_fin)}
              </Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={formData.heure_fin}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowEndTimePicker(false);
                  if (date) setFormData({ ...formData, heure_fin: date });
                }}
              />
            )}
          </View>
        </View>

        {/* Salle */}
        <TextInput
          label="Salle *"
          value={formData.salle}
          onChangeText={(text) => setFormData({ ...formData, salle: text })}
          mode="outlined"
          left={<TextInput.Icon icon="map-marker" />}
          style={styles.input}
          outlineColor={Colors.border.light}
          activeOutlineColor={Colors.primary}
        />

        {/* Type de seance */}
        <View style={styles.inputGroup}>
          <Text variant="label" color="secondary" style={styles.label}>
            Type de seance *
          </Text>
          <View style={styles.typeContainer}>
            {(['CM', 'TD', 'TP'] as TypeSeance[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  formData.type_seance === type && {
                    backgroundColor: Colors.seance[type],
                    borderColor: Colors.seance[type],
                  }
                ]}
                onPress={() => setFormData({ ...formData, type_seance: type })}
              >
                <Text
                  variant="label"
                  color={formData.type_seance === type ? 'inverse' : 'primary'}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Titre du chapitre */}
        <TextInput
          label="Titre du chapitre *"
          value={formData.titre_chapitre}
          onChangeText={(text) => setFormData({ ...formData, titre_chapitre: text })}
          mode="outlined"
          style={styles.input}
          outlineColor={Colors.border.light}
          activeOutlineColor={Colors.primary}
        />

        {/* Contenu aborde */}
        <TextInput
          label="Contenu aborde *"
          value={formData.contenu_aborde}
          onChangeText={(text) => setFormData({ ...formData, contenu_aborde: text })}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          outlineColor={Colors.border.light}
          activeOutlineColor={Colors.primary}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.light} />
          ) : (
            <>
              <Icon name="check" size={20} color={Colors.light} />
              <Text variant="button" color="inverse" style={styles.submitText}>
                Soumettre la fiche
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  picker: {
    backgroundColor: Colors.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: 'hidden',
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.light,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    padding: 16,
  },
  dateText: {
    marginLeft: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: 'center',
    backgroundColor: Colors.light,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    marginLeft: 8,
  },
});

export default CreateFicheScreen;
