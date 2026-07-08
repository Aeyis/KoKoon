import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {JournalService} from '@core/services/journal.service';
import {SubjectService} from '@core/services/subject.service';
import {Subject} from '@core/models/subject.interface';
import { PERIODS } from '@core/constants/periods';
import {TASK_COLORS} from '@core/constants/task-colors';

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
  readonly date = input<string>(new Date().toISOString().slice(0, 10));

  readonly saved = output<void>();
  readonly cancelled = output<void>();

  protected readonly PERIODS = PERIODS;
  protected readonly TASK_COLORS = TASK_COLORS;

  protected readonly subjects = signal<Subject[]>([]);
  protected readonly subjectId = signal<number | null>(null);
  protected readonly period = signal<number | null>(null);
  protected readonly color = signal<string>(TASK_COLORS[0]);
  protected readonly saving = signal(false);

  protected readonly form = this._fb.nonNullable.group({
    title: ['', Validators.required],
    content: [''],
    homework: [''],
  });

  ngOnInit(): void {
    this._subjectService.getAll().subscribe((list) => this.subjects.set(list));
  }

  protected submit(): void {
    if (this.form.invalid || this.period() === null) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const v = this.form.getRawValue();
    this._journalService
      .create({
        date: this.date(),
        classId: this.classId(),
        title: v.title,
        content: v.content || v.title,
        homework: v.homework || undefined,
        period: this.period()!,
        color: this.color(),
        subjectId: this.subjectId() ?? undefined,
      })
      .subscribe(() => {
        this.saving.set(false);
        this.saved.emit();
      });
  }
}
