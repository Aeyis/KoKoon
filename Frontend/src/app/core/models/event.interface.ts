import { EventCategory } from '@core/enums/event.enum';

export interface AgendaEvent {
  id: number;
  title: string;
  date: string;
  allDay: boolean;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  description: string | null;
  category : EventCategory | null;
}
