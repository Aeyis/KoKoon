import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Student } from '@core/models/student.interface';
import { AttendanceService } from '@core/services/attendance.service';
import { AttendanceSession, AttendanceStatus } from '@core/enums/attendance.enum';

@Component({
  selector: 'app-attendance-card',
  imports: [MatIcon],
  templateUrl: './attendance-card.html',
  styleUrl: './attendance-card.scss',
})
export class AttendanceCard {
  private readonly _attendanceService = inject(AttendanceService);

  readonly title = input.required<string>();
  readonly session = input.required<AttendanceSession>();
  readonly students = input.required<Student[]>();
  readonly locked = input(false);
  readonly lockedReason = input('');

  private readonly _today = new Date().toISOString().slice(0, 10);

  readonly attendance = linkedSignal<Student[], Record<number, AttendanceStatus>>({
    source: this.students,
    computation: (list) => {
      const init: Record<number, AttendanceStatus> = {};
      for (const s of list) init[s.id] = AttendanceStatus.PRESENT;
      return init;
    },
  });

  readonly validated = signal(false);

  readonly presentCount = computed(
    () => Object.values(this.attendance()).filter((s) => s === AttendanceStatus.PRESENT).length,
  );
  readonly absentCount = computed(
    () => Object.values(this.attendance()).filter((s) => s === AttendanceStatus.ABSENT).length,
  );
  readonly presentRatio = computed(() => {
    const total = this.students().length;
    return total === 0 ? 0 : Math.round((this.presentCount() / total) * 100);
  });
  readonly allPresent = computed(
    () =>
      this.students().length > 0 &&
      this.students().every((s) => this.attendance()[s.id] === AttendanceStatus.PRESENT),
  );

  isAbsent(studentId: number): boolean {
    return this.attendance()[studentId] === AttendanceStatus.ABSENT;
  }

  toggle(studentId: number): void {
    this.attendance.update((current) => ({
      ...current,
      [studentId]:
        current[studentId] === AttendanceStatus.PRESENT
          ? AttendanceStatus.ABSENT
          : AttendanceStatus.PRESENT,
    }));
  }

  toggleAll(): void {
    const next = this.allPresent() ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT;
    const updated: Record<number, AttendanceStatus> = {};
    for (const s of this.students()) updated[s.id] = next;
    this.attendance.set(updated);
  }

  validate(): void {
    const records = this.students().map((s) => ({
      studentId: s.id,
      date: this._today,
      session: this.session(),
      status: this.attendance()[s.id],
    }));
    this._attendanceService.createMany(records).subscribe({
      next: () => this.validated.set(true),
      error: (err) => console.error('Save failed', err),
    });
  }

  edit(): void {
    this.validated.set(false);
  }
}