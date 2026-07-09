import { Subject } from '@core/models/subject.interface';
import { Period } from '@core/models/period.interface';

export interface Evaluation {
  id: number;
  title: string;
  score: number;
  maxScore: number;
  date: string;
  student: { id: number };
  subject: Subject;
  period: Period;
}
