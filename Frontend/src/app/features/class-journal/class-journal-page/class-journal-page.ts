import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { JournalService } from '@core/services/journal.service';
import { ClassJournal } from '@core/models/journal.interface';
import { PERIODS } from '@core/constants/periods';
import {WeekPlanner} from '@features/class-journal/week-planner/week-planner';

@Component({
  selector: 'app-class-journal-page',
  imports: [WeekPlanner],

  templateUrl: './class-journal-page.html',
  styleUrl: './class-journal-page.scss',
})
export class ClassJournalPage implements OnInit {
  private readonly _journalService = inject(JournalService);

  private readonly _today = new Date().toISOString().slice(0, 10);

  protected readonly entries = signal<ClassJournal[]>([]);
  protected readonly view = signal<'day' | 'week'>('day');

  private readonly _byPeriod = computed(() => {
    const map = new Map<number, ClassJournal>();
    for (const e of this.entries()) {
      if (e.date.slice(0, 10) === this._today && e.period != null) {
        map.set(e.period, e);
      }
    }
    return map;
  });

  protected readonly halves = computed(() => [
    { label: 'Morning', rows: this._rowsFor('AM') },
    { label: 'Afternoon', rows: this._rowsFor('PM') },
  ]);

  protected readonly todayLabel = computed(() => {
    const [y, m, d] = this._today.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  });

  protected readonly doneCount = computed(
    () => [...this._byPeriod().values()].filter((e) => e.done).length,
  );
  protected readonly totalCount = computed(() => this._byPeriod().size);

  ngOnInit(): void {
    this._journalService.getAll().subscribe((list) => this.entries.set(list));
  }

  protected toggleDone(item: ClassJournal): void {
    const next = !item.done;
    this._journalService.setDone(item.id, next).subscribe(() => {
      this.entries.update((list) =>
        list.map((e) => (e.id === item.id ? { ...e, done: next } : e)),
      );
    });
  }

  private _rowsFor(half: 'AM' | 'PM') {
    return PERIODS.filter((p) => p.half === half).map((period) => ({
      period,
      entry: this._byPeriod().get(period.n) ?? null,
    }));
  }
}
