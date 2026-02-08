/**
 * Koursa - Register Screen
 * Ecran d'inscription
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { Text, Icon } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import { rolesService, niveauxService, filieresService } from '../../api/services';
import { Role, Niveau, Filiere, RegisterData } from '../../types';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

type RoleType = 'delegue' | 'enseignant';

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = useState<RoleType>('delegue');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    selectedFiliere: 0,
    niveau_represente: 0,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rolesResponse, filieresResponse, niveauxResponse] = await Promise.all([
        rolesService.getAll(),
        filieresService.getAll(),
        niveauxService.getAll(),
      ]);
      const rolesData = Array.isArray(rolesResponse.data) ? rolesResponse.data : rolesResponse.data.results ?? [];
      const filieresData = Array.isArray(filieresResponse.data) ? filieresResponse.data : filieresResponse.data.results ?? [];
      const niveauxData = Array.isArray(niveauxResponse.data) ? niveauxResponse.data : niveauxResponse.data.results ?? [];
      setRoles(rolesData);
      setFilieres(filieresData);
      setNiveaux(niveauxData);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  // Filter niveaux by selected filière
  const filteredNiveaux = formData.selectedFiliere
    ? niveaux.filter((n) => n.filiere === formData.selectedFiliere)
    : [];

  const handleRegister = async () => {
    const { email, password, confirmPassword, first_name, last_name, niveau_represente } = formData;

    if (!email.trim() || !password.trim() || !first_name.trim() || !last_name.trim()) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caracteres');
      return;
    }

    if (selectedRole === 'delegue' && !niveau_represente) {
      setError('Veuillez selectionner un niveau a representer');
      return;
    }

    // Find the role ID
    const roleName = selectedRole === 'delegue' ? 'Délégué' : 'Enseignant';
    const role = roles.find(r => r.nom_role === roleName);
    if (!role) {
      setError(`Erreur: role ${roleName} introuvable`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const registerData: RegisterData = {
        email: email.trim(),
        password,
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        roles_ids: [role.id],
        ...(selectedRole === 'delegue' ? { niveau_represente } : {}),
      };

      await register(registerData);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text variant="h3" color="primary">
            Creer un compte
          </Text>
          <Text variant="body" color="secondary" style={styles.subtitle}>
            Rejoignez la plateforme Koursa
          </Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          {error && (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={20} color={Colors.error} />
              <Text variant="bodySmall" color="error" style={styles.errorText}>
                {error}
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <TextInput
              label="Prenom"
              value={formData.first_name}
              onChangeText={(text) => setFormData({ ...formData, first_name: text })}
              mode="outlined"
              style={[styles.input, styles.halfInput]}
              outlineColor={Colors.border.light}
              activeOutlineColor={Colors.primary}
            />
            <TextInput
              label="Nom"
              value={formData.last_name}
              onChangeText={(text) => setFormData({ ...formData, last_name: text })}
              mode="outlined"
              style={[styles.input, styles.halfInput]}
              outlineColor={Colors.border.light}
              activeOutlineColor={Colors.primary}
            />
          </View>

          <TextInput
            label="Adresse email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            left={<TextInput.Icon icon="email-outline" />}
            style={styles.input}
            outlineColor={Colors.border.light}
            activeOutlineColor={Colors.primary}
          />

          <TextInput
            label="Mot de passe"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            mode="outlined"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
            outlineColor={Colors.border.light}
            activeOutlineColor={Colors.primary}
          />

          <TextInput
            label="Confirmer le mot de passe"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            mode="outlined"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock-check-outline" />}
            style={styles.input}
            outlineColor={Colors.border.light}
            activeOutlineColor={Colors.primary}
          />

          {/* Role Selector */}
          <View style={styles.pickerContainer}>
            <Text variant="label" color="secondary" style={styles.pickerLabel}>
              Je suis
            </Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === 'delegue' && styles.roleButtonSelected,
                ]}
                onPress={() => { setSelectedRole('delegue'); setFormData({ ...formData, niveau_represente: 0 }); }}
              >
                <Icon name="account-group" size={20} color={selectedRole === 'delegue' ? Colors.light : Colors.text.primary} />
                <Text
                  variant="label"
                  color={selectedRole === 'delegue' ? 'inverse' : 'primary'}
                  style={styles.roleButtonText}
                >
                  Delegue
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === 'enseignant' && styles.roleButtonSelected,
                ]}
                onPress={() => setSelectedRole('enseignant')}
              >
                <Icon name="school" size={20} color={selectedRole === 'enseignant' ? Colors.light : Colors.text.primary} />
                <Text
                  variant="label"
                  color={selectedRole === 'enseignant' ? 'inverse' : 'primary'}
                  style={styles.roleButtonText}
                >
                  Enseignant
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Filière + Niveau Pickers (delegue only) */}
          {selectedRole === 'delegue' && (
            <>
              <View style={styles.pickerContainer}>
                <Text variant="label" color="secondary" style={styles.pickerLabel}>
                  Filiere
                </Text>
                <View style={styles.picker}>
                  <Picker
                    selectedValue={formData.selectedFiliere}
                    onValueChange={(value) => setFormData({ ...formData, selectedFiliere: value, niveau_represente: 0 })}
                  >
                    <Picker.Item label="Selectionner une filiere" value={0} />
                    {filieres.map((filiere) => (
                      <Picker.Item key={filiere.id} label={filiere.nom_filiere} value={filiere.id} />
                    ))}
                  </Picker>
                </View>
              </View>

              {formData.selectedFiliere > 0 && (
                <View style={styles.pickerContainer}>
                  <Text variant="label" color="secondary" style={styles.pickerLabel}>
                    Niveau a representer
                  </Text>
                  <View style={styles.picker}>
                    <Picker
                      selectedValue={formData.niveau_represente}
                      onValueChange={(value) => setFormData({ ...formData, niveau_represente: value })}
                    >
                      <Picker.Item label="Selectionner un niveau" value={0} />
                      {filteredNiveaux.map((niveau) => (
                        <Picker.Item
                          key={niveau.id}
                          label={niveau.nom_niveau}
                          value={niveau.id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}
            </>
          )}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.light} />
            ) : (
              <Text variant="button" color="inverse">
                S'inscrire
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.goBack()}
          >
            <Text variant="body" color="secondary">
              Deja un compte ?{' '}
            </Text>
            <Text variant="body" color="link">
              Se connecter
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 40,
  },
  backButton: {
    marginBottom: 16,
  },
  subtitle: {
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.light,
  },
  halfInput: {
    flex: 1,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    marginBottom: 8,
  },
  picker: {
    backgroundColor: Colors.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: 'hidden',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.light,
  },
  roleButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleButtonText: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
});

export default RegisterScreen;
