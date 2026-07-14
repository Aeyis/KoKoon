import { UserRole } from '@core/enums/user-role.enum';

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface Conversation {
  user: Contact;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

export interface ThreadMessage {
  id: number;
  content: string;
  createdAt: string;
  mine: boolean;
}
