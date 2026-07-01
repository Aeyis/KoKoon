import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';
import { StudentService } from '@core/services/student.service';
import { AttendanceService } from '@core/services/attendance.service';
import { Student } from '@core/models/student.interface';
import { AttendanceSession, AttendanceStatus } from '@core/enums/attendance.enum';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatIcon],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly _studentService = inject(StudentService);
  private readonly _attendanceService = inject(AttendanceService);

  protected readonly students = signal<Student[]>([]);
  protected readonly attendance = signal<Record<number, AttendanceStatus>>({});

  protected readonly presentCount = computed(
    () => Object.values(this.attendance()).filter((s) => s === AttendanceStatus.PRESENT).length,
  );
  protected readonly absentCount = computed(
    () => Object.values(this.attendance()).filter((s) => s === AttendanceStatus.ABSENT).length,
  );

  ngOnInit(): void {
    this.auth.loadCurrentUser().subscribe();
    this._studentService.getAll().subscribe((list) => {
      this.students.set(list);
      const initial: Record<number, AttendanceStatus> = {};
      for (const s of list) initial[s.id] = AttendanceStatus.PRESENT;
      this.attendance.set(initial);
    });
  }

  protected isAbsent(studentId: number): boolean {
    return this.attendance()[studentId] === AttendanceStatus.ABSENT;
  }

  protected toggle(studentId: number): void {
    this.attendance.update((current) => ({
      ...current,
      [studentId]:
        current[studentId] === AttendanceStatus.PRESENT
          ? AttendanceStatus.ABSENT
          : AttendanceStatus.PRESENT,
    }));
  }

  protected validate(): void {
    const date = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const records = this.students().map((s) => ({
      studentId: s.id,
      date,
      session: AttendanceSession.MORNING,
      status: this.attendance()[s.id],
    }));

    this._attendanceService.createMany(records).subscribe({
      next: () => console.log('Attendance saved ✅'),
      error: (err) => console.error('Save failed', err),
    });
  }
}