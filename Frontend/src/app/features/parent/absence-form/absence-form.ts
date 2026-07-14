import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MeService } from '@core/services/me.service';
import { Student } from '@core/models/student.interface';
import { AbsenceScope } from '@core/models/absence.interface';

@Component({
  selector: 'app-absence-form',
  imports: [FormsModule],
  templateUrl: './absence-form.html',
  styleUrl: './absence-form.scss',
})
export class AbsenceForm implements OnInit {
  private readonly _meService = inject(MeService);

  readonly children = input.required<Student[]>();
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  protected readonly childId = signal<number | null>(null);
  protected readonly date = signal(new Date().toISOString().slice(0, 10));
  protected readonly scope = signal<AbsenceScope>('FULL_DAY');
  protected readonly reason = signal('');
  protected readonly saving = signal(false);

  protected readonly scopes: { value: AbsenceScope; label: string }[] = [
    { value: 'MORNING', label: 'Morning' },
    { value: 'AFTERNOON', label: 'Afternoon' },
    { value: 'FULL_DAY', label: 'Full day' },
  ];

  ngOnInit(): void {
    this.childId.set(this.children()[0]?.id ?? null);
  }

  protected submit(): void {
    const id = this.childId();
    if (id == null || !this.date() || this.saving()) return;
    this.saving.set(true);
    this._meService
      .reportAbsence(id, {
        date: this.date(),
        scope: this.scope(),
        reason: this.reason() || undefined,
      })
      .subscribe({
        next: () => this.saved.emit(),
        error: () => this.saving.set(false),
      });
  }
}
