import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentService } from '@core/services/student.service';

@Component({
  selector: 'app-add-student-form',
  imports: [FormsModule],
  templateUrl: './add-student-form.html',
  styleUrl: './add-student-form.scss',
})
export class AddStudentForm {
  private readonly _studentService = inject(StudentService);

  readonly classId = input.required<number>();
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  protected readonly firstName = signal('');
  protected readonly lastName = signal('');
  protected readonly birthDate = signal('');
  protected readonly sex = signal<'MALE' | 'FEMALE'>('MALE');
  protected readonly saving = signal(false);

  protected submit(): void {
    if (!this.firstName().trim() || !this.lastName().trim() || !this.birthDate() || this.saving()) {
      return;
    }
    this.saving.set(true);
    this._studentService
      .create({
        firstName: this.firstName().trim(),
        lastName: this.lastName().trim(),
        birthDate: this.birthDate(),
        sex: this.sex(),
        classId: this.classId(),
      })
      .subscribe({
        next: () => this.saved.emit(),
        error: () => this.saving.set(false),
      });
  }
}
