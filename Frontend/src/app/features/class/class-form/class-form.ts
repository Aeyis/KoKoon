import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClassService } from '@core/services/class.service';

@Component({
  selector: 'app-class-form',
  imports: [FormsModule],
  templateUrl: './class-form.html',
  styleUrl: './class-form.scss',
})
export class ClassForm {
  private readonly _classService = inject(ClassService);

  readonly schoolId = input<number | null>(null);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  protected readonly name = signal('');
  protected readonly schoolYear = signal(this._defaultYear());
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  private _defaultYear(): string {
    const now = new Date();
    const start = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
    return `${start}-${start + 1}`;
  }

  protected submit(): void {
    if (!this.name().trim() || !this.schoolYear().trim() || this.saving()) return;
    this.saving.set(true);
    this.error.set(null);
    this._classService
      .create({
        name: this.name().trim(),
        schoolYear: this.schoolYear().trim(),
        schoolId: this.schoolId() ?? undefined,
      })
      .subscribe({
      next: () => this.saved.emit(),
      error: (err) => {
        this.saving.set(false);
        this.error.set(
          err?.status === 403
            ? 'Only an administrator can create a class.'
            : 'Could not create the class.',
        );
      },
    });
  }
}
