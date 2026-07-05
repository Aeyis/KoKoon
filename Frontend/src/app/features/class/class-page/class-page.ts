import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ClassService } from '@core/services/class.service';
import { AttendanceService } from '@core/services/attendance.service';
import { Student } from '@core/models/student.interface';
import { AttendanceStatus } from '@core/enums/attendance.enum';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';
import { SeatingPlan } from '../seating-plan/seating-plan';

@Component({
  selector: 'app-class-page',
  imports: [RouterLink, MatIcon, StudentAvatar, SeatingPlan],
  templateUrl: './class-page.html',
  styleUrl: './class-page.scss',
})
export class ClassPage implements OnInit {
  private readonly _classService = inject(ClassService);
  private readonly _attendanceService = inject(AttendanceService);

  private readonly _today = new Date().toISOString().slice(0, 10);

  protected readonly AttendanceStatus = AttendanceStatus;

  protected readonly view = signal<'list' | 'seating'>('list');
  protected readonly classId = signal<number | null>(null);
  protected readonly students = signal<Student[]>([]);
  protected readonly statusById = signal<Record<number, AttendanceStatus>>({});

  protected readonly presentCount = computed(
    () => Object.values(this.statusById()).filter((s) => s === AttendanceStatus.PRESENT).length,
  );

  ngOnInit(): void {
    this._classService.getAll().subscribe((classes) => {
      const my = classes[0];
      if (!my) return;
      this.classId.set(my.id);
      this.students.set(my.students ?? []);
    });
    this._attendanceService.getAll().subscribe((rows) => {
      const map: Record<number, AttendanceStatus> = {};
      for (const a of rows) {
        if (a.date.slice(0, 10) === this._today) map[a.student.id] = a.status;
      }
      this.statusById.set(map);
    });
  }

  protected statusOf(studentId: number): AttendanceStatus | null {
    return this.statusById()[studentId] ?? null;
  }

  protected statusLabel(status: AttendanceStatus): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }
}
