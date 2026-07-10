import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';
import { Dropdown, DropdownOption } from '@shared/components/dropdown/dropdown';
import { EvaluationService } from '@core/services/evaluation.service';
import { Student } from '@core/models/student.interface';
import { Subject } from '@core/models/subject.interface';
import { Period } from '@core/models/period.interface';
import { SUBJECT_COMPETENCIES, LETTER_GRADES } from '@core/constants/subject-competencies';

@Component({
  selector: 'app-eval-sheet',
  imports: [StudentAvatar, Dropdown],
  templateUrl: './eval-sheet.html',
  styleUrl: './eval-sheet.scss',
})
export class EvalSheet implements OnInit {
  private readonly _evaluationService = inject(EvaluationService);

  readonly classId = input.required<number>();
  readonly students = input.required<Student[]>();
  readonly subjects = input.required<Subject[]>();
  readonly periods = input.required<Period[]>();

  readonly saved = output<void>();
  readonly cancelled = output<void>();

  protected readonly LETTER_GRADES = LETTER_GRADES;

  protected readonly subjectId = signal<number | null>(null);
  protected readonly periodId = signal<number | null>(null);
  protected readonly competency = signal('');
  protected readonly title = signal('');
  protected readonly maxScore = signal(20);
  protected readonly grades = signal<Record<number, string>>({});
  protected readonly saving = signal(false);

  protected readonly gradableSubjects = computed(() =>
    this.subjects().filter((s) => SUBJECT_COMPETENCIES[s.name] !== undefined),
  );

  private readonly _spec = computed(() => {
    const s = this.subjects().find((x) => x.id === this.subjectId());
    return s ? (SUBJECT_COMPETENCIES[s.name] ?? null) : null;
  });

  protected readonly competencyOptions = computed(() => this._spec()?.competencies ?? []);
  protected readonly scale = computed(() => this._spec()?.scale ?? 'numeric');

  protected readonly subjectOptions = computed<DropdownOption[]>(() =>
    this.gradableSubjects().map((s) => ({ value: s.id, label: s.name })),
  );
  protected readonly periodOptions = computed<DropdownOption[]>(() =>
    this.periods().map((p) => ({ value: p.id, label: p.name })),
  );
  protected readonly competencyDdOptions = computed<DropdownOption[]>(() =>
    this.competencyOptions().map((c) => ({ value: c, label: c })),
  );
  protected readonly letterOptions: DropdownOption[] = LETTER_GRADES.map((g) => ({
    value: g,
    label: g,
  }));

  protected readonly canSave = computed(
    () =>
      this.subjectId() !== null &&
      this.periodId() !== null &&
      this.competency().trim() !== '' &&
      (this.scale() !== 'numeric' || this.maxScore() > 0) &&
      Object.values(this.grades()).some((v) => v.trim() !== ''),
  );

  ngOnInit(): void {
    const periods = this.periods();
    if (periods.length) this.periodId.set(periods[periods.length - 1].id);
  }

  protected setSubject(id: number | null): void {
    this.subjectId.set(id);
    this.competency.set('');
    this.grades.set({});
  }

  protected setGrade(studentId: number, value: string): void {
    this.grades.update((g) => ({ ...g, [studentId]: value }));
  }

  protected submit(): void {
    const sid = this.subjectId();
    const pid = this.periodId();
    if (sid === null || pid === null || !this.canSave()) return;

    const date = new Date().toISOString().slice(0, 10);
    const competency = this.competency().trim();
    const title = this.title().trim() || competency;
    const letter = this.scale() === 'letter';
    const requests = [];

    for (const s of this.students()) {
      const raw = this.grades()[s.id];
      if (raw === undefined || raw.trim() === '') continue;
      if (letter) {
        requests.push(
          this._evaluationService.create({
            title,
            competency,
            grade: raw,
            date,
            studentId: s.id,
            subjectId: sid,
            periodId: pid,
          }),
        );
      } else {
        const score = Number(raw.replace(',', '.'));
        if (Number.isNaN(score)) continue;
        requests.push(
          this._evaluationService.create({
            title,
            competency,
            score,
            maxScore: this.maxScore(),
            date,
            studentId: s.id,
            subjectId: sid,
            periodId: pid,
          }),
        );
      }
    }

    if (!requests.length) {
      this.saved.emit();
      return;
    }
    this.saving.set(true);
    forkJoin(requests).subscribe(() => {
      this.saving.set(false);
      this.saved.emit();
    });
  }
}
