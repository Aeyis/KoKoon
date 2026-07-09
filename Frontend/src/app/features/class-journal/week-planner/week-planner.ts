import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ClassJournal } from '@core/models/journal.interface';
import { PERIODS } from '@core/constants/periods';
import { JournalService } from '@core/services/journal.service';

@Component({
  selector: 'app-week-planner',
  imports: [],
  templateUrl: './week-planner.html',
  styleUrl: './week-planner.scss',
})
export class WeekPlanner {
  private readonly _journal = inject(JournalService);

  readonly entries = input.required<ClassJournal[]>();
  readonly moveMode = input(false);
  readonly changed = output<void>();
  readonly add = output<{ date: string; period: number }>();
  readonly edit = output<ClassJournal>();

  protected readonly PERIODS = PERIODS;

  protected readonly weekOffset = signal(0);
  protected readonly selectedId = signal<number | null>(null);
  protected readonly hasSelection = computed(() => this.selectedId() !== null);

  constructor() {
    effect(() => {
      if (!this.moveMode()) this.selectedId.set(null);
    });
  }

  protected readonly days = computed(() => {
    const base = new Date();
    const dow = base.getDay();
    const diffToMonday = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate() + diffToMonday + this.weekOffset() * 7,
    );
    const todayIso = this._iso(new Date());

    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const iso = this._iso(d);
      return {
        date: iso,
        weekday: d.toLocaleDateString('en', { weekday: 'short' }),
        num: d.getDate(),
        isToday: iso === todayIso,
      };
    });
  });

  protected readonly weekLabel = computed(() => {
    const ds = this.days();
    return `${this._short(ds[0].date)} – ${this._short(ds[ds.length - 1].date)}`;
  });

  private readonly _lookup = computed(() => {
    const map = new Map<string, ClassJournal>();
    for (const e of this.entries()) {
      if (e.period != null) map.set(`${e.date.slice(0, 10)}#${e.period}`, e);
    }
    return map;
  });

  protected cell(date: string, period: number): ClassJournal | null {
    return this._lookup().get(`${date}#${period}`) ?? null;
  }

  protected prevWeek(): void {
    this.weekOffset.update((v) => v - 1);
  }

  protected nextWeek(): void {
    this.weekOffset.update((v) => v + 1);
  }

  protected select(id: number | null): void {
    this.selectedId.set(id);
  }

  protected moveTo(date: string, period: number): void {
    const id = this.selectedId();
    if (id === null) return;
    const dragged = this.entries().find((e) => e.id === id);
    if (!dragged) return;
    if (dragged.date.slice(0, 10) === date && dragged.period === period) {
      this.selectedId.set(null);
      return;
    }
    const target = this.cell(date, period);
    this._journal.move(id, date, period).subscribe(() => {
      if (target && target.id !== id) {
        this._journal
          .move(target.id, dragged.date.slice(0, 10), dragged.period!)
          .subscribe(() => {
            this.selectedId.set(null);
            this.changed.emit();
          });
      } else {
        this.selectedId.set(null);
        this.changed.emit();
      }
    });
  }

  private _iso(d: Date): string {
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  private _short(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en', { month: 'short', day: 'numeric' });
  }
}
