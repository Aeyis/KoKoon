import { JournalCategory } from '@core/enums/journal.enum';

export interface ClassJournal {
  id: number;
  date: string;
  content: string;
  done: boolean;
  category: JournalCategory | null;
  homework: string | null;
  preparation: string | null;
}
