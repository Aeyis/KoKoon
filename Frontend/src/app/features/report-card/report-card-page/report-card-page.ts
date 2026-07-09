import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ClassService } from '@core/services/class.service';
import { EvaluationService } from '@core/services/evaluation.service';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';
import { ClassRoom } from '@core/models/class.interface';
import { Evaluation } from '@core/models/evaluation.interface';

@Component({
  selector: 'app-report-card-page',
  imports: [MatIcon, StudentAvatar],
  templateUrl: './report-card-page.html',
  styleUrl: './report-card-page.scss',
})
export class ReportCardPage implements OnInit {
  private readonly _classService = inject(ClassService);
  private readonly _evaluationService = inject(EvaluationService);

  protected readonly tab = signal<'behavior' | 'results' | 'send'>('results');
  protected readonly classRoom = signal<ClassRoom | null>(null);
  protected readonly evaluations = signal<Evaluation[]>([]);

  protected readonly students = computed(() => this.classRoom()?.students ?? []);

  private readonly _avgByStudent = computed(() => {
    const sums = new Map<number, { total: number; count: number }>();
    for (const e of this.evaluations()) {
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
  }

  protected average(studentId: number): number | null {
    return this._avgByStudent().get(studentId) ?? null;
  }
}
