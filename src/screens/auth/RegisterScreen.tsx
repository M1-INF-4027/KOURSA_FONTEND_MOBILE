/**
 * Koursa - Register Screen
 * Inscription multi-etapes avec experience utilisateur premium
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  LayoutAnimation,
  UIManager,
} from 'react-native';

// Activer LayoutAnimation sur Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenContainer,
  Text,
  LogoText,
  Input,
  PasswordInput,
  Button,
  Spacer,
  Icon,
  GoogleSignInButton,
} from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import {
  rolesService,
  filieresService,
  niveauxService,
} from '../../api/services';
import { Filiere, Niveau, GooglePrefillData } from '../../types';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/spacing';

const TOTAL_STEPS = 2;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  navigation: any;
  route: any;
}

// ─── Selection Card Component ────────────────────────────────────────────────
interface SelectionCardProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: string;
  subtitle?: string;
}

const SelectionCard: React.FC<SelectionCardProps> = ({
  label,
  selected,
  onPress,
  icon,
  subtitle,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[
      selCardStyles.card,
      selected && selCardStyles.cardSelected,
    ]}>
    <View style={selCardStyles.cardContent}>
      {icon && (
        <View
          style={[
            selCardStyles.iconWrap,
            selected && selCardStyles.iconWrapSelected,
          ]}>
          <Icon
            name={icon}
            size={20}
            color={selected ? Colors.light : Colors.primary}
          />
        </View>
      )}
      <View style={selCardStyles.textWrap}>
        <Text
          variant="bodySmall"
          style={[
            selCardStyles.label,
            selected && selCardStyles.labelSelected,
          ]}>
          {label}
        </Text>
        {subtitle && (
          <Text variant="caption" color="tertiary" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
    {selected && (
      <View style={selCardStyles.checkCircle}>
        <Icon name="check" size={14} color={Colors.light} />
      </View>
    )}
  </TouchableOpacity>
);

const selCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconWrapSelected: {
    backgroundColor: Colors.primary,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontWeight: '600',
  },
  labelSelected: {
    color: Colors.primary,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
});

// ─── Step Indicator ──────────────────────────────────────────────────────────
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  labels,
}) => (
  <View style={stepStyles.container}>
    {Array.from({ length: totalSteps }, (_, i) => {
      const isActive = i === currentStep;
      const isCompleted = i < currentStep;
      return (
        <React.Fragment key={i}>
          <View style={stepStyles.stepItem}>
            <View
              style={[
                stepStyles.circle,
                isActive && stepStyles.circleActive,
                isCompleted && stepStyles.circleCompleted,
              ]}>
              {isCompleted ? (
                <Icon name="check" size={14} color={Colors.light} />
              ) : (
                <Text
                  style={[
                    stepStyles.circleText,
                    (isActive || isCompleted) && stepStyles.circleTextActive,
                  ]}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text
              variant="caption"
              style={[
                stepStyles.label,
                isActive && stepStyles.labelActive,
                isCompleted && stepStyles.labelCompleted,
              ]}>
              {labels[i]}
            </Text>
          </View>
          {i < totalSteps - 1 && (
            <View
              style={[
                stepStyles.connector,
                isCompleted && stepStyles.connectorCompleted,
              ]}
            />
          )}
        </React.Fragment>
      );
    })}
  </View>
);

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  stepItem: {
    alignItems: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  circleActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  circleCompleted: {
    backgroundColor: Colors.success,
  },
  circleText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.gray[500],
  },
  circleTextActive: {
    color: Colors.light,
  },
  label: {
    color: Colors.gray[400],
    fontSize: 11,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  labelCompleted: {
    color: Colors.success,
    fontWeight: '600',
  },
  connector: {
    height: 2,
    width: 40,
    backgroundColor: Colors.gray[200],
    marginBottom: Spacing.lg,
    marginHorizontal: Spacing.xs,
    borderRadius: 1,
  },
  connectorCompleted: {
    backgroundColor: Colors.success,
  },
});

// ─── Main Component ──────────────────────────────────────────────────────────
const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { register, googleSignIn, googleCompleteRegistration } = useAuth();
  const { showError, showSuccess } = useToast();
  const scrollRef = useRef<ScrollView>(null);

  // Google mode
  const googleDataFromParams = route.params?.googleData as GooglePrefillData | undefined;
  const [isGoogleMode, setIsGoogleMode] = useState(!!googleDataFromParams);
  const [googleIdToken, setGoogleIdToken] = useState(googleDataFromParams?.idToken || '');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Step state
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Step 1: Personal info
  const [firstName, setFirstName] = useState(googleDataFromParams?.firstName || '');
  const [lastName, setLastName] = useState(googleDataFromParams?.lastName || '');
  const [email, setEmail] = useState(googleDataFromParams?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Step 2: Academic structure (reconstruit depuis filieres + niveaux, tous AllowAny)
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);

  const [selectedFaculte, setSelectedFaculte] = useState<number | null>(null);
  const [selectedDepartement, setSelectedDepartement] = useState<number | null>(null);
  const [selectedFiliere, setSelectedFiliere] = useState<number | null>(null);
  const [selectedNiveau, setSelectedNiveau] = useState<number | null>(null);

  const [delegueRoleId, setDelegueRoleId] = useState<number | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Charger le role delegue au mount (leger, juste les roles)
  useEffect(() => {
    loadDelegueRole();
  }, []);

  const loadDelegueRole = async () => {
    try {
      const rolesRes = await rolesService.getAll();
      const delegue = rolesRes.data.find((r) => r.nom_role === 'Délégué');
      if (delegue) setDelegueRoleId(delegue.id);
    } catch (err) {
      console.error('Error loading roles:', err);
    }
  };

  // Charger les donnees academiques (uniquement filieres + niveaux, tous AllowAny)
  const loadAcademicData = async () => {
    if (dataLoaded) return;
    setLoadingData(true);
    try {
      const [filieresRes, niveauxRes] = await Promise.all([
        filieresService.getAll(),
        niveauxService.getAll(),
      ]);

      setFilieres(filieresRes.data);
      setNiveaux(niveauxRes.data);
      setDataLoaded(true);
    } catch (err) {
      console.error('Error loading academic data:', err);
      showError('Impossible de charger les donnees. Verifiez votre connexion.', 'Erreur');
    } finally {
      setLoadingData(false);
    }
  };

  // Reconstruire la hierarchie depuis les filieres
  const uniqueFacultes = filieres.reduce<{ id: number; nom: string }[]>(
    (acc, f) => {
      if (!acc.some((fac) => fac.id === f.faculte)) {
        acc.push({ id: f.faculte, nom: f.nom_faculte });
      }
      return acc;
    },
    []
  );

  const uniqueDepartements = filieres
    .filter((f) => f.faculte === selectedFaculte)
    .reduce<{ id: number; nom: string }[]>((acc, f) => {
      if (!acc.some((d) => d.id === f.departement)) {
        acc.push({ id: f.departement, nom: f.nom_departement });
      }
      return acc;
    }, []);

  const filteredFilieres = filieres.filter(
    (f) => f.departement === selectedDepartement
  );
  const filteredNiveaux = niveaux.filter(
    (n) => n.filiere === selectedFiliere
  );

  // Animate step transition
  const animateTransition = useCallback(
    (callback: () => void) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        callback();
        scrollRef.current?.scrollTo({ y: 0, animated: false });
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    },
    [fadeAnim]
  );

  // ─── Validation ──────────────────────────────────────────────────────────
  const validateStep1 = () => {
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

    // Skip password validation en mode Google
    if (!isGoogleMode) {
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
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = () => {
    if (!selectedNiveau) {
      showError('Veuillez selectionner votre niveau', 'Champ requis');
      return false;
    }
    return true;
  };

  // ─── Navigation ──────────────────────────────────────────────────────────
  const handleNext = () => {
    if (currentStep === 0) {
      if (!validateStep1()) return;
      animateTransition(() => {
        setCurrentStep(1);
        loadAcademicData();
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      animateTransition(() => setCurrentStep(currentStep - 1));
    } else {
      navigation.navigate('Login');
    }
  };

  // ─── Selection handlers avec animation ──────────────────────────────────
  const animateLayout = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(250, 'easeInEaseOut', 'opacity')
    );
  };

  const handleSelectFaculte = (id: number) => {
    animateLayout();
    setSelectedFaculte(id === selectedFaculte ? null : id);
    setSelectedDepartement(null);
    setSelectedFiliere(null);
    setSelectedNiveau(null);
  };

  const handleSelectDepartement = (id: number) => {
    animateLayout();
    setSelectedDepartement(id === selectedDepartement ? null : id);
    setSelectedFiliere(null);
    setSelectedNiveau(null);
  };

  const handleSelectFiliere = (id: number) => {
    animateLayout();
    setSelectedFiliere(id === selectedFiliere ? null : id);
    setSelectedNiveau(null);
  };

  const handleSelectNiveau = (id: number) => {
    animateLayout();
    setSelectedNiveau(id === selectedNiveau ? null : id);
  };

  // ─── Google Sign-In depuis l'ecran d'inscription ─────────────────────────
  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      const result = await googleSignIn();
      if (result.type === 'authenticated') {
        // Utilisateur existant -> auto-login, navigation automatique
        return;
      }
      // Utilisateur n'existe pas -> passer en mode Google avec pre-remplissage
      setIsGoogleMode(true);
      setGoogleIdToken(result.data.idToken);
      setFirstName(result.data.firstName);
      setLastName(result.data.lastName);
      setEmail(result.data.email);
      // Avancer directement a l'etape 2
      animateTransition(() => {
        setCurrentStep(1);
        loadAcademicData();
      });
    } catch (err: any) {
      showError(err.message || 'Erreur Google Sign-In', 'Echec');
    } finally {
      setGoogleLoading(false);
    }
  };

  // ─── Submit ──────────────────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!validateStep2()) return;

    if (!delegueRoleId) {
      showError(
        'Impossible de charger le role Delegue. Veuillez reessayer.',
        'Echec'
      );
      return;
    }

    setLoading(true);
    try {
      if (isGoogleMode) {
        await googleCompleteRegistration(
          googleIdToken,
          [delegueRoleId],
          selectedNiveau,
        );
      } else {
        await register({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          password,
          roles_ids: [delegueRoleId],
          niveau_represente: selectedNiveau,
        });
      }
      showSuccess('Votre demande d\'inscription a ete envoyee !', 'Bienvenue');
    } catch (err: any) {
      showError(
        err.message || "Erreur lors de l'inscription",
        'Echec'
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Render helpers ──────────────────────────────────────────────────────
  const getSelectedFaculteName = () =>
    uniqueFacultes.find((f) => f.id === selectedFaculte)?.nom;
  const getSelectedDepartementName = () =>
    uniqueDepartements.find((d) => d.id === selectedDepartement)?.nom;
  const getSelectedFiliereName = () =>
    filieres.find((f) => f.id === selectedFiliere)?.nom_filiere;

  // ─── Step 1: Personal info ──────────────────────────────────────────────
  const renderStep1 = () => (
    <>
      <Text variant="h4" style={styles.stepTitle}>
        Informations personnelles
      </Text>
      <Text variant="bodySmall" color="secondary" style={styles.stepSubtitle}>
        {isGoogleMode
          ? 'Verifiez vos informations recuperees depuis Google'
          : 'Renseignez vos informations pour creer votre compte delegue'}
      </Text>

      <Spacer size="lg" />

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

      {!isGoogleMode && (
        <>
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
        </>
      )}
    </>
  );

  // ─── Step 2: Academic selection ─────────────────────────────────────────
  const renderStep2 = () => {
    if (loadingData) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text variant="body" color="secondary" style={styles.loadingText}>
            Chargement des donnees...
          </Text>
        </View>
      );
    }

    if (!dataLoaded && !loadingData) {
      return (
        <View style={styles.loadingContainer}>
          <Icon name="alert-circle" size={48} color={Colors.error} />
          <Text variant="body" color="secondary" style={styles.loadingText}>
            Impossible de charger les donnees
          </Text>
          <Spacer size="md" />
          <Button
            title="Reessayer"
            onPress={loadAcademicData}
            variant="outline"
            icon="arrow-right"
            iconPosition="right"
          />
        </View>
      );
    }

    return (
      <>
        <Text variant="h4" style={styles.stepTitle}>
          Structure academique
        </Text>
        <Text variant="bodySmall" color="secondary" style={styles.stepSubtitle}>
          Selectionnez votre faculte, departement, filiere et niveau
        </Text>

        <Spacer size="lg" />

        {/* Faculte */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Icon name="school-outline" size={18} color={Colors.primary} />
            <Text variant="labelLarge" style={styles.sectionLabel}>
              Faculte
            </Text>
          </View>
          {uniqueFacultes.map((f) => (
            <SelectionCard
              key={f.id}
              label={f.nom}
              selected={selectedFaculte === f.id}
              onPress={() => handleSelectFaculte(f.id)}
              icon="domain"
            />
          ))}
          {uniqueFacultes.length === 0 && (
            <Text variant="bodySmall" color="tertiary" style={styles.emptyText}>
              Aucune faculte disponible
            </Text>
          )}
        </View>

        {/* Departement */}
        {selectedFaculte !== null && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Icon name="office-building-outline" size={18} color={Colors.primary} />
              <Text variant="labelLarge" style={styles.sectionLabel}>
                Departement
              </Text>
              <Text variant="caption" color="tertiary" style={styles.sectionHint}>
                {getSelectedFaculteName()}
              </Text>
            </View>
            {uniqueDepartements.map((d) => (
              <SelectionCard
                key={d.id}
                label={d.nom}
                selected={selectedDepartement === d.id}
                onPress={() => handleSelectDepartement(d.id)}
                icon="account-group-outline"
              />
            ))}
            {uniqueDepartements.length === 0 && (
              <Text variant="bodySmall" color="tertiary" style={styles.emptyText}>
                Aucun departement dans cette faculte
              </Text>
            )}
          </View>
        )}

        {/* Filiere */}
        {selectedDepartement !== null && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Icon name="book-open-variant" size={18} color={Colors.primary} />
              <Text variant="labelLarge" style={styles.sectionLabel}>
                Filiere
              </Text>
              <Text variant="caption" color="tertiary" style={styles.sectionHint}>
                {getSelectedDepartementName()}
              </Text>
            </View>
            {filteredFilieres.map((f) => (
              <SelectionCard
                key={f.id}
                label={f.nom_filiere}
                selected={selectedFiliere === f.id}
                onPress={() => handleSelectFiliere(f.id)}
                icon="bookmark-outline"
              />
            ))}
            {filteredFilieres.length === 0 && (
              <Text variant="bodySmall" color="tertiary" style={styles.emptyText}>
                Aucune filiere dans ce departement
              </Text>
            )}
          </View>
        )}

        {/* Niveau */}
        {selectedFiliere !== null && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Icon name="school" size={18} color={Colors.primary} />
              <Text variant="labelLarge" style={styles.sectionLabel}>
                Niveau
              </Text>
              <Text variant="caption" color="tertiary" style={styles.sectionHint}>
                {getSelectedFiliereName()}
              </Text>
            </View>
            {filteredNiveaux.map((n) => (
              <SelectionCard
                key={n.id}
                label={n.nom_niveau}
                selected={selectedNiveau === n.id}
                onPress={() => handleSelectNiveau(n.id)}
                icon="stairs"
              />
            ))}
            {filteredNiveaux.length === 0 && (
              <Text variant="bodySmall" color="tertiary" style={styles.emptyText}>
                Aucun niveau dans cette filiere
              </Text>
            )}
          </View>
        )}

        {/* Selection summary */}
        {selectedNiveau !== null && (
          <View style={styles.summaryCard}>
            <Icon name="check-circle" size={20} color={Colors.success} />
            <View style={styles.summaryContent}>
              <Text variant="labelLarge" color="success" style={styles.summaryTitle}>
                Selection complete
              </Text>
              <Text variant="caption" color="secondary">
                {getSelectedFaculteName()} {'>'} {getSelectedDepartementName()} {'>'}{' '}
                {getSelectedFiliereName()} {'>'}{' '}
                {niveaux.find((n) => n.id === selectedNiveau)?.nom_niveau}
              </Text>
            </View>
          </View>
        )}
      </>
    );
  };

  // ─── Main render ─────────────────────────────────────────────────────────
  return (
    <ScreenContainer
      backgroundColor={Colors.primary}
      statusBarStyle="light-content"
      edges={[]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}>
              <Icon name="arrow-left" size={22} color={Colors.light} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoIcon}>K</Text>
              </View>
            </View>
            <View style={styles.backButton} />
          </View>
          <LogoText style={styles.logoText}>KOURSA</LogoText>
        </View>

        {/* Form container */}
        <View
          style={[
            styles.formContainer,
            { paddingBottom: insets.bottom },
          ]}>
          {/* Step indicator */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            labels={['Profil', 'Academique']}
          />

          {/* Scrollable content */}
          <ScrollView
            ref={scrollRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <Animated.View style={{ opacity: fadeAnim }}>
              {currentStep === 0 && renderStep1()}
              {currentStep === 1 && renderStep2()}
            </Animated.View>

            <Spacer size="lg" />

            {/* Action buttons */}
            <View style={styles.buttonsContainer}>
              {currentStep === 0 ? (
                <>
                  <Button
                    title="Continuer"
                    onPress={handleNext}
                    fullWidth
                    icon="arrow-right"
                    iconPosition="right"
                    style={styles.primaryButton}
                  />
                  {!isGoogleMode && (
                    <>
                      <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text
                          variant="caption"
                          color="tertiary"
                          style={styles.dividerText}>
                          ou
                        </Text>
                        <View style={styles.dividerLine} />
                      </View>
                      <GoogleSignInButton
                        onPress={handleGoogleRegister}
                        loading={googleLoading}
                        title="S'inscrire avec Google"
                        style={styles.googleButton}
                      />
                    </>
                  )}
                  <Button
                    title="Deja un compte ? Se connecter"
                    onPress={() => navigation.navigate('Login')}
                    variant="ghost"
                    fullWidth
                  />
                </>
              ) : (
                <>
                  <Button
                    title={loading ? 'Inscription...' : "S'inscrire"}
                    onPress={handleRegister}
                    loading={loading}
                    disabled={!selectedNiveau}
                    fullWidth
                    icon={loading ? undefined : 'check'}
                    iconPosition="right"
                    style={styles.primaryButton}
                  />
                  <Button
                    title="Retour"
                    onPress={handleBack}
                    variant="outline"
                    fullWidth
                    icon="arrow-left"
                    style={styles.secondaryButton}
                  />
                </>
              )}
            </View>

            <Spacer size="3xl" />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  logoIcon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  logoText: {
    color: Colors.light,
    fontSize: 20,
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
    paddingHorizontal: Spacing.lg,
  },
  // Steps
  stepTitle: {
    marginBottom: Spacing.xs,
  },
  stepSubtitle: {
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  // Academic sections
  sectionBlock: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    marginLeft: Spacing.sm,
    color: Colors.text.primary,
  },
  sectionHint: {
    marginLeft: 'auto',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: Spacing.lg,
    fontStyle: 'italic',
  },
  // Summary card
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  summaryContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  summaryTitle: {
    marginBottom: 2,
  },
  // Loading
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['5xl'],
  },
  loadingText: {
    marginTop: Spacing.md,
  },
  // Buttons
  buttonsContainer: {
    marginTop: Spacing.sm,
  },
  primaryButton: {
    marginBottom: Spacing.md,
  },
  secondaryButton: {
    marginBottom: Spacing.md,
  },
  googleButton: {
    marginBottom: Spacing.md,
  },
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
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
