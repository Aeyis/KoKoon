import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MeService } from '@core/services/me.service';
import { Student } from '@core/models/student.interface';
import { ClassJournal } from '@core/models/journal.interface';

@Component({
  selector: 'app-parent-journal-page',
  imports: [],
  templateUrl: './parent-journal-page.html',
  styleUrl: './parent-journal-page.scss',
})
export class ParentJournalPage implements OnInit {
  private readonly _meService = inject(MeService);
  private readonly _today = new Date().toISOString().slice(0, 10);

  protected readonly child = signal<Student | null>(null);
  protected readonly journal = signal<ClassJournal[]>([]);

  protected readonly todayEntries = computed(() =>
    this.journal()
      .filter((j) => j.date.slice(0, 10) === this._today && j.period != null)
      .sort((a, b) => (a.period ?? 0) - (b.period ?? 0)),
  );

  protected readonly homework = computed(() => this.todayEntries().filter((j) => j.homework));

  protected readonly todayLabel = computed(() => {
    const [y, m, d] = this._today.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  });

  ngOnInit(): void {
    this._meService.getChildren().subscribe((list) => {
      const c = list[0] ?? null;
      this.child.set(c);
      if (c) this._meService.getChildJournal(c.id).subscribe((j) => this.journal.set(j));
    });
  }
}
