export type AbsenceScope = 'MORNING' | 'AFTERNOON' | 'FULL_DAY';

export interface ReportAbsence {
  date: string;
  scope: AbsenceScope;
  reason?: string;
}
