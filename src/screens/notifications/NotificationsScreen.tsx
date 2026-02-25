import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenContainer,
  Text,
  Icon,
  IconButton,
} from '../../components/ui';
import { useNotifications } from '../../contexts/NotificationContext';
import { notificationsService } from '../../api/notifications';
import { NotificationItem, NotificationType } from '../../types';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';

interface Props {
  navigation: any;
}

const getNotificationIcon = (type: NotificationType): { name: string; color: string } => {
  switch (type) {
    case 'FICHE_SOUMISE':
      return { name: 'file-document-edit-outline', color: Colors.accent };
    case 'FICHE_VALIDEE':
      return { name: 'check-circle-outline', color: Colors.success };
    case 'FICHE_REFUSEE':
      return { name: 'close-circle-outline', color: Colors.error };
    case 'FICHE_RESOUMISE':
      return { name: 'file-restore-outline', color: Colors.secondary };
    case 'COMPTE_APPROUVE':
      return { name: 'account-check-outline', color: Colors.success };
    default:
      return { name: 'bell-outline', color: Colors.gray[500] };
  }
};

const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return "A l'instant";
  if (diffMin < 60) return `Il y a ${diffMin}min`;
  if (diffH < 24) return `Il y a ${diffH}h`;
  if (diffD < 7) return `Il y a ${diffD}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { refreshUnreadCount } = useNotifications();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await notificationsService.getAll();
      setNotifications(response.data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      refreshUnreadCount();
    } catch {
      // Silently fail
    }
  };

  const handleNotificationPress = async (item: NotificationItem) => {
    if (!item.is_read) {
      try {
        await notificationsService.markRead(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
        );
        refreshUnreadCount();
      } catch {
        // Silently fail
      }
    }

    if (item.related_object_id && item.notification_type !== 'COMPTE_APPROUVE') {
      navigation.navigate('FicheDetail', { ficheId: item.related_object_id });
    }
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    const iconInfo = getNotificationIcon(item.notification_type);

    return (
      <TouchableOpacity
        style={[styles.notificationItem, !item.is_read && styles.notificationUnread]}
        activeOpacity={0.7}
        onPress={() => handleNotificationPress(item)}>
        <View style={[styles.iconContainer, { backgroundColor: iconInfo.color + '15' }]}>
          <Icon name={iconInfo.name} size={24} color={iconInfo.color} />
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text
              variant="label"
              style={[styles.notificationTitle, !item.is_read && styles.notificationTitleBold]}
              numberOfLines={1}>
              {item.title}
            </Text>
            {!item.is_read && <View style={styles.unreadDot} />}
          </View>
          <Text variant="body" color="secondary" numberOfLines={2} style={styles.notificationBody}>
            {item.body}
          </Text>
          <Text variant="caption" color="tertiary" style={styles.notificationTime}>
            {getRelativeTime(item.created_at)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <ScreenContainer
      backgroundColor={Colors.primary}
      statusBarStyle="light-content"
      edges={[]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
            />
            <Text variant="h5" style={styles.headerTitle}>
              Notifications
            </Text>
          </View>
          {hasUnread && (
            <TouchableOpacity onPress={handleMarkAllRead}>
              <Text variant="body" style={styles.markAllRead}>
                Tout marquer lu
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadNotifications}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Icon name="bell-off-outline" size={64} color={Colors.gray[300]} />
                <Text variant="body" color="tertiary" style={styles.emptyText}>
                  Aucune notification
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    color: Colors.light,
  },
  markAllRead: {
    color: Colors.light,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
  },
  listContent: {
    paddingTop: Spacing.md,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  notificationUnread: {
    backgroundColor: Colors.primarySurface,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  notificationTitle: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  notificationTitleBold: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  notificationBody: {
    marginBottom: 4,
  },
  notificationTime: {},
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: Spacing.md,
  },
});

export default NotificationsScreen;
