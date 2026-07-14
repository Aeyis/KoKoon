import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MeService } from '@core/services/me.service';
import { Student } from '@core/models/student.interface';
import { Evaluation } from '@core/models/evaluation.interface';
import { ConductAssessment } from '@core/models/conduct.interface';
import { ConductLevel } from '@core/enums/conduct.enum';
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
  selector: 'app-parent-report-page',
  imports: [],
  templateUrl: './parent-report-page.html',
  styleUrl: './parent-report-page.scss',
})
export class ParentReportPage implements OnInit {
  private readonly _meService = inject(MeService);

  protected readonly child = signal<Student | null>(null);
  protected readonly evaluations = signal<Evaluation[]>([]);
  protected readonly conduct = signal<ConductAssessment[]>([]);
  protected readonly tab = signal<'behavior' | 'results'>('results');

  protected readonly periods = computed(() => {
    const m = new Map<number, string>();
    for (const e of this.evaluations()) m.set(e.period.id, e.period.name);
    for (const a of this.conduct()) {
      const p = a.period as { id: number; name?: string };
      m.set(p.id, p.name ?? '');
    }
    return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([id, name]) => ({ id, name }));
  });

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

  protected readonly conductItems = computed(() => {
    const m = new Map<number, { label: string; position: number }>();
    for (const a of this.conduct()) {
      // item may only carry id if relations differ; guard with label fallback
      const item = a.item as unknown as { id: number; label?: string; position?: number };
      m.set(item.id, { label: item.label ?? '', position: item.position ?? 0 });
    }
    return [...m.entries()]
      .sort((a, b) => a[1].position - b[1].position || a[0] - b[0])
      .map(([id, v]) => ({ id, label: v.label }));
  });

  private readonly _conductByKey = computed(() => {
    const m = new Map<string, ConductLevel>();
    for (const a of this.conduct()) m.set(`${a.item.id}#${a.period.id}`, a.level);
    return m;
  });

  protected readonly history = computed(() => {
    const pLabel = new Map(this.periods().map((p, i) => [p.id, `T${i + 1}`]));
    return this.evaluations()
      .slice()
      .sort((a, b) => a.period.id - b.period.id || a.subject.name.localeCompare(b.subject.name))
      .map((e) => ({
        id: e.id,
        title: e.title,
        subject: e.subject.name,
        term: pLabel.get(e.period.id) ?? '',
        score: e.score,
        maxScore: e.maxScore,
        grade: e.grade,
      }));
  });

  ngOnInit(): void {
    this._meService.getChildren().subscribe((list) => {
      const c = list[0] ?? null;
      this.child.set(c);
      if (c) {
        this._meService.getChildEvaluations(c.id).subscribe((e) => this.evaluations.set(e));
        this._meService.getChildConduct(c.id).subscribe((a) => this.conduct.set(a));
      }
    });
  }

  protected conductLevel(itemId: number, periodId: number): ConductLevel | null {
    return this._conductByKey().get(`${itemId}#${periodId}`) ?? null;
  }

  protected hasConduct(): boolean {
    return this.conductItems().length > 0;
  }
}
