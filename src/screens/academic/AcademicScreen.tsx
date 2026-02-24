/**
 * Koursa - Academic Screen
 * Ecran de la structure academique hierarchique
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenContainer,
  Text,
  Card,
  CardContent,
  Chip,
  Icon,
  Spacer,
  Divider,
} from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import {
  facultesService,
  departementsService,
  filieresService,
  niveauxService,
} from '../../api/services';
import { Faculte, Departement, Filiere, Niveau } from '../../types';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';

interface Props {
  navigation: any;
}

const AcademicScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { showError } = useToast();

  const [facultes, setFacultes] = useState<Faculte[]>([]);
  const [departements, setDepartements] = useState<Departement[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [loading, setLoading] = useState(true);

  // Etat d'expansion
  const [expandedFacultes, setExpandedFacultes] = useState<Set<number>>(new Set());
  const [expandedDepartements, setExpandedDepartements] = useState<Set<number>>(new Set());
  const [expandedFilieres, setExpandedFilieres] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [facRes, depRes, filRes, nivRes] = await Promise.all([
        facultesService.getAll(),
        departementsService.getAll(),
        filieresService.getAll(),
        niveauxService.getAll(),
      ]);
      setFacultes(facRes.data);
      setDepartements(depRes.data);
      setFilieres(filRes.data);
      setNiveaux(nivRes.data);
    } catch (error) {
      console.error('Error loading academic data:', error);
      showError('Impossible de charger les donnees academiques', 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const getDepartementsByFaculte = (faculteId: number) =>
    departements.filter((d) => d.faculte === faculteId);

  const getFilieresByDepartement = (departementId: number) =>
    filieres.filter((f) => f.departement === departementId);

  const getNiveauxByFiliere = (filiereId: number) =>
    niveaux.filter((n) => n.filiere === filiereId);

  const toggleFaculte = (id: number) => {
    setExpandedFacultes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleDepartement = (id: number) => {
    setExpandedDepartements((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFiliere = (id: number) => {
    setExpandedFilieres((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderNiveaux = (filiereId: number) => {
    const nivs = getNiveauxByFiliere(filiereId);
    if (nivs.length === 0) {
      return (
        <Text variant="caption" color="tertiary" style={styles.emptySubLevel}>
          Aucun niveau
        </Text>
      );
    }
    return (
      <View style={styles.niveauxContainer}>
        {nivs.map((niveau) => (
          <Chip
            key={niveau.id}
            label={niveau.nom_niveau}
            color="success"
            size="small"
            icon="school"
          />
        ))}
      </View>
    );
  };

  const renderFilieres = (departementId: number) => {
    const fils = getFilieresByDepartement(departementId);
    if (fils.length === 0) {
      return (
        <Text variant="caption" color="tertiary" style={styles.emptySubLevel}>
          Aucune filiere
        </Text>
      );
    }
    return fils.map((filiere) => (
      <View key={filiere.id} style={styles.filiereContainer}>
        <TouchableOpacity
          style={styles.filiereRow}
          activeOpacity={0.7}
          onPress={() => toggleFiliere(filiere.id)}>
          <Icon name="book-open-variant" size={18} color={Colors.accent} />
          <Text variant="body" style={styles.filiereName} numberOfLines={1}>
            {filiere.nom_filiere}
          </Text>
          <Icon
            name={expandedFilieres.has(filiere.id) ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={Colors.gray[400]}
          />
        </TouchableOpacity>
        {expandedFilieres.has(filiere.id) && (
          <View style={styles.niveauxWrapper}>
            {renderNiveaux(filiere.id)}
          </View>
        )}
      </View>
    ));
  };

  const renderDepartements = (faculteId: number) => {
    const deps = getDepartementsByFaculte(faculteId);
    if (deps.length === 0) {
      return (
        <Text variant="caption" color="tertiary" style={styles.emptySubLevel}>
          Aucun departement
        </Text>
      );
    }
    return deps.map((dept) => (
      <View key={dept.id} style={styles.departementContainer}>
        <TouchableOpacity
          style={styles.departementRow}
          activeOpacity={0.7}
          onPress={() => toggleDepartement(dept.id)}>
          <Icon name="account-group" size={20} color={Colors.secondary} />
          <View style={styles.deptInfo}>
            <Text variant="subtitle" style={styles.deptName} numberOfLines={1}>
              {dept.nom_departement}
            </Text>
            {dept.nom_chef && (
              <Text variant="caption" color="tertiary" numberOfLines={1}>
                Chef : {dept.nom_chef}
              </Text>
            )}
          </View>
          <Icon
            name={expandedDepartements.has(dept.id) ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={Colors.gray[400]}
          />
        </TouchableOpacity>
        {expandedDepartements.has(dept.id) && (
          <View style={styles.filieresWrapper}>
            {renderFilieres(dept.id)}
          </View>
        )}
      </View>
    ));
  };

  return (
    <ScreenContainer
      backgroundColor={Colors.primary}
      statusBarStyle="light-content"
      edges={[]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text variant="h5" style={styles.headerTitle}>
          Structure academique
        </Text>
      </View>

      {/* Contenu */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing['3xl'] }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : facultes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="school" size={64} color={Colors.gray[300]} />
            <Text variant="body" color="secondary" style={styles.emptyText}>
              Aucune donnee academique
            </Text>
          </View>
        ) : (
          facultes.map((faculte) => (
            <Card key={faculte.id} style={styles.faculteCard}>
              <TouchableOpacity
                style={styles.faculteRow}
                activeOpacity={0.7}
                onPress={() => toggleFaculte(faculte.id)}>
                <Icon name="school" size={24} color={Colors.primary} />
                <Text variant="h6" style={styles.faculteName} numberOfLines={2}>
                  {faculte.nom_faculte}
                </Text>
                <View style={styles.countBadge}>
                  <Text variant="caption" color="primary">
                    {getDepartementsByFaculte(faculte.id).length}
                  </Text>
                </View>
                <Icon
                  name={expandedFacultes.has(faculte.id) ? 'chevron-up' : 'chevron-down'}
                  size={22}
                  color={Colors.gray[400]}
                />
              </TouchableOpacity>
              {expandedFacultes.has(faculte.id) && (
                <View style={styles.departementsWrapper}>
                  <Divider />
                  {renderDepartements(faculte.id)}
                </View>
              )}
            </Card>
          ))
        )}
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
  loadingContainer: {
    paddingVertical: Spacing['4xl'],
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
  },
  emptyText: {
    marginTop: Spacing.lg,
  },
  // Faculte
  faculteCard: {
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  faculteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  faculteName: {
    flex: 1,
  },
  countBadge: {
    backgroundColor: `${Colors.primary}14`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  // Departement
  departementsWrapper: {
    paddingBottom: Spacing.sm,
  },
  departementContainer: {
    marginLeft: Spacing.lg,
  },
  departementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  deptInfo: {
    flex: 1,
  },
  deptName: {
    flex: 1,
  },
  // Filiere
  filieresWrapper: {
    marginLeft: Spacing.lg,
  },
  filiereContainer: {
    marginLeft: Spacing.md,
  },
  filiereRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  filiereName: {
    flex: 1,
  },
  // Niveaux
  niveauxWrapper: {
    marginLeft: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  niveauxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  emptySubLevel: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    fontStyle: 'italic',
  },
});

export default AcademicScreen;
