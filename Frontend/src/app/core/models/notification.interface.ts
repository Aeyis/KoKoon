import { NotificationType } from '@core/enums/notification-type.enum';

export interface AppNotification {
  id: number;
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: string;
}
