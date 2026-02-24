/**
 * Koursa - Fiche Detail Screen
 * Ecran de detail d'une fiche de suivi
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenContainer,
  Text,
  Card,
  CardContent,
  StatusBadge,
  SeanceTypeBadge,
  Spacer,
  IconButton,
  Icon,
  Divider,
  Section,
} from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { fichesSuiviService } from '../../api/services';
import { FicheSuivi } from '../../types';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';

interface Props {
  navigation: any;
  route: {
    params: {
      ficheId: number;
    };
  };
}

const FicheDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { ficheId } = route.params;
  const insets = useSafeAreaInsets();
  const { showError } = useToast();

  const [fiche, setFiche] = useState<FicheSuivi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiche();
  }, [ficheId]);

  const loadFiche = async () => {
    setLoading(true);
    try {
      const response = await fichesSuiviService.getById(ficheId);
      setFiche(response.data);
    } catch (error) {
      console.error('Error loading fiche:', error);
      showError('Impossible de charger la fiche', 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'VALIDEE':
        return Colors.status.success;
      case 'REFUSEE':
        return Colors.status.error;
      case 'SOUMISE':
        return Colors.status.warning;
      default:
        return Colors.gray[500];
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'VALIDEE':
        return 'Validee';
      case 'REFUSEE':
        return 'Refusee';
      case 'SOUMISE':
        return 'En attente de validation';
      default:
        return statut;
    }
  };

  if (loading) {
    return (
      <ScreenContainer backgroundColor={Colors.primary} statusBarStyle="light-content" edges={[]}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <View style={styles.headerRow}>
            <IconButton
              icon="arrow-left"
              size="md"
              color={Colors.light}
              onPress={() => navigation.goBack()}
            />
            <Text variant="h5" style={styles.headerTitle}>
              Detail de la fiche
            </Text>
            <View style={{ width: 40 }} />
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (!fiche) {
    return (
      <ScreenContainer backgroundColor={Colors.primary} statusBarStyle="light-content" edges={[]}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <View style={styles.headerRow}>
            <IconButton
              icon="arrow-left"
              size="md"
              color={Colors.light}
              onPress={() => navigation.goBack()}
            />
            <Text variant="h5" style={styles.headerTitle}>
              Detail de la fiche
            </Text>
            <View style={{ width: 40 }} />
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <Icon name="alert-circle-outline" size={64} color={Colors.gray[300]} />
          <Text variant="body" color="secondary" style={styles.errorText}>
            Fiche introuvable
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={Colors.primary} statusBarStyle="light-content" edges={[]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerRow}>
          <IconButton
            icon="arrow-left"
            size="md"
            color={Colors.light}
            onPress={() => navigation.goBack()}
          />
          <Text variant="h5" style={styles.headerTitle}>
            Detail de la fiche
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Contenu */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}>
        {/* Statut en haut */}
        <Card style={styles.statutCard}>
          <CardContent>
            <View style={styles.statutRow}>
              <View style={styles.statutInfo}>
                <View
                  style={[
                    styles.statutDot,
                    { backgroundColor: getStatutColor(fiche.statut) },
                  ]}
                />
                <Text variant="subtitle">{getStatutLabel(fiche.statut)}</Text>
              </View>
              <StatusBadge status={fiche.statut} />
            </View>
            {fiche.date_validation && (
              <Text variant="caption" color="tertiary" style={styles.statutDate}>
                Validee le {fiche.date_validation}
              </Text>
            )}
          </CardContent>
        </Card>

        {/* UE et type de seance */}
        <Section title="Unite d'enseignement">
          <Card>
            <CardContent>
              <View style={styles.ueRow}>
                <SeanceTypeBadge type={fiche.type_seance} />
                <View style={styles.ueInfo}>
                  <Text variant="subtitle">{fiche.nom_ue}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </Section>

        {/* Details du cours */}
        <Section title="Details du cours">
          <Card>
            <CardContent>
              <View style={styles.detailRow}>
                <Icon name="calendar" size={20} color={Colors.text.secondary} />
                <View style={styles.detailContent}>
                  <Text variant="caption" color="tertiary">Date</Text>
                  <Text variant="body">{fiche.date_cours}</Text>
                </View>
              </View>

              <Divider />

              <View style={styles.detailRow}>
                <Icon name="clock-outline" size={20} color={Colors.text.secondary} />
                <View style={styles.detailContent}>
                  <Text variant="caption" color="tertiary">Horaire</Text>
                  <Text variant="body">{fiche.heure_debut} - {fiche.heure_fin}</Text>
                </View>
                {fiche.duree && (
                  <Text variant="caption" color="tertiary" style={styles.dureeText}>
                    ({fiche.duree})
                  </Text>
                )}
              </View>

              {fiche.salle ? (
                <>
                  <Divider />
                  <View style={styles.detailRow}>
                    <Icon name="door" size={20} color={Colors.text.secondary} />
                    <View style={styles.detailContent}>
                      <Text variant="caption" color="tertiary">Salle</Text>
                      <Text variant="body">{fiche.salle}</Text>
                    </View>
                  </View>
                </>
              ) : null}
            </CardContent>
          </Card>
        </Section>

        {/* Contenu pedagogique */}
        <Section title="Contenu pedagogique">
          <Card>
            <CardContent>
              <Text variant="caption" color="tertiary">Chapitre</Text>
              <Text variant="subtitle" style={styles.chapitreTitle}>
                {fiche.titre_chapitre}
              </Text>

              <Divider />

              <Text variant="caption" color="tertiary">Contenu aborde</Text>
              <Text variant="body" style={styles.contenuText}>
                {fiche.contenu_aborde}
              </Text>
            </CardContent>
          </Card>
        </Section>

        {/* Personnes impliquees */}
        <Section title="Personnes">
          <Card>
            <CardContent>
              {fiche.nom_enseignant && (
                <View style={styles.personRow}>
                  <Icon name="account" size={20} color={Colors.primary} />
                  <View style={styles.personInfo}>
                    <Text variant="caption" color="tertiary">Enseignant</Text>
                    <Text variant="body">{fiche.nom_enseignant}</Text>
                  </View>
                </View>
              )}
              {fiche.nom_enseignant && fiche.nom_delegue && <Divider />}
              {fiche.nom_delegue && (
                <View style={styles.personRow}>
                  <Icon name="account-check" size={20} color={Colors.secondary} />
                  <View style={styles.personInfo}>
                    <Text variant="caption" color="tertiary">Delegue</Text>
                    <Text variant="body">{fiche.nom_delegue}</Text>
                  </View>
                </View>
              )}
            </CardContent>
          </Card>
        </Section>

        {/* Motif de refus (si refuse) */}
        {fiche.statut === 'REFUSEE' && fiche.motif_refus ? (
          <Section title="Motif du refus">
            <Card style={styles.refusCard}>
              <CardContent>
                <View style={styles.refusRow}>
                  <Icon name="alert-circle" size={20} color={Colors.status.error} />
                  <Text variant="body" style={styles.refusText}>
                    {fiche.motif_refus}
                  </Text>
                </View>
              </CardContent>
            </Card>
          </Section>
        ) : null}

        {/* Date de soumission */}
        <Text variant="caption" color="tertiary" style={styles.soumissionDate}>
          Soumise le {fiche.date_soumission}
        </Text>

        <Spacer size="xl" />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
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
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: Spacing.lg,
  },
  // Statut
  statutCard: {
    marginBottom: Spacing.md,
  },
  statutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statutDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statutDate: {
    marginTop: Spacing.xs,
  },
  // UE
  ueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  ueInfo: {
    flex: 1,
  },
  // Details
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  detailContent: {
    flex: 1,
  },
  dureeText: {
    alignSelf: 'flex-end',
  },
  // Contenu
  chapitreTitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  contenuText: {
    marginTop: Spacing.xs,
    lineHeight: 22,
  },
  // Personnes
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  personInfo: {
    flex: 1,
  },
  // Refus
  refusCard: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.status.error,
  },
  refusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  refusText: {
    flex: 1,
    lineHeight: 22,
  },
  // Soumission
  soumissionDate: {
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});

export default FicheDetailScreen;
