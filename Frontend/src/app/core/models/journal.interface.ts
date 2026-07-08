import { JournalCategory } from '@core/enums/journal.enum';

export interface JournalSubject {
  id: number;
  name: string;
}

export interface ClassJournal {
  id: number;
  date: string;
  period: number | null;
  title: string | null;
  color: string | null;
  content: string;
  done: boolean;
  category: JournalCategory | null;
  homework: string | null;
  preparation: string | null;
  subject: JournalSubject | null;
}

export interface NewJournalEntry {
  date: string;
  classId: number;
  content: string;
  title?: string;
  period?: number;
  homework?: string;
  color?: string;
  subjectId?: number;
}
