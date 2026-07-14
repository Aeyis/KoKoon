import { Student } from '@core/models/student.interface';
import { School } from '@core/models/school.interface';

export interface ClassRoom {
  id: number;
  name: string;
  schoolYear: string;
  students: Student[];
  school?: School | null;
}

export interface NewClass {
  name: string;
  schoolYear: string;
  schoolId?: number;
}
