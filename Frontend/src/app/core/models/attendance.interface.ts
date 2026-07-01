import { AttendanceSession, AttendanceStatus } from '@core/enums/attendance.enum';

export interface CreateAttendance {
  studentId: number;
  date: string;
  session: AttendanceSession;
  status: AttendanceStatus;
  justification?: string;
}