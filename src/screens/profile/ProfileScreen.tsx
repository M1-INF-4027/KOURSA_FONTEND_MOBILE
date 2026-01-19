/**
 * Koursa - Profile Screen
 * Ecran de profil utilisateur
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Text, Icon } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import { usersService } from '../../api/services';

const ProfileScreen: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  });

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'Super Administrateur':
        return Colors.roles.superAdmin;
      case 'Chef de Departement':
        return Colors.roles.chefDepartement;
      case 'Enseignant':
        return Colors.roles.enseignant;
      case 'Delegue':
        return Colors.roles.delegue;
      default:
        return Colors.gray[500];
    }
  };

  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
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

  const handleSave = async () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await usersService.update(user!.id, {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      });

      if (updateUser) {
        updateUser(response.data);
      }

      setIsEditing(false);
      Alert.alert('Succes', 'Profil mis a jour avec succes');
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Erreur lors de la mise a jour';
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Deconnexion',
      'Voulez-vous vraiment vous deconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Deconnecter',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h4" color="primary">
          Mon Profil
        </Text>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.first_name?.[0] || '?'}
            {user.last_name?.[0] || '?'}
          </Text>
        </View>
        <Text variant="h5" color="primary" style={styles.userName}>
          {user.first_name} {user.last_name}
        </Text>
        <Text variant="body" color="secondary">
          {user.email}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(user.statut) },
          ]}
        >
          <Text variant="caption" color="inverse">
            {getStatusLabel(user.statut)}
          </Text>
        </View>
      </View>

      {/* Roles Section */}
      <View style={styles.section}>
        <Text variant="h6" color="primary" style={styles.sectionTitle}>
          Roles
        </Text>
        <View style={styles.rolesContainer}>
          {user.roles.map((role) => (
            <View
              key={role.id}
              style={[styles.roleBadge, { backgroundColor: getRoleColor(role.nom_role) }]}
            >
              <Icon name="account-badge" size={16} color={Colors.light} />
              <Text variant="label" color="inverse" style={styles.roleText}>
                {role.nom_role}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Edit Profile Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="h6" color="primary">
            Informations personnelles
          </Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Icon name="pencil" size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <TextInput
              label="Prenom"
              value={formData.first_name}
              onChangeText={(text) =>
                setFormData({ ...formData, first_name: text })
              }
              mode="outlined"
              style={styles.input}
              outlineColor={Colors.border.light}
              activeOutlineColor={Colors.primary}
            />
            <TextInput
              label="Nom"
              value={formData.last_name}
              onChangeText={(text) =>
                setFormData({ ...formData, last_name: text })
              }
              mode="outlined"
              style={styles.input}
              outlineColor={Colors.border.light}
              activeOutlineColor={Colors.primary}
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.editButton, styles.cancelButton]}
                onPress={handleCancel}
                disabled={loading}
              >
                <Text variant="button" color="secondary">
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.light} size="small" />
                ) : (
                  <Text variant="button" color="inverse">
                    Enregistrer
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Icon name="account" size={20} color={Colors.gray[500]} />
              <View style={styles.infoContent}>
                <Text variant="bodySmall" color="tertiary">
                  Prenom
                </Text>
                <Text variant="body" color="primary">
                  {user.first_name}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Icon name="account" size={20} color={Colors.gray[500]} />
              <View style={styles.infoContent}>
                <Text variant="bodySmall" color="tertiary">
                  Nom
                </Text>
                <Text variant="body" color="primary">
                  {user.last_name}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Icon name="email" size={20} color={Colors.gray[500]} />
              <View style={styles.infoContent}>
                <Text variant="bodySmall" color="tertiary">
                  Email
                </Text>
                <Text variant="body" color="primary">
                  {user.email}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <Text variant="h6" color="primary" style={styles.sectionTitle}>
          Actions
        </Text>

        <TouchableOpacity style={styles.actionItem}>
          <View style={[styles.actionIcon, { backgroundColor: Colors.primarySurface }]}>
            <Icon name="lock-reset" size={20} color={Colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text variant="body" color="primary">
              Changer le mot de passe
            </Text>
            <Text variant="bodySmall" color="tertiary">
              Modifier votre mot de passe actuel
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={Colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <View style={[styles.actionIcon, { backgroundColor: Colors.accentSurface }]}>
            <Icon name="bell-outline" size={20} color={Colors.accent} />
          </View>
          <View style={styles.actionContent}>
            <Text variant="body" color="primary">
              Notifications
            </Text>
            <Text variant="bodySmall" color="tertiary">
              Gerer vos preferences de notification
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={Colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
          <View style={[styles.actionIcon, { backgroundColor: Colors.errorLight }]}>
            <Icon name="logout" size={20} color={Colors.error} />
          </View>
          <View style={styles.actionContent}>
            <Text variant="body" color="error">
              Se deconnecter
            </Text>
            <Text variant="bodySmall" color="tertiary">
              Deconnectez-vous de votre compte
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={Colors.gray[400]} />
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text variant="bodySmall" color="tertiary">
          Koursa v1.0.0
        </Text>
        <Text variant="caption" color="tertiary">
          Systeme de gestion academique
        </Text>
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
    paddingBottom: 100,
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
  avatarSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.light,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.light,
  },
  userName: {
    marginBottom: 4,
  },
  statusBadge: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  section: {
    backgroundColor: Colors.light,
    marginTop: 16,
    padding: 16,
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
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  roleText: {
    marginLeft: 8,
  },
  editForm: {
    gap: 8,
  },
  input: {
    backgroundColor: Colors.light,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.gray[100],
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  infoList: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    padding: 24,
  },
});

export default ProfileScreen;
