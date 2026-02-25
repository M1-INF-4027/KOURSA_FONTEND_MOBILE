import api from './config';
import { NotificationItem } from '../types';

export const notificationsService = {
  getAll: () => api.get<NotificationItem[]>('/notifications/'),

  getUnreadCount: () =>
    api.get<{ unread_count: number }>('/notifications/unread-count/'),

  markRead: (id: number) =>
    api.post<NotificationItem>(`/notifications/${id}/mark-read/`),

  markAllRead: () =>
    api.post<{ detail: string }>('/notifications/mark-all-read/'),
};
