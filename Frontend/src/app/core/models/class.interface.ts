import { Student } from '@core/models/student.interface';

export interface ClassRoom {
  id: number;
  name: string;
  schoolYear: string;
  students: Student[];
}
