/**
 * Koursa - Users Screen
 * Ecran de gestion des utilisateurs
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Searchbar, Chip } from 'react-native-paper';
import { Text, Icon } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { usersService } from '../../api/services';
import { Utilisateur, StatutCompte } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/config';

type FilterStatus = 'ALL' | StatutCompte;

const UsersScreen: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('ALL');

  const isChefDepartement = currentUser?.roles.some(
    (r) => r.nom_role === 'Chef de Département'
  );
  const isSuperAdmin = currentUser?.roles.some(
    (r) => r.nom_role === 'Super Administrateur'
  );
  const canManageUsers = isChefDepartement || isSuperAdmin;

  const loadUsers = useCallback(async () => {
    try {
      const response = await usersService.getAll();
      const data = Array.isArray(response.data) ? response.data : response.data.results ?? [];
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, selectedFilter, users]);

  const filterUsers = () => {
    let result = [...users];

    // Filtre par statut
    if (selectedFilter !== 'ALL') {
      result = result.filter((u) => u.statut === selectedFilter);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.first_name?.toLowerCase().includes(query) ||
          u.last_name?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(result);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  }, [loadUsers]);

  const getStatusColor = (status: StatutCompte) => {
    switch (status) {
      case 'ACTIF':
        return Colors.success;
      case 'EN_ATTENTE':
        return Colors.warning;
      case 'INACTIF':
        return Colors.error;
      default:
        return Colors.gray[500];
    }
  };

  const getStatusLabel = (status: StatutCompte) => {
    switch (status) {
      case 'ACTIF':
        return 'Actif';
      case 'EN_ATTENTE':
        return 'En attente';
      case 'INACTIF':
        return 'Inactif';
      default:
        return status;
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'Super Administrateur':
        return Colors.roles.superAdmin;
      case 'Chef de Département':
        return Colors.roles.chefDepartement;
      case 'Enseignant':
        return Colors.roles.enseignant;
      case 'Délégué':
        return Colors.roles.delegue;
      default:
        return Colors.gray[500];
    }
  };

  const handleApproveUser = async (userId: number) => {
    Alert.alert(
      'Approuver l\'utilisateur',
      'Voulez-vous vraiment approuver cet utilisateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Approuver',
          onPress: async () => {
            try {
              await api.post(`/users/utilisateurs/${userId}/approuver-delegue/`);
              Alert.alert('Succes', 'Utilisateur approuve avec succes');
              loadUsers();
            } catch (error: any) {
              const message =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                'Erreur lors de l\'approbation';
              Alert.alert('Erreur', message);
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = async (user: Utilisateur) => {
    const newStatus = user.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF';
    const action = newStatus === 'ACTIF' ? 'activer' : 'desactiver';

    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} l'utilisateur`,
      `Voulez-vous vraiment ${action} cet utilisateur ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              await usersService.update(user.id, { statut: newStatus } as any);
              Alert.alert('Succes', `Utilisateur ${action} avec succes`);
              loadUsers();
            } catch (error: any) {
              const message =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                `Erreur lors de l'${action}ation`;
              Alert.alert('Erreur', message);
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: Utilisateur }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.avatarContainer}>
          <Text variant="h5" color="inverse">
            {item.first_name?.[0] || '?'}
            {item.last_name?.[0] || '?'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text variant="h6" color="primary" numberOfLines={1}>
            {item.first_name} {item.last_name}
          </Text>
          <Text variant="bodySmall" color="secondary" numberOfLines={1}>
            {item.email}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.statut) },
          ]}
        >
          <Text variant="caption" color="inverse">
            {getStatusLabel(item.statut)}
          </Text>
        </View>
      </View>

      <View style={styles.rolesContainer}>
        {item.roles.map((role) => (
          <View
            key={role.id}
            style={[styles.roleBadge, { backgroundColor: getRoleColor(role.nom_role) }]}
          >
            <Text variant="caption" color="inverse">
              {role.nom_role}
            </Text>
          </View>
        ))}
      </View>

      {canManageUsers && item.id !== currentUser?.id && (
        <View style={styles.actionsContainer}>
          {item.statut === 'EN_ATTENTE' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: Colors.successLight }]}
              onPress={() => handleApproveUser(item.id)}
            >
              <Icon name="check" size={18} color={Colors.success} />
              <Text variant="bodySmall" color="success" style={styles.actionText}>
                Approuver
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor:
                  item.statut === 'ACTIF' ? Colors.errorLight : Colors.successLight,
              },
            ]}
            onPress={() => handleToggleStatus(item)}
          >
            <Icon
              name={item.statut === 'ACTIF' ? 'account-off' : 'account-check'}
              size={18}
              color={item.statut === 'ACTIF' ? Colors.error : Colors.success}
            />
            <Text
              variant="bodySmall"
              color={item.statut === 'ACTIF' ? 'error' : 'success'}
              style={styles.actionText}
            >
              {item.statut === 'ACTIF' ? 'Desactiver' : 'Activer'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Searchbar
        placeholder="Rechercher un utilisateur..."
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
          Tous ({users.length})
        </Chip>
        <Chip
          selected={selectedFilter === 'ACTIF'}
          onPress={() => setSelectedFilter('ACTIF')}
          style={[
            styles.chip,
            selectedFilter === 'ACTIF' && { backgroundColor: Colors.success },
          ]}
          textStyle={selectedFilter === 'ACTIF' ? styles.chipTextSelected : undefined}
        >
          Actifs
        </Chip>
        <Chip
          selected={selectedFilter === 'EN_ATTENTE'}
          onPress={() => setSelectedFilter('EN_ATTENTE')}
          style={[
            styles.chip,
            selectedFilter === 'EN_ATTENTE' && { backgroundColor: Colors.warning },
          ]}
          textStyle={
            selectedFilter === 'EN_ATTENTE' ? styles.chipTextSelected : undefined
          }
        >
          En attente
        </Chip>
        <Chip
          selected={selectedFilter === 'INACTIF'}
          onPress={() => setSelectedFilter('INACTIF')}
          style={[
            styles.chip,
            selectedFilter === 'INACTIF' && { backgroundColor: Colors.error },
          ]}
          textStyle={selectedFilter === 'INACTIF' ? styles.chipTextSelected : undefined}
        >
          Inactifs
        </Chip>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="account-group-outline" size={64} color={Colors.gray[300]} />
      <Text variant="h5" color="tertiary" style={styles.emptyTitle}>
        Aucun utilisateur trouve
      </Text>
      <Text variant="body" color="tertiary" style={styles.emptyText}>
        {searchQuery || selectedFilter !== 'ALL'
          ? 'Essayez de modifier vos filtres'
          : 'Les utilisateurs apparaitront ici'}
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
          Utilisateurs
        </Text>
        <Text variant="body" color="secondary">
          {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
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
  userCard: {
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
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: {
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

export default UsersScreen;
