import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentService } from '@core/services/student.service';
import { Student } from '@core/models/student.interface';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';

@Component({
  selector: 'app-student-picker',
  imports: [FormsModule, StudentAvatar],
  templateUrl: './student-picker.html',
  styleUrl: './student-picker.scss',
})
export class StudentPicker implements OnInit {
  private readonly _studentService = inject(StudentService);

  readonly classId = input.required<number>();
  readonly schoolId = input<number | null>(null);
  readonly canCreate = input(false);
  readonly changed = output<void>();
  readonly cancelled = output<void>();

  protected readonly available = signal<Student[]>([]);
  protected readonly busy = signal(false);

  // create mode (directrice / admin)
  protected readonly showCreate = signal(false);
  protected readonly firstName = signal('');
  protected readonly lastName = signal('');
  protected readonly birthDate = signal('');
  protected readonly sex = signal<'MALE' | 'FEMALE'>('MALE');

  ngOnInit(): void {
    this._loadAvailable();
  }

  private _loadAvailable(): void {
    this._studentService.getAvailable().subscribe((list) => this.available.set(list));
  }

  protected assign(student: Student): void {
    if (this.busy()) return;
    this.busy.set(true);
    this._studentService.assignClass(student.id, this.classId()).subscribe({
      next: () => {
        this.available.update((list) => list.filter((s) => s.id !== student.id));
        this.busy.set(false);
        this.changed.emit();
      },
      error: () => this.busy.set(false),
    });
  }

  protected createAndAssign(): void {
    if (!this.firstName().trim() || !this.lastName().trim() || !this.birthDate() || this.busy()) {
      return;
    }
    this.busy.set(true);
    this._studentService
      .create({
        firstName: this.firstName().trim(),
        lastName: this.lastName().trim(),
        birthDate: this.birthDate(),
        sex: this.sex(),
        schoolId: this.schoolId() ?? undefined,
        classId: this.classId(),
      })
      .subscribe({
        next: () => {
          this.firstName.set('');
          this.lastName.set('');
          this.birthDate.set('');
          this.showCreate.set(false);
          this.busy.set(false);
          this.changed.emit();
        },
        error: () => this.busy.set(false),
      });
  }
}
