/**
 * Koursa - Dashboard Screen
 * Ecran principal edge-to-edge professionnel
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenContainer,
  Text,
  Card,
  CardContent,
  StatCard,
  Avatar,
  Chip,
  Badge,
  SeanceTypeBadge,
  StatusBadge,
  Section,
  Spacer,
  IconButton,
  Icon,
} from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { fichesSuiviService } from '../../api/services';
import { FicheSuivi } from '../../types';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/spacing';

interface Props {
  navigation: any;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { showError } = useToast();

  const [fichesEnAttente, setFichesEnAttente] = useState<FicheSuivi[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    validees: 0,
    refusees: 0,
    enAttente: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fichesResponse, enAttenteResponse] = await Promise.all([
        fichesSuiviService.getAll(),
        fichesSuiviService.getEnAttente(),
      ]);

      const fiches = fichesResponse.data;
      setFichesEnAttente(enAttenteResponse.data.slice(0, 5));

      setStats({
        total: fiches.length,
        validees: fiches.filter((f) => f.statut === 'VALIDEE').length,
        refusees: fiches.filter((f) => f.statut === 'REFUSEE').length,
        enAttente: fiches.filter((f) => f.statut === 'SOUMISE').length,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showError('Impossible de charger les donnees', 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const getUserInitials = () => {
    const first = user?.first_name?.[0] || '';
    const last = user?.last_name?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  const getUserRole = () => {
    if (!user?.roles?.length) return 'Utilisateur';
    return user.roles[0].nom_role;
  };

  const getRoleColor = () => {
    const role = getUserRole();
    switch (role) {
      case 'Super Administrateur':
        return Colors.status.error;
      case 'Administrateur':
        return Colors.accent;
      case 'Enseignant':
        return Colors.primary;
      case 'Delegue':
        return Colors.secondary;
      default:
        return Colors.gray[500];
    }
  };

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
          <Text variant="body" style={styles.ficheChapter} numberOfLines={1}>
            {item.titre_chapitre}
          </Text>
          <View style={styles.ficheFooter}>
            <View style={styles.ficheDate}>
              <Icon name="calendar" size={14} color={Colors.text.tertiary} />
              <Text variant="caption" color="tertiary" style={styles.ficheMetaText}>
                {item.date_cours}
              </Text>
            </View>
            <View style={styles.ficheTime}>
              <Icon name="clock-outline" size={14} color={Colors.text.tertiary} />
              <Text variant="caption" color="tertiary" style={styles.ficheMetaText}>
                {item.heure_debut} - {item.heure_fin}
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  const QuickActionButton = ({
    icon,
    label,
    onPress,
    color = Colors.primary,
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity style={styles.quickAction} activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Icon name={icon} size={24} color={Colors.light} />
      </View>
      <Text variant="caption" style={styles.quickActionLabel}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer
      backgroundColor={Colors.primary}
      statusBarStyle="light-content"
      edges={[]}>
      {/* Header avec profil */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Avatar initials={getUserInitials()} size="lg" color={getRoleColor()} />
            <View style={styles.headerInfo}>
              <Text variant="h5" style={styles.userName}>
                {user?.first_name} {user?.last_name}
              </Text>
              <Chip
                label={getUserRole()}
                size="sm"
                color="default"
                style={styles.roleChip}
              />
            </View>
          </View>
          <View style={styles.headerRight}>
            <IconButton
              icon="bell-outline"
              size="md"
              color={Colors.light}
              onPress={() => {}}
            />
            <IconButton
              icon="logout"
              size="md"
              color={Colors.light}
              onPress={logout}
            />
          </View>
        </View>
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        <FlatList
          data={fichesEnAttente}
          renderItem={renderFicheItem}
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
          ListHeaderComponent={
            <>
              {/* Statistiques */}
              <Section title="Statistiques">
                <View style={styles.statsGrid}>
                  <StatCard
                    title="Total"
                    value={stats.total}
                    icon="file-document-multiple"
                    color="primary"
                    style={styles.statCard}
                  />
                  <StatCard
                    title="Validees"
                    value={stats.validees}
                    icon="check-circle"
                    color="success"
                    style={styles.statCard}
                  />
                  <StatCard
                    title="En attente"
                    value={stats.enAttente}
                    icon="clock-outline"
                    color="warning"
                    style={styles.statCard}
                  />
                  <StatCard
                    title="Refusees"
                    value={stats.refusees}
                    icon="close-circle"
                    color="danger"
                    style={styles.statCard}
                  />
                </View>
              </Section>

              {/* Actions rapides */}
              <Section title="Actions rapides">
                <View style={styles.quickActions}>
                  <QuickActionButton
                    icon="plus"
                    label="Nouvelle fiche"
                    onPress={() => navigation.navigate('CreateFiche')}
                    color={Colors.primary}
                  />
                  <QuickActionButton
                    icon="file-document-multiple"
                    label="Mes fiches"
                    onPress={() => navigation.navigate('Fiches')}
                    color={Colors.secondary}
                  />
                  <QuickActionButton
                    icon="school"
                    label="Academique"
                    onPress={() => navigation.navigate('Academic')}
                    color={Colors.accent}
                  />
                  <QuickActionButton
                    icon="account-group"
                    label="Utilisateurs"
                    onPress={() => navigation.navigate('Users')}
                    color={Colors.gray[600]}
                  />
                </View>
              </Section>

              {/* En-tete des fiches en attente */}
              <View style={styles.sectionHeaderWithAction}>
                <Text variant="h6">Fiches en attente</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Fiches')}>
                  <Text variant="body" color="primary">
                    Voir tout
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          }
          ListEmptyComponent={
            <Card style={styles.emptyCard}>
              <CardContent style={styles.emptyContent}>
                <Icon name="check-circle-outline" size={48} color={Colors.status.success} />
                <Text variant="body" color="secondary" style={styles.emptyText}>
                  Aucune fiche en attente
                </Text>
              </CardContent>
            </Card>
          }
          ListFooterComponent={<Spacer size="2xl" />}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  // Header
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  userName: {
    color: Colors.light,
    marginBottom: Spacing.xs,
  },
  roleChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  // Content
  content: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
  },
  listContent: {
    padding: Spacing.base,
    paddingTop: Spacing.xl,
  },
  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
  },
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    width: 72,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    ...Shadows.md,
  },
  quickActionLabel: {
    textAlign: 'center',
    color: Colors.text.secondary,
  },
  // Section with action
  sectionHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  // Fiche cards
  ficheCard: {
    marginBottom: Spacing.sm,
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
    marginBottom: Spacing.sm,
  },
  ficheFooter: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  ficheDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ficheTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ficheMetaText: {
    marginLeft: 2,
  },
  // Empty state
  emptyCard: {
    marginTop: Spacing.sm,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});

export default DashboardScreen;
