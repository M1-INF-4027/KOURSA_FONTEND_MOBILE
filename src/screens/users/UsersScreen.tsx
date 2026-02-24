/**
 * Koursa - Users Screen
 * Ecran de liste des utilisateurs
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenContainer,
  Text,
  Card,
  CardContent,
  Avatar,
  Chip,
  Input,
  Icon,
  Spacer,
} from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { usersService, rolesService } from '../../api/services';
import { Utilisateur, Role, StatutCompte } from '../../types';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';

interface Props {
  navigation: any;
}

const UsersScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { showError } = useToast();

  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Utilisateur[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filterRole]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        usersService.getAll(),
        rolesService.getAll(),
      ]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
    } catch (error) {
      console.error('Error loading users:', error);
      showError('Impossible de charger les utilisateurs', 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const filterUsers = useCallback(() => {
    let result = users;

    // Filtrer par role
    if (filterRole !== 'all') {
      result = result.filter((u) =>
        u.roles.some((r) => r.nom_role === filterRole)
      );
    }

    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.first_name?.toLowerCase().includes(query) ||
          u.last_name?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(result);
  }, [users, searchQuery, filterRole]);

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'Super Administrateur':
        return Colors.status.error;
      case 'Chef de Departement':
        return Colors.accent;
      case 'Enseignant':
        return Colors.primary;
      case 'Delegue':
      case 'Délégué':
        return Colors.secondary;
      default:
        return Colors.gray[500];
    }
  };

  const getRoleChipColor = (roleName: string): 'error' | 'accent' | 'primary' | 'success' | 'neutral' => {
    switch (roleName) {
      case 'Super Administrateur':
        return 'error';
      case 'Chef de Departement':
        return 'accent';
      case 'Enseignant':
        return 'primary';
      case 'Delegue':
      case 'Délégué':
        return 'success';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (statut: StatutCompte) => {
    switch (statut) {
      case 'ACTIF':
        return 'Actif';
      case 'INACTIF':
        return 'Inactif';
      case 'EN_ATTENTE':
        return 'En attente';
      default:
        return statut;
    }
  };

  const getStatusChipColor = (statut: StatutCompte): 'success' | 'error' | 'warning' | 'neutral' => {
    switch (statut) {
      case 'ACTIF':
        return 'success';
      case 'INACTIF':
        return 'error';
      case 'EN_ATTENTE':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getUserInitials = (user: Utilisateur) => {
    const first = user.first_name?.[0] || '';
    const last = user.last_name?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  const roleFilters = [
    { value: 'all', label: 'Tous' },
    ...roles.map((r) => ({ value: r.nom_role, label: r.nom_role })),
  ];

  const renderUserItem = ({ item }: { item: Utilisateur }) => (
    <Card style={styles.userCard}>
      <CardContent>
        <View style={styles.userRow}>
          <Avatar
            initials={getUserInitials(item)}
            size="lg"
            color={item.roles?.[0] ? getRoleColor(item.roles[0].nom_role) : Colors.gray[400]}
          />
          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text variant="subtitle" style={styles.userName} numberOfLines={1}>
                {item.first_name} {item.last_name}
              </Text>
              <Chip
                label={getStatusLabel(item.statut)}
                color={getStatusChipColor(item.statut)}
                size="small"
              />
            </View>
            <Text variant="caption" color="tertiary" numberOfLines={1}>
              {item.email}
            </Text>
            <View style={styles.rolesRow}>
              {item.roles?.map((role) => (
                <Chip
                  key={role.id}
                  label={role.nom_role}
                  color={getRoleChipColor(role.nom_role)}
                  size="small"
                />
              ))}
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );

  return (
    <ScreenContainer
      backgroundColor={Colors.primary}
      statusBarStyle="light-content"
      edges={[]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text variant="h5" style={styles.headerTitle}>
          Utilisateurs
        </Text>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="magnify"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        {/* Filtres par role */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}>
          {roleFilters.map((filter) => (
            <Chip
              key={filter.value}
              label={filter.label}
              selected={filterRole === filter.value}
              onPress={() => setFilterRole(filter.value)}
              color={filterRole === filter.value ? 'primary' : 'neutral'}
              size="small"
              style={styles.filterChip}
            />
          ))}
        </ScrollView>

        {/* Liste */}
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadData}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="account-group" size={64} color={Colors.gray[300]} />
              <Text variant="body" color="secondary" style={styles.emptyText}>
                Aucun utilisateur trouve
              </Text>
              <Text variant="caption" color="tertiary" style={styles.emptySubtext}>
                {searchQuery || filterRole !== 'all'
                  ? 'Essayez de modifier vos filtres'
                  : 'Aucun utilisateur enregistre'}
              </Text>
            </View>
          }
          ListFooterComponent={<Spacer size="3xl" />}
        />
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
  headerTitle: {
    color: Colors.light,
    textAlign: 'center',
    marginBottom: Spacing.md,
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
  // User card
  userCard: {
    marginBottom: Spacing.md,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  userName: {
    flex: 1,
  },
  rolesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  // Empty
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
});

export default UsersScreen;
