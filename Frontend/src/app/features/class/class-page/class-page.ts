import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { StudentService } from '@core/services/student.service';
import { AttendanceService } from '@core/services/attendance.service';
import { Student } from '@core/models/student.interface';
import { AttendanceStatus } from '@core/enums/attendance.enum';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';

@Component({
  selector: 'app-class-page',
  imports: [RouterLink, MatIcon, StudentAvatar],
  templateUrl: './class-page.html',
  styleUrl: './class-page.scss',
})
export class ClassPage implements OnInit {
  private readonly _studentService = inject(StudentService);
  private readonly _attendanceService = inject(AttendanceService);

  private readonly _today = new Date().toISOString().slice(0, 10);

  protected readonly AttendanceStatus = AttendanceStatus;

  protected readonly students = signal<Student[]>([]);
  protected readonly statusById = signal<Record<number, AttendanceStatus>>({});

  protected readonly presentCount = computed(
    () => Object.values(this.statusById()).filter((s) => s === AttendanceStatus.PRESENT).length,
  );

  ngOnInit(): void {
    this._studentService.getAll().subscribe((list) => this.students.set(list));
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
