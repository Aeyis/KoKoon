import { Subject } from '@core/models/subject.interface';
import { Period } from '@core/models/period.interface';

export interface Evaluation {
  id: number;
  title: string;
  competency: string | null;
  score: number | null;
  maxScore: number | null;
  grade: string | null;
  date: string;
  student: { id: number };
  subject: Subject;
  period: Period;
}

export interface NewEvaluation {
  title: string;
  competency?: string;
  score?: number;
  maxScore?: number;
  grade?: string;
  date: string;
  studentId: number;
  subjectId: number;
  periodId: number;
}
