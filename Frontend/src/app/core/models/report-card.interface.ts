export type ReportCardStatus = 'DRAFT' | 'VALIDATED' | 'PUBLISHED' | 'SIGNED';

export interface ReportCard {
  id: number;
  status: ReportCardStatus ;
  /** Appréciation sur les résultats */
  comment?: string | null;
  /** Appréciation sur le comportement */
  conductComment?: string | null;
  student: { id: number };
  period: { id: number };
}
