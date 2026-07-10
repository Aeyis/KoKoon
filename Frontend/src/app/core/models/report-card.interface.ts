export type ReportCardStatus = 'DRAFT' | 'VALIDATED' | 'PUBLISHED' | 'SIGNED';

export interface ReportCard {
  id: number;
  status: ReportCardStatus;
  student: { id: number };
  period: { id: number };
}
