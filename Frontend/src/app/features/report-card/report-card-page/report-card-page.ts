import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ClassService } from '@core/services/class.service';
import { EvaluationService } from '@core/services/evaluation.service';
import { ConductService } from '@core/services/conduct.service';
import { StudentService } from '@core/services/student.service';
import { PeriodService } from '@core/services/period.service';
import { ReportCardService } from '@core/services/report-card.service';
import { SubjectService } from '@core/services/subject.service';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';
import { EvalSheet } from '../eval-sheet/eval-sheet';
import { Subject } from '@core/models/subject.interface';
import { ClassRoom } from '@core/models/class.interface';
import { Evaluation } from '@core/models/evaluation.interface';
import { ConductAssessment } from '@core/models/conduct.interface';
import { Student, Guardian } from '@core/models/student.interface';
import { Period } from '@core/models/period.interface';
import { ReportCard } from '@core/models/report-card.interface';

@Component({
  selector: 'app-report-card-page',
  imports: [RouterLink, MatIcon, StudentAvatar, EvalSheet],
  templateUrl: './report-card-page.html',
  styleUrl: './report-card-page.scss',
})
export class ReportCardPage implements OnInit {
  private readonly _classService = inject(ClassService);
  private readonly _evaluationService = inject(EvaluationService);
  private readonly _conductService = inject(ConductService);
  private readonly _studentService = inject(StudentService);
  private readonly _periodService = inject(PeriodService);
  private readonly _reportCardService = inject(ReportCardService);
  private readonly _subjectService = inject(SubjectService);

  protected readonly reportCards = signal<ReportCard[]>([]);
  protected readonly periods = signal<Period[]>([]);
  protected readonly subjects = signal<Subject[]>([]);
  protected readonly showSheet = signal(false);
  private readonly _studentsFull = signal<Student[]>([]);

  protected readonly latestPeriodId = computed(() => {
    const p = this.periods();
    return p.length ? p[p.length - 1].id : null;
  });

  private readonly _guardianMap = computed(() => {
    const map = new Map<number, Guardian>();
    for (const s of this._studentsFull()) {
      if (s.guardians?.length) map.set(s.id, s.guardians[0]);
    }
    return map;
  });

  private readonly _sentSet = computed(() => {
    const pid = this.latestPeriodId();
    const set = new Set<number>();
    for (const rc of this.reportCards()) {
      if (rc.period.id === pid && (rc.status === 'PUBLISHED' || rc.status === 'SIGNED')) {
        set.add(rc.student.id);
      }
    }
    return set;
  });

  protected readonly sentCount = computed(
    () => this.students().filter((s) => this._sentSet().has(s.id)).length,
  );

  protected readonly tab = signal<'behavior' | 'results' | 'send'>('results');
  protected readonly classRoom = signal<ClassRoom | null>(null);
  protected readonly evaluations = signal<Evaluation[]>([]);
  protected readonly conduct = signal<ConductAssessment[]>([]);

  private readonly _conductByStudent = computed(() => {
    const val: Record<string, number> = { ACQUIRED: 2, EVOLVING: 1, DIFFICULTY: 0 };
    const sums = new Map<number, { sum: number; count: number }>();
    for (const a of this.conduct()) {
      const cur = sums.get(a.student.id) ?? { sum: 0, count: 0 };
      cur.sum += val[a.level] ?? 0;
      cur.count += 1;
      sums.set(a.student.id, cur);
    }
    const out = new Map<number, 'good' | 'evolving' | 'difficulty'>();
    for (const [id, { sum, count }] of sums) {
      const avg = sum / count;
      out.set(id, avg >= 1.5 ? 'good' : avg >= 0.75 ? 'evolving' : 'difficulty');
    }
    return out;
  });

  protected readonly students = computed(() => this.classRoom()?.students ?? []);

  private readonly _avgByStudent = computed(() => {
    const sums = new Map<number, { total: number; count: number }>();
    for (const e of this.evaluations()) {
      if (e.score == null || e.maxScore == null || e.maxScore === 0) continue;
      const norm = (e.score / e.maxScore) * 100;
      const cur = sums.get(e.student.id) ?? { total: 0, count: 0 };
      cur.total += norm;
      cur.count += 1;
      sums.set(e.student.id, cur);
    }
    const avg = new Map<number, number>();
    for (const [id, { total, count }] of sums) avg.set(id, Math.round(total / count));
    return avg;
  });

  protected readonly classAverage = computed(() => {
    const values = [...this._avgByStudent().values()];
    if (!values.length) return null;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  });

  ngOnInit(): void {
    this._classService.getAll().subscribe((c) => this.classRoom.set(c[0] ?? null));
    this._evaluationService.getAll().subscribe((list) => this.evaluations.set(list));
    this._conductService.getAssessments().subscribe((list) => this.conduct.set(list));
    this._studentService.getAll().subscribe((list) => this._studentsFull.set(list));
    this._periodService.getAll().subscribe((p) => this.periods.set([...p].sort((a, b) => a.id - b.id)));
    this._reportCardService.getAll().subscribe((list) => this.reportCards.set(list));
    this._subjectService.getAll().subscribe((list) => this.subjects.set(list));
  }

  protected onSheetSaved(): void {
    this.showSheet.set(false);
    this._evaluationService.getAll().subscribe((list) => this.evaluations.set(list));
  }

  protected guardianOf(studentId: number): Guardian | null {
    return this._guardianMap().get(studentId) ?? null;
  }

  protected isSent(studentId: number): boolean {
    return this._sentSet().has(studentId);
  }

  protected send(studentId: number): void {
    const pid = this.latestPeriodId();
    if (pid === null) return;
    this._reportCardService.publish(studentId, pid).subscribe((rc) => {
      this.reportCards.update((list) => {
        const entry: ReportCard = {
          id: rc.id,
          status: 'PUBLISHED',
          student: { id: studentId },
          period: { id: pid },
        };
        const idx = list.findIndex((x) => x.student.id === studentId && x.period.id === pid);
        if (idx >= 0) {
          const copy = [...list];
          copy[idx] = entry;
          return copy;
        }
        return [...list, entry];
      });
    });
  }

  protected sendAll(): void {
    for (const s of this.students()) {
      if (this.guardianOf(s.id)) this.send(s.id);
    }
  }

  protected average(studentId: number): number | null {
    return this._avgByStudent().get(studentId) ?? null;
  }

  protected conductState(studentId: number): 'good' | 'evolving' | 'difficulty' | 'none' {
    return this._conductByStudent().get(studentId) ?? 'none';
  }

  protected conductLabel(studentId: number): string {
    switch (this.conductState(studentId)) {
      case 'good':
        return 'On track';
      case 'evolving':
        return 'Some points evolving';
      case 'difficulty':
        return 'Needs attention';
      default:
        return 'Not assessed';
    }
  }
}
