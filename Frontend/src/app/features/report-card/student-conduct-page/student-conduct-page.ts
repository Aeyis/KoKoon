import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';
import { CommentCard, CommentTerm } from '@shared/components/comment-card/comment-card';
import { StudentService } from '@core/services/student.service';
import { PeriodService } from '@core/services/period.service';
import { ConductService } from '@core/services/conduct.service';
import { ReportCardService } from '@core/services/report-card.service';
import { StudentDetail } from '@core/models/student.interface';
import { Period } from '@core/models/period.interface';
import { ConductItem, ConductAssessment } from '@core/models/conduct.interface';
import { ReportCard } from '@core/models/report-card.interface';
import { ConductLevel } from '@core/enums/conduct.enum';

@Component({
  selector: 'app-student-conduct-page',
  imports: [RouterLink, MatIcon, StudentAvatar, CommentCard],
  templateUrl: './student-conduct-page.html',
  styleUrl: './student-conduct-page.scss',
})
export class StudentConductPage implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _studentService = inject(StudentService);
  private readonly _periodService = inject(PeriodService);
  private readonly _conductService = inject(ConductService);
  private readonly _reportCardService = inject(ReportCardService);

  private _studentId = 0;

  protected readonly student = signal<StudentDetail | null>(null);
  protected readonly periods = signal<Period[]>([]);
  protected readonly items = signal<ConductItem[]>([]);
  protected readonly assessments = signal<ConductAssessment[]>([]);

  protected readonly periodLabels = computed(() => this.periods().map((_, i) => `T${i + 1}`));

  private readonly _byKey = computed(() => {
    const map = new Map<string, ConductLevel>();
    for (const a of this.assessments()) map.set(`${a.item.id}#${a.period.id}`, a.level);
    return map;
  });

  // --- Appréciation du titulaire sur le comportement ---
  protected readonly reportCards = signal<ReportCard[]>([]);
  protected readonly commentPeriodId = signal<number | null>(null);

  protected readonly commentTerms = computed<CommentTerm[]>(() =>
    this.periods().map((p, i) => ({ id: p.id, label: `T${i + 1}` })),
  );

  protected readonly comment = computed(() => {
    const pid = this.commentPeriodId();
    const rc = this.reportCards().find((r) => r.period.id === pid);
    return rc?.conductComment?.trim() ? rc.conductComment! : null;
  });

  protected saveComment(text: string): void {
    const pid = this.commentPeriodId();
    if (pid === null) return;
    this._reportCardService
      .saveComment(this._studentId, pid, { conductComment: text })
      .subscribe(() => this._loadReportCards());
  }

  private _loadReportCards(): void {
    this._reportCardService
      .getAll()
      .subscribe((list) => this.reportCards.set(list.filter((r) => r.student.id === this._studentId)));
  }

  ngOnInit(): void {
    this._studentId = Number(this._route.snapshot.paramMap.get('id'));
    this._studentService.getOne(this._studentId).subscribe((s) => this.student.set(s));
    this._periodService.getAll().subscribe((p) => {
      const sorted = [...p].sort((a, b) => a.id - b.id);
      this.periods.set(sorted);
      // par défaut on commente la période en cours (la dernière)
      if (sorted.length) this.commentPeriodId.set(sorted[sorted.length - 1].id);
    });
    this._conductService.getItems().subscribe((i) => this.items.set(i));
    this._loadReportCards();
    this._conductService
      .getAssessments()
      .subscribe((list) => this.assessments.set(list.filter((a) => a.student.id === this._studentId)));
  }

  protected levelFor(itemId: number, periodId: number): ConductLevel | null {
    return this._byKey().get(`${itemId}#${periodId}`) ?? null;
  }

  protected cycle(itemId: number, periodId: number): void {
    const order = [ConductLevel.ACQUIRED, ConductLevel.EVOLVING, ConductLevel.DIFFICULTY];
    const cur = this.levelFor(itemId, periodId);
    const next = cur === null ? ConductLevel.ACQUIRED : order[(order.indexOf(cur) + 1) % order.length];
    this._conductService.setLevel(this._studentId, itemId, periodId, next).subscribe((saved) => {
      this.assessments.update((list) => {
        const idx = list.findIndex((a) => a.item.id === itemId && a.period.id === periodId);
        if (idx >= 0) {
          const copy = [...list];
          copy[idx] = { ...copy[idx], level: next };
          return copy;
        }
        return [
          ...list,
          {
            id: saved.id,
            level: next,
            student: { id: this._studentId },
            item: { id: itemId },
            period: { id: periodId },
          },
        ];
      });
    });
  }
}
