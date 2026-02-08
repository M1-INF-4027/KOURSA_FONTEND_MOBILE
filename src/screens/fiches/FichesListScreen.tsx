/**
 * Koursa - Fiches List Screen
 * Liste des fiches de suivi avec filtrage
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Searchbar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Text, Icon } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { fichesSuiviService } from '../../api/services';
import { FicheSuivi, StatutFiche } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

type FilterStatus = 'ALL' | StatutFiche;

const FichesListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [fiches, setFiches] = useState<FicheSuivi[]>([]);
  const [filteredFiches, setFilteredFiches] = useState<FicheSuivi[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('ALL');

  const isDelegue = user?.roles.some(r => r.nom_role === 'Délégué');

  const loadFiches = useCallback(async () => {
    try {
      const response = await fichesSuiviService.getAll();
      const data = Array.isArray(response.data) ? response.data : response.data.results ?? [];
      setFiches(data);
      setFilteredFiches(data);
    } catch (error) {
      console.error('Error loading fiches:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiches();
  }, [loadFiches]);

  useEffect(() => {
    filterFiches();
  }, [searchQuery, selectedFilter, fiches]);

  const filterFiches = () => {
    let result = [...fiches];

    // Filtre par statut
    if (selectedFilter !== 'ALL') {
      result = result.filter(f => f.statut === selectedFilter);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f =>
        f.nom_ue?.toLowerCase().includes(query) ||
        f.titre_chapitre?.toLowerCase().includes(query) ||
        f.contenu_aborde?.toLowerCase().includes(query) ||
        f.nom_enseignant?.toLowerCase().includes(query) ||
        f.classe?.toLowerCase().includes(query)
      );
    }

    setFilteredFiches(result);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFiches();
    setRefreshing(false);
  }, [loadFiches]);

  const getStatusColor = (status: StatutFiche) => {
    switch (status) {
      case 'SOUMISE': return Colors.status.soumise;
      case 'VALIDEE': return Colors.status.validee;
      case 'REFUSEE': return Colors.status.refusee;
      default: return Colors.gray[500];
    }
  };

  const getStatusLabel = (status: StatutFiche) => {
    switch (status) {
      case 'SOUMISE': return 'En attente';
      case 'VALIDEE': return 'Validee';
      case 'REFUSEE': return 'Refusee';
      default: return status;
    }
  };

  const renderFicheItem = ({ item }: { item: FicheSuivi }) => (
    <TouchableOpacity
      style={styles.ficheCard}
      onPress={() => navigation.navigate('FicheDetail', { ficheId: item.id })}
    >
      <View style={styles.ficheHeader}>
        <View style={[styles.typeBadge, { backgroundColor: Colors.seance[item.type_seance] }]}>
          <Text variant="caption" color="inverse">
            {item.type_seance}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.statut) }]}>
          <Text variant="caption" color="inverse">
            {getStatusLabel(item.statut)}
          </Text>
        </View>
      </View>

      <Text variant="h6" color="primary" numberOfLines={1} style={styles.ficheTitre}>
        {item.nom_ue}
      </Text>

      <Text variant="body" color="secondary" numberOfLines={2}>
        {item.titre_chapitre}
      </Text>

      {item.classe && (
        <View style={styles.classeRow}>
          <Icon name="school" size={14} color={Colors.gray[500]} />
          <Text variant="bodySmall" color="tertiary" style={styles.detailText}>
            {item.classe}{item.semestre ? ` (S${item.semestre})` : ''}
          </Text>
        </View>
      )}

      <View style={styles.ficheDetails}>
        <View style={styles.detailRow}>
          <Icon name="calendar" size={16} color={Colors.gray[500]} />
          <Text variant="bodySmall" color="tertiary" style={styles.detailText}>
            {item.date_cours}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="clock-outline" size={16} color={Colors.gray[500]} />
          <Text variant="bodySmall" color="tertiary" style={styles.detailText}>
            {item.heure_debut} - {item.heure_fin}
          </Text>
        </View>
      </View>

      <View style={styles.ficheFooter}>
        <View style={styles.detailRow}>
          <Icon name="account" size={16} color={Colors.gray[500]} />
          <Text variant="bodySmall" color="tertiary" style={styles.detailText}>
            {item.nom_enseignant || 'Non assigne'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="map-marker" size={16} color={Colors.gray[500]} />
          <Text variant="bodySmall" color="tertiary" style={styles.detailText}>
            {item.salle}
          </Text>
        </View>
      </View>

      {item.statut === 'REFUSEE' && item.motif_refus && (
        <View style={styles.refusContainer}>
          <Icon name="alert-circle" size={16} color={Colors.error} />
          <Text variant="bodySmall" color="error" style={styles.refusText}>
            {item.motif_refus}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Searchbar
        placeholder="Rechercher..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
      />

      <View style={styles.filtersContainer}>
        <Chip
          selected={selectedFilter === 'ALL'}
          onPress={() => setSelectedFilter('ALL')}
          style={[styles.chip, selectedFilter === 'ALL' && styles.chipSelected]}
          textStyle={selectedFilter === 'ALL' ? styles.chipTextSelected : undefined}
        >
          Toutes
        </Chip>
        <Chip
          selected={selectedFilter === 'SOUMISE'}
          onPress={() => setSelectedFilter('SOUMISE')}
          style={[styles.chip, selectedFilter === 'SOUMISE' && { backgroundColor: Colors.status.soumise }]}
          textStyle={selectedFilter === 'SOUMISE' ? styles.chipTextSelected : undefined}
        >
          En attente
        </Chip>
        <Chip
          selected={selectedFilter === 'VALIDEE'}
          onPress={() => setSelectedFilter('VALIDEE')}
          style={[styles.chip, selectedFilter === 'VALIDEE' && { backgroundColor: Colors.status.validee }]}
          textStyle={selectedFilter === 'VALIDEE' ? styles.chipTextSelected : undefined}
        >
          Validees
        </Chip>
        <Chip
          selected={selectedFilter === 'REFUSEE'}
          onPress={() => setSelectedFilter('REFUSEE')}
          style={[styles.chip, selectedFilter === 'REFUSEE' && { backgroundColor: Colors.status.refusee }]}
          textStyle={selectedFilter === 'REFUSEE' ? styles.chipTextSelected : undefined}
        >
          Refusees
        </Chip>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="file-document-outline" size={64} color={Colors.gray[300]} />
      <Text variant="h5" color="tertiary" style={styles.emptyTitle}>
        Aucune fiche trouvee
      </Text>
      <Text variant="body" color="tertiary" style={styles.emptyText}>
        {searchQuery || selectedFilter !== 'ALL'
          ? 'Essayez de modifier vos filtres'
          : 'Commencez par creer une nouvelle fiche'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h4" color="primary">
          Fiches de suivi
        </Text>
        <Text variant="body" color="secondary">
          {filteredFiches.length} fiche{filteredFiches.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={filteredFiches}
        renderItem={renderFicheItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {isDelegue && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateFiche')}
        >
          <Icon name="plus" size={28} color={Colors.light} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: Colors.light,
    borderRadius: 12,
    elevation: 0,
    marginBottom: 12,
  },
  searchInput: {
    fontSize: 14,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.gray[100],
  },
  chipSelected: {
    backgroundColor: Colors.primary,
  },
  chipTextSelected: {
    color: Colors.light,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  ficheCard: {
    backgroundColor: Colors.light,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ficheHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ficheTitre: {
    marginBottom: 4,
  },
  classeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: Colors.gray[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  ficheDetails: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  ficheFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
  },
  refusContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.errorLight,
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  refusText: {
    marginLeft: 8,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 48,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default FichesListScreen;
