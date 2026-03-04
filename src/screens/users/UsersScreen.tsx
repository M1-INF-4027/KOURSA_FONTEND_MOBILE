/**
 * Koursa - Users Screen
 * Ecran de liste des utilisateurs
 * Vue groupee pour les delegues (Chef, Enseignants, Delegues)
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
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
  Section,
} from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { usersService, rolesService } from '../../api/services';
import { useAuth } from '../../contexts/AuthContext';
import { Utilisateur, Role, StatutCompte } from '../../types';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';

// Types pour la reponse mes-utilisateurs
interface MesUtilisateursUE {
  id: number;
  code_ue: string;
  libelle_ue: string;
}

interface MesUtilisateursEnseignant {
  id: number;
  nom_complet: string;
  email: string;
  ues: MesUtilisateursUE[];
}

interface MesUtilisateursPersonne {
  id: number;
  nom_complet: string;
  email: string;
}

interface MesUtilisateursResponse {
  classe: string;
  chef: MesUtilisateursPersonne | null;
  enseignants: MesUtilisateursEnseignant[];
  delegues: MesUtilisateursPersonne[];
}

interface Props {
  navigation: any;
}

const UsersScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { showError } = useToast();
  const { user: currentUser } = useAuth();

  const isDelegue = currentUser?.roles?.some(
    (r) => r.nom_role === 'Délégué' || r.nom_role === 'Delegue'
  ) ?? false;

  if (isDelegue) {
    return <DelegueUsersView navigation={navigation} />;
  }

  return <DefaultUsersView navigation={navigation} />;
};

// ============================================================
// Vue DELEGUE: affichage groupe Chef / Enseignants / Delegues
// ============================================================

const DelegueUsersView: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { showError } = useToast();

  const [data, setData] = useState<MesUtilisateursResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedEnseignant, setExpandedEnseignant] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersService.getMesUtilisateurs();
      setData(res.data as MesUtilisateursResponse);
    } catch (error) {
      console.error('Error loading mes-utilisateurs:', error);
      showError('Impossible de charger les utilisateurs', 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const toggleEnseignant = (id: number) => {
    setExpandedEnseignant((prev) => (prev === id ? null : id));
  };

  const getInitials = (nomComplet: string) => {
    const parts = nomComplet.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return `${first}${last}`.toUpperCase();
  };

  const renderPersonCard = (
    person: MesUtilisateursPersonne,
    color: string,
  ) => (
    <Card key={person.id} style={styles.userCard}>
      <CardContent>
        <View style={styles.userRow}>
          <Avatar initials={getInitials(person.nom_complet)} size="lg" color={color} />
          <View style={styles.userInfo}>
            <Text variant="subtitle" numberOfLines={1}>
              {person.nom_complet}
            </Text>
            <Text variant="caption" color="tertiary" numberOfLines={1}>
              {person.email}
            </Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );

  const renderEnseignantCard = (enseignant: MesUtilisateursEnseignant) => {
    const isExpanded = expandedEnseignant === enseignant.id;
    return (
      <Card key={enseignant.id} style={styles.userCard} onPress={() => toggleEnseignant(enseignant.id)}>
        <CardContent>
          <View style={styles.userRow}>
            <Avatar
              initials={getInitials(enseignant.nom_complet)}
              size="lg"
              color={Colors.primary}
            />
            <View style={styles.userInfo}>
              <View style={styles.enseignantHeader}>
                <Text variant="subtitle" style={{ flex: 1 }} numberOfLines={1}>
                  {enseignant.nom_complet}
                </Text>
                <Icon
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.gray[400]}
                />
              </View>
              <Text variant="caption" color="tertiary" numberOfLines={1}>
                {enseignant.email}
              </Text>
              <Text variant="caption" color="secondary" style={styles.ueCount}>
                {enseignant.ues.length} UE{enseignant.ues.length > 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          {isExpanded && enseignant.ues.length > 0 && (
            <View style={styles.uesContainer}>
              {enseignant.ues.map((ue) => (
                <Chip
                  key={ue.id}
                  label={`${ue.code_ue} - ${ue.libelle_ue}`}
                  color="primary"
                  size="small"
                  style={styles.ueChip}
                />
              ))}
            </View>
          )}
        </CardContent>
      </Card>
    );
  };

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
        {data && (
          <Text variant="caption" style={styles.headerSubtitle}>
            {data.classe}
          </Text>
        )}
      </View>

      {/* Contenu */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }>
        {data ? (
          <>
            {/* Chef de departement */}
            <Section title="Chef de departement">
              {data.chef ? (
                renderPersonCard(data.chef, Colors.accent)
              ) : (
                <Text variant="caption" color="tertiary" style={styles.emptySection}>
                  Aucun chef assigne
                </Text>
              )}
            </Section>

            {/* Enseignants */}
            <Section title="Enseignants">
              {data.enseignants.length > 0 ? (
                data.enseignants.map(renderEnseignantCard)
              ) : (
                <Text variant="caption" color="tertiary" style={styles.emptySection}>
                  Aucun enseignant trouve
                </Text>
              )}
            </Section>

            {/* Co-delegues */}
            <Section title="Co-delegues">
              {data.delegues.length > 0 ? (
                data.delegues.map((d) => renderPersonCard(d, Colors.secondary))
              ) : (
                <Text variant="caption" color="tertiary" style={styles.emptySection}>
                  Aucun autre delegue
                </Text>
              )}
            </Section>

            <Spacer size="3xl" />
          </>
        ) : !loading ? (
          <View style={styles.emptyContainer}>
            <Icon name="account-group" size={64} color={Colors.gray[300]} />
            <Text variant="body" color="secondary" style={styles.emptyText}>
              Aucune donnee disponible
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
};

// ============================================================
// Vue par defaut (non-delegue): comportement existant inchange
// ============================================================

const DefaultUsersView: React.FC<Props> = ({ navigation }) => {
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
  headerSubtitle: {
    color: Colors.light,
    textAlign: 'center',
    opacity: 0.8,
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
  scrollContent: {
    padding: Spacing.base,
    paddingTop: Spacing.lg,
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
  // Enseignant
  enseignantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ueCount: {
    marginTop: Spacing.xs,
  },
  uesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  ueChip: {
    marginBottom: Spacing.xs,
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
  emptySection: {
    paddingVertical: Spacing.md,
    textAlign: 'center',
  },
});

export default UsersScreen;
