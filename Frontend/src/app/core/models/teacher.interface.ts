import { School } from '@core/models/school.interface';

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  schools: School[];
}

export interface ClassTeacherLink {
  id: number;
  teacher: { id: number };
  classe: { id: number };
  role: 'LEAD' | 'SUPPORT';
}
