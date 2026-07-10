import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';
import { StudentService } from '@core/services/student.service';
import { PeriodService } from '@core/services/period.service';
import { EvaluationService } from '@core/services/evaluation.service';
import { StudentDetail } from '@core/models/student.interface';
import { Period } from '@core/models/period.interface';
import { Evaluation } from '@core/models/evaluation.interface';
import { SUBJECT_COMPETENCIES, Scale } from '@core/constants/subject-competencies';

interface CompRow {
  title: string;
  cells: (number | string | null)[];
}

interface SubjectBlock {
  id: number;
  name: string;
  scale: Scale;
  yearAvg: number | null;
  avgByPeriod: (number | null)[];
  competencies: CompRow[];
}

@Component({
  selector: 'app-student-report-page',
  imports: [RouterLink, MatIcon, StudentAvatar],
  templateUrl: './student-report-page.html',
  styleUrl: './student-report-page.scss',
})
export class StudentReportPage implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _studentService = inject(StudentService);
  private readonly _periodService = inject(PeriodService);
  private readonly _evaluationService = inject(EvaluationService);

  protected readonly student = signal<StudentDetail | null>(null);
  protected readonly periods = signal<Period[]>([]);
  protected readonly evaluations = signal<Evaluation[]>([]);

  protected readonly periodLabels = computed(() => this.periods().map((_, i) => `T${i + 1}`));

  protected readonly yearAverage = computed(() => {
    const numeric = this.evaluations().filter((e) => e.score != null && e.maxScore);
    if (!numeric.length) return null;
    const sum = numeric.reduce((a, e) => a + (e.score! / e.maxScore!) * 100, 0);
    return Math.round(sum / numeric.length);
  });

  protected readonly blocks = computed<SubjectBlock[]>(() => {
    const periods = this.periods();
    const pIndex = new Map(periods.map((p, i) => [p.id, i]));
    const subs = new Map<
      number,
      {
        name: string;
        scale: Scale;
        comps: Map<string, { sum: number; count: number; letter: string | null }[]>;
        totals: { sum: number; count: number }[];
        yearSum: number;
        yearCount: number;
      }
    >();

    for (const e of this.evaluations()) {
      const pi = pIndex.get(e.period.id);
      if (pi === undefined) continue;
      const scale = SUBJECT_COMPETENCIES[e.subject.name]?.scale ?? 'numeric';
      let s = subs.get(e.subject.id);
      if (!s) {
        s = {
          name: e.subject.name,
          scale,
          comps: new Map(),
          totals: periods.map(() => ({ sum: 0, count: 0 })),
          yearSum: 0,
          yearCount: 0,
        };
        subs.set(e.subject.id, s);
      }
      const comp = e.competency ?? e.title;
      let row = s.comps.get(comp);
      if (!row) {
        row = periods.map(() => ({ sum: 0, count: 0, letter: null }));
        s.comps.set(comp, row);
      }
      if (scale === 'letter') {
        if (e.grade) row[pi].letter = e.grade;
      } else if (e.score != null && e.maxScore) {
        const norm = (e.score / e.maxScore) * 100;
        row[pi].sum += norm;
        row[pi].count += 1;
        s.totals[pi].sum += norm;
        s.totals[pi].count += 1;
        s.yearSum += norm;
        s.yearCount += 1;
      }
    }

    return [...subs.entries()].map(([id, s]) => ({
      id,
      name: s.name,
      scale: s.scale,
      yearAvg: s.yearCount ? Math.round(s.yearSum / s.yearCount) : null,
      avgByPeriod: s.totals.map((t) => (t.count ? Math.round(t.sum / t.count) : null)),
      competencies: [...s.comps.entries()].map(([title, cells]) => ({
        title,
        cells: cells.map((c) =>
          s.scale === 'letter' ? c.letter : c.count ? Math.round(c.sum / c.count) : null,
        ),
      })),
    }));
  });

  ngOnInit(): void {
    const id = Number(this._route.snapshot.paramMap.get('id'));
    this._studentService.getOne(id).subscribe((s) => this.student.set(s));
    this._periodService.getAll().subscribe((p) => this.periods.set([...p].sort((a, b) => a.id - b.id)));
    this._evaluationService
      .getAll()
      .subscribe((list) => this.evaluations.set(list.filter((e) => e.student.id === id)));
  }
}
