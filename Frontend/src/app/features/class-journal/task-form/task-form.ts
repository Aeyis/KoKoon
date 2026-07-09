import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JournalService } from '@core/services/journal.service';
import { SubjectService } from '@core/services/subject.service';
import { Subject } from '@core/models/subject.interface';
import { ClassJournal } from '@core/models/journal.interface';
import { PERIODS } from '@core/constants/periods';
import { TASK_COLORS } from '@core/constants/task-colors';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _journalService = inject(JournalService);
  private readonly _subjectService = inject(SubjectService);

  readonly classId = input.required<number>();
  readonly date = input.required<string>();
  readonly period = input.required<number>();
  readonly entries = input<ClassJournal[]>([]);

  readonly created = output<void>();
  readonly cancelled = output<void>();

  protected readonly PERIODS = PERIODS;
  protected readonly TASK_COLORS = TASK_COLORS;

  protected readonly subjects = signal<Subject[]>([]);
  protected readonly subjectId = signal<number | null>(null);
  protected readonly color = signal<string>(TASK_COLORS[0]);
  protected readonly currentPeriod = signal<number>(1);
  protected readonly saving = signal(false);

  protected readonly currentPeriodInfo = computed(() =>
    PERIODS.find((p) => p.n === this.currentPeriod()),
  );

  protected readonly currentEntry = computed(
    () =>
      this.entries().find(
        (e) => e.date.slice(0, 10) === this.date() && e.period === this.currentPeriod(),
      ) ?? null,
  );

  protected readonly isEdit = computed(() => this.currentEntry() !== null);

  protected readonly form = this._fb.nonNullable.group({
    title: ['', Validators.required],
    content: [''],
    homework: [''],
  });

  ngOnInit(): void {
    this._subjectService.getAll().subscribe((list) => this.subjects.set(list));
    this.currentPeriod.set(this.period());
    this._sync();
  }

  protected prevPeriod(): void {
    this.currentPeriod.update((n) => Math.max(PERIODS[0].n, n - 1));
    this._sync();
  }

  protected nextPeriod(): void {
    this.currentPeriod.update((n) => Math.min(PERIODS[PERIODS.length - 1].n, n + 1));
    this._sync();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const v = this.form.getRawValue();
    const payload = {
      title: v.title,
      content: v.content || v.title,
      homework: v.homework || undefined,
      color: this.color(),
      subjectId: this.subjectId() ?? undefined,
    };

    const e = this.currentEntry();
    if (e) {
      this._journalService.update(e.id, payload).subscribe(() => {
        this.saving.set(false);
        this.created.emit();
      });
    } else {
      this._journalService
        .create({ ...payload, date: this.date(), classId: this.classId(), period: this.currentPeriod() })
        .subscribe(() => {
          this.saving.set(false);
          this.created.emit();
          this.nextPeriod();
        });
    }
  }

  private _sync(): void {
    const e = this.currentEntry();
    if (e) {
      this.form.reset({
        title: e.title ?? e.content ?? '',
        content: e.content ?? '',
        homework: e.homework ?? '',
      });
      this.subjectId.set(e.subject?.id ?? null);
      this.color.set(e.color ?? TASK_COLORS[0]);
    } else {
      this.form.reset({ title: '', content: '', homework: '' });
    }
  }
}
