import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';
import { ContextService } from '@core/services/context.service';
import { AttendanceService } from '@core/services/attendance.service';
import { AttendanceStatus } from '@core/enums/attendance.enum';
import { UserRole } from '@core/enums/user-role.enum';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';
import { Dropdown, DropdownOption } from '@shared/components/dropdown/dropdown';
import { SeatingPlan } from '../seating-plan/seating-plan';
import { StudentPicker } from '../student-picker/student-picker';
import { ClassForm } from '../class-form/class-form';

@Component({
  selector: 'app-class-page',
  imports: [RouterLink, MatIcon, StudentAvatar, Dropdown, SeatingPlan, StudentPicker, ClassForm],
  templateUrl: './class-page.html',
  styleUrl: './class-page.scss',
})
export class ClassPage implements OnInit {
  private readonly _auth = inject(AuthService);
  protected readonly context = inject(ContextService);
  private readonly _attendanceService = inject(AttendanceService);

  private readonly _today = new Date().toISOString().slice(0, 10);

  protected readonly AttendanceStatus = AttendanceStatus;

  protected readonly view = signal<'list' | 'seating'>('list');
  protected readonly students = computed(() => this.context.selectedClass()?.students ?? []);
  protected readonly statusById = signal<Record<number, AttendanceStatus>>({});
  protected readonly showPicker = signal(false);
  protected readonly showClassForm = signal(false);

  protected readonly classOptions = computed<DropdownOption[]>(() =>
    this.context.classesOfSchool().map((c) => ({ value: c.id, label: c.name })),
  );

  protected readonly canCreateStudents = computed(() => {
    const r = this._auth.role();
    return r === UserRole.ADMIN || r === UserRole.PRINCIPAL;
  });

  protected readonly presentCount = computed(
    () => Object.values(this.statusById()).filter((s) => s === AttendanceStatus.PRESENT).length,
  );

  ngOnInit(): void {
    this.context.load();
    this._attendanceService.getAll().subscribe((rows) => {
      const map: Record<number, AttendanceStatus> = {};
      for (const a of rows) {
        if (a.date.slice(0, 10) === this._today) map[a.student.id] = a.status;
      }
      this.statusById.set(map);
    });
  }

  protected onClassChange(id: string | number): void {
    this.context.setClass(Number(id));
  }

  protected onPickerChanged(): void {
    this.context.load();
  }

  protected onClassSaved(): void {
    this.showClassForm.set(false);
    this.context.load();
  }

  protected statusOf(studentId: number): AttendanceStatus | null {
    return this.statusById()[studentId] ?? null;
  }

  protected statusLabel(status: AttendanceStatus): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }
}
