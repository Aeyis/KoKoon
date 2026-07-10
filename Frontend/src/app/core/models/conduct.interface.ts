import { ConductLevel } from '@core/enums/conduct.enum';

export interface ConductItem {
  id: number;
  label: string;
  position: number;
}

export interface ConductAssessment {
  id: number;
  level: ConductLevel;
  student: { id: number };
  item: { id: number };
  period: { id: number };
}
