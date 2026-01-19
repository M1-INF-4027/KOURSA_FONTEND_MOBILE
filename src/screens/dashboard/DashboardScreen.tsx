/**
 * Koursa - Dashboard Screen
 * Ecran d'accueil avec statistiques et actions rapides
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Text, Icon } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { fichesSuiviService, dashboardService } from '../../api/services';
import { FicheSuivi, DashboardStats } from '../../types';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [fichesEnAttente, setFichesEnAttente] = useState<FicheSuivi[]>([]);
  const [loading, setLoading] = useState(true);

  const isChefDepartement = user?.roles.some(r => r.nom_role === 'Chef de Departement');
  const isDelegue = user?.roles.some(r => r.nom_role === 'Delegue');
  const isEnseignant = user?.roles.some(r => r.nom_role === 'Enseignant');

  const loadData = useCallback(async () => {
    try {
      // Charger les fiches en attente
      const fichesResponse = await fichesSuiviService.getEnAttente();
      setFichesEnAttente(fichesResponse.data);

      // Charger les stats dashboard (seulement pour chef de departement)
      if (isChefDepartement) {
        try {
          const statsResponse = await dashboardService.getStats();
          setStats(statsResponse.data);
        } catch (err) {
          console.log('Stats not available');
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [isChefDepartement]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'Super Administrateur': return Colors.roles.superAdmin;
      case 'Chef de Departement': return Colors.roles.chefDepartement;
      case 'Enseignant': return Colors.roles.enseignant;
      case 'Delegue': return Colors.roles.delegue;
      default: return Colors.gray[500];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SOUMISE': return Colors.status.soumise;
      case 'VALIDEE': return Colors.status.validee;
      case 'REFUSEE': return Colors.status.refusee;
      default: return Colors.gray[500];
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="h4" color="primary">
            Bonjour, {user?.first_name}
          </Text>
          <View style={styles.rolesContainer}>
            {user?.roles.map((role) => (
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
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Icon name="logout" size={24} color={Colors.error} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards (Chef de Departement) */}
      {isChefDepartement && stats && (
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: Colors.successLight }]}>
            <Icon name="clock-check-outline" size={32} color={Colors.success} />
            <Text variant="h3" color="primary" style={styles.statValue}>
              {stats.heures_validees_ce_mois}h
            </Text>
            <Text variant="caption" color="secondary">
              Heures validees ce mois
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.warningLight }]}>
            <Icon name="alert-circle-outline" size={32} color={Colors.warning} />
            <Text variant="h3" color="primary" style={styles.statValue}>
              {stats.fiches_en_retard_de_validation}
            </Text>
            <Text variant="caption" color="secondary">
              Fiches en retard
            </Text>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="h5" color="primary" style={styles.sectionTitle}>
          Actions rapides
        </Text>
        <View style={styles.actionsGrid}>
          {isDelegue && (
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('CreateFiche')}
            >
              <View style={[styles.actionIcon, { backgroundColor: Colors.primarySurface }]}>
                <Icon name="plus" size={28} color={Colors.primary} />
              </View>
              <Text variant="label" color="primary">
                Nouvelle fiche
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Fiches')}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.secondarySurface }]}>
              <Icon name="file-document-outline" size={28} color={Colors.secondary} />
            </View>
            <Text variant="label" color="primary">
              Mes fiches
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Academic')}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.accentSurface }]}>
              <Icon name="school-outline" size={28} color={Colors.accent} />
            </View>
            <Text variant="label" color="primary">
              Academique
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fiches en attente */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="h5" color="primary">
            Fiches en attente
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Fiches')}>
            <Text variant="bodySmall" color="link">
              Voir tout
            </Text>
          </TouchableOpacity>
        </View>

        {fichesEnAttente.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="check-circle-outline" size={48} color={Colors.gray[300]} />
            <Text variant="body" color="tertiary" style={styles.emptyText}>
              Aucune fiche en attente
            </Text>
          </View>
        ) : (
          fichesEnAttente.slice(0, 5).map((fiche) => (
            <TouchableOpacity key={fiche.id} style={styles.ficheCard}>
              <View style={styles.ficheHeader}>
                <View style={[styles.typeBadge, { backgroundColor: Colors.seance[fiche.type_seance] }]}>
                  <Text variant="caption" color="inverse">
                    {fiche.type_seance}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(fiche.statut) }]}>
                  <Text variant="caption" color="inverse">
                    {fiche.statut}
                  </Text>
                </View>
              </View>
              <Text variant="h6" color="primary" numberOfLines={1}>
                {fiche.nom_ue}
              </Text>
              <Text variant="bodySmall" color="secondary" numberOfLines={1}>
                {fiche.titre_chapitre}
              </Text>
              <View style={styles.ficheFooter}>
                <Icon name="calendar" size={14} color={Colors.gray[500]} />
                <Text variant="caption" color="tertiary" style={styles.ficheDate}>
                  {fiche.date_cours}
                </Text>
                <Icon name="account" size={14} color={Colors.gray[500]} style={styles.ficheIcon} />
                <Text variant="caption" color="tertiary">
                  {fiche.nom_enseignant || 'Non assigne'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    marginVertical: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: Colors.light,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '30%',
    minWidth: 100,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.light,
    borderRadius: 16,
  },
  emptyText: {
    marginTop: 12,
  },
  ficheCard: {
    backgroundColor: Colors.light,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  ficheHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ficheFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ficheDate: {
    marginLeft: 4,
  },
  ficheIcon: {
    marginLeft: 12,
  },
});

export default DashboardScreen;
