/**
 * Koursa - Academic Screen
 * Ecran affichant les informations academiques (UEs, Niveaux, Filieres)
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
import { Searchbar } from 'react-native-paper';
import { Text, Icon } from '../../components/ui';
import { Colors } from '../../constants/colors';
import {
  unitesEnseignementService,
  niveauxService,
  filieresService,
} from '../../api/services';
import { UniteEnseignement, Niveau, Filiere } from '../../types';

type TabType = 'ues' | 'niveaux' | 'filieres';

const AcademicScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ues');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [ues, setUes] = useState<UniteEnseignement[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [uesRes, niveauxRes, filieresRes] = await Promise.all([
        unitesEnseignementService.getAll(),
        niveauxService.getAll(),
        filieresService.getAll(),
      ]);
      setUes(uesRes.data);
      setNiveaux(niveauxRes.data);
      setFilieres(filieresRes.data);
    } catch (error) {
      console.error('Error loading academic data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const filterData = <T extends { [key: string]: any }>(
    data: T[],
    searchFields: (keyof T)[]
  ): T[] => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) =>
        String(item[field]).toLowerCase().includes(query)
      )
    );
  };

  const renderUEItem = ({ item }: { item: UniteEnseignement }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.codeBadge}>
          <Text variant="caption" color="inverse">
            {item.code_ue}
          </Text>
        </View>
        <View style={styles.semestreBadge}>
          <Text variant="caption" color="primary">
            S{item.semestre}
          </Text>
        </View>
      </View>
      <Text variant="h6" color="primary" style={styles.cardTitle}>
        {item.libelle_ue}
      </Text>
      <View style={styles.cardFooter}>
        <View style={styles.infoRow}>
          <Icon name="account-multiple" size={16} color={Colors.gray[500]} />
          <Text variant="bodySmall" color="tertiary" style={styles.infoText}>
            {item.enseignants.length} enseignant(s)
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="school" size={16} color={Colors.gray[500]} />
          <Text variant="bodySmall" color="tertiary" style={styles.infoText}>
            {item.niveaux.length} niveau(x)
          </Text>
        </View>
      </View>
    </View>
  );

  const renderNiveauItem = ({ item }: { item: Niveau }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.codeBadge, { backgroundColor: Colors.accent }]}>
          <Text variant="caption" color="inverse">
            Niveau
          </Text>
        </View>
      </View>
      <Text variant="h6" color="primary" style={styles.cardTitle}>
        {item.nom_niveau}
      </Text>
      <View style={styles.infoRow}>
        <Icon name="folder" size={16} color={Colors.gray[500]} />
        <Text variant="bodySmall" color="tertiary" style={styles.infoText}>
          {item.nom_filiere}
        </Text>
      </View>
    </View>
  );

  const renderFiliereItem = ({ item }: { item: Filiere }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.codeBadge, { backgroundColor: Colors.secondary }]}>
          <Text variant="caption" color="inverse">
            Filiere
          </Text>
        </View>
      </View>
      <Text variant="h6" color="primary" style={styles.cardTitle}>
        {item.nom_filiere}
      </Text>
      <View style={styles.infoRow}>
        <Icon name="domain" size={16} color={Colors.gray[500]} />
        <Text variant="bodySmall" color="tertiary" style={styles.infoText}>
          {item.nom_departement}
        </Text>
      </View>
    </View>
  );

  const getCurrentData = () => {
    switch (activeTab) {
      case 'ues':
        return filterData(ues, ['code_ue', 'libelle_ue']);
      case 'niveaux':
        return filterData(niveaux, ['nom_niveau', 'nom_filiere']);
      case 'filieres':
        return filterData(filieres, ['nom_filiere', 'nom_departement']);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (activeTab) {
      case 'ues':
        return renderUEItem({ item });
      case 'niveaux':
        return renderNiveauItem({ item });
      case 'filieres':
        return renderFiliereItem({ item });
    }
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="database-off" size={64} color={Colors.gray[300]} />
      <Text variant="h5" color="tertiary" style={styles.emptyTitle}>
        Aucune donnee trouvee
      </Text>
      <Text variant="body" color="tertiary" style={styles.emptyText}>
        {searchQuery ? 'Modifiez votre recherche' : 'Les donnees apparaitront ici'}
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
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h4" color="primary">
          Academique
        </Text>
        <Text variant="body" color="secondary">
          Structure academique
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ues' && styles.tabActive]}
          onPress={() => setActiveTab('ues')}
        >
          <Icon
            name="book-open-variant"
            size={20}
            color={activeTab === 'ues' ? Colors.primary : Colors.gray[500]}
          />
          <Text
            variant="label"
            color={activeTab === 'ues' ? 'primary' : 'tertiary'}
            style={styles.tabText}
          >
            UEs ({ues.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'niveaux' && styles.tabActive]}
          onPress={() => setActiveTab('niveaux')}
        >
          <Icon
            name="school"
            size={20}
            color={activeTab === 'niveaux' ? Colors.primary : Colors.gray[500]}
          />
          <Text
            variant="label"
            color={activeTab === 'niveaux' ? 'primary' : 'tertiary'}
            style={styles.tabText}
          >
            Niveaux ({niveaux.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'filieres' && styles.tabActive]}
          onPress={() => setActiveTab('filieres')}
        >
          <Icon
            name="folder-multiple"
            size={20}
            color={activeTab === 'filieres' ? Colors.primary : Colors.gray[500]}
          />
          <Text
            variant="label"
            color={activeTab === 'filieres' ? 'primary' : 'tertiary'}
            style={styles.tabText}
          >
            Filieres ({filieres.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Rechercher..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
      </View>

      {/* List */}
      <FlatList
        data={getCurrentData()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.light,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.primarySurface,
  },
  tabText: {
    marginLeft: 6,
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    backgroundColor: Colors.light,
    borderRadius: 12,
    elevation: 0,
  },
  searchInput: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: Colors.light,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  codeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  semestreBadge: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 6,
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
});

export default AcademicScreen;
