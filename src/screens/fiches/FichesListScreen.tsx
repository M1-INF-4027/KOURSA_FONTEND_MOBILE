/**
 * Koursa - Fiches List Screen
 * Liste des fiches de suivi edge-to-edge professionnel
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenContainer,
  Text,
  Card,
  CardContent,
  Input,
  Chip,
  SeanceTypeBadge,
  StatusBadge,
  Spacer,
  IconButton,
  Icon,
} from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { fichesSuiviService } from '../../api/services';
import { FicheSuivi, StatutFiche } from '../../types';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/spacing';

interface Props {
  navigation: any;
}

type FilterStatus = 'all' | StatutFiche;

const FichesListScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { showError } = useToast();

  const [fiches, setFiches] = useState<FicheSuivi[]>([]);
  const [filteredFiches, setFilteredFiches] = useState<FicheSuivi[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  useEffect(() => {
    loadFiches();
  }, []);

  useEffect(() => {
    filterFiches();
  }, [fiches, searchQuery, filterStatus]);

  const loadFiches = async () => {
    setLoading(true);
    try {
      const response = await fichesSuiviService.getAll();
      setFiches(response.data);
    } catch (error) {
      console.error('Error loading fiches:', error);
      showError('Impossible de charger les fiches', 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const filterFiches = useCallback(() => {
    let result = fiches;

    // Filtrer par statut
    if (filterStatus !== 'all') {
      result = result.filter((f) => f.statut === filterStatus);
    }

    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.nom_ue?.toLowerCase().includes(query) ||
          f.titre_chapitre?.toLowerCase().includes(query) ||
          f.contenu_aborde?.toLowerCase().includes(query)
      );
    }

    setFilteredFiches(result);
  }, [fiches, searchQuery, filterStatus]);

  const filters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'Toutes' },
    { value: 'SOUMISE', label: 'En attente' },
    { value: 'VALIDEE', label: 'Validees' },
    { value: 'REFUSEE', label: 'Refusees' },
  ];

  const renderFicheItem = ({ item }: { item: FicheSuivi }) => (
    <TouchableOpacity
      style={styles.ficheCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('FicheDetail', { ficheId: item.id })}>
      <Card>
        <CardContent>
          <View style={styles.ficheHeader}>
            <View style={styles.ficheInfo}>
              <SeanceTypeBadge type={item.type_seance} />
              <Text variant="subtitle" style={styles.ficheUe} numberOfLines={1}>
                {item.nom_ue}
              </Text>
            </View>
            <StatusBadge status={item.statut} />
          </View>

          <Text variant="body" style={styles.ficheChapter} numberOfLines={2}>
            {item.titre_chapitre}
          </Text>

          <View style={styles.ficheFooter}>
            <View style={styles.fichteMeta}>
              <Icon name="calendar" size={14} color={Colors.text.tertiary} />
              <Text variant="caption" color="tertiary">
                {item.date_cours}
              </Text>
            </View>
            <View style={styles.fichteMeta}>
              <Icon name="clock-outline" size={14} color={Colors.text.tertiary} />
              <Text variant="caption" color="tertiary">
                {item.heure_debut} - {item.heure_fin}
              </Text>
            </View>
            {item.salle && (
              <View style={styles.fichteMeta}>
                <Icon name="door" size={14} color={Colors.text.tertiary} />
                <Text variant="caption" color="tertiary">
                  {item.salle}
                </Text>
              </View>
            )}
          </View>

          {item.nom_enseignant && (
            <View style={styles.enseignantRow}>
              <Icon name="account" size={14} color={Colors.text.secondary} />
              <Text variant="caption" color="secondary">
                {item.nom_enseignant}
              </Text>
            </View>
          )}
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer
      backgroundColor={Colors.primary}
      statusBarStyle="light-content"
      edges={[]}>
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
            Fiches de suivi
          </Text>
          <IconButton
            icon="filter-variant"
            size="md"
            color={Colors.light}
            onPress={() => {}}
          />
        </View>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Rechercher une fiche..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="magnify"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        {/* Filtres */}
        <View style={styles.filtersContainer}>
          {filters.map((filter) => (
            <Chip
              key={filter.value}
              label={filter.label}
              selected={filterStatus === filter.value}
              onPress={() => setFilterStatus(filter.value)}
              color={filterStatus === filter.value ? 'primary' : 'default'}
              size="sm"
              style={styles.filterChip}
            />
          ))}
        </View>

        {/* Liste des fiches */}
        <FlatList
          data={filteredFiches}
          renderItem={renderFicheItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadFiches}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="file-document-outline" size={64} color={Colors.gray[300]} />
              <Text variant="body" color="secondary" style={styles.emptyText}>
                Aucune fiche trouvee
              </Text>
              <Text variant="caption" color="tertiary" style={styles.emptySubtext}>
                {searchQuery || filterStatus !== 'all'
                  ? 'Essayez de modifier vos filtres'
                  : 'Creez votre premiere fiche de suivi'}
              </Text>
            </View>
          }
          ListFooterComponent={<Spacer size="3xl" />}
        />

        {/* FAB */}
        <TouchableOpacity
          style={[styles.fab, { bottom: insets.bottom + Spacing.lg }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CreateFiche')}>
          <Icon name="plus" size={28} color={Colors.light} />
        </TouchableOpacity>
      </View>
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
    marginBottom: Spacing.md,
  },
  headerTitle: {
    color: Colors.light,
    flex: 1,
    textAlign: 'center',
  },
  searchContainer: {
    marginTop: Spacing.sm,
  },
  searchInput: {
    backgroundColor: Colors.light,
    borderRadius: BorderRadius.lg,
  },
  // Content
  content: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
  },
  // Filters
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    marginRight: Spacing.xs,
  },
  // List
  listContent: {
    padding: Spacing.base,
    paddingTop: Spacing.sm,
  },
  // Fiche card
  ficheCard: {
    marginBottom: Spacing.md,
  },
  ficheHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  ficheInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  ficheUe: {
    flex: 1,
  },
  ficheChapter: {
    marginBottom: Spacing.md,
  },
  ficheFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  fichteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  enseignantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyText: {
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    marginTop: Spacing.xs,
  },
  // FAB
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
});

export default FichesListScreen;
