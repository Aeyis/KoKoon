import {Component, computed, input} from '@angular/core';
import {ClassJournal} from '@core/models/journal.interface';
import {PERIODS} from '@core/constants/periods';

@Component({
  selector: 'app-week-planner',
  imports: [],
  templateUrl: './week-planner.html',
  styleUrl: './week-planner.scss',
})
export class WeekPlanner {
  readonly entries = input.required<ClassJournal[]>();

  protected readonly PERIODS= PERIODS;

  protected readonly days = computed(() => {
    const today = new Date();
    const dow = today.getDay();  //0 = sunday
    const diffToMonday = dow === 0? -6 : 1 - dow;
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + diffToMonday);
    const todayIso = this._iso(today);

    return Array.from({ length:5 }, (_, i) => {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const iso = this._iso(d);
      return{
        date: iso,
        weekday: d.toLocaleDateString('en', {weekday: 'short'}),
        num: d.getDate(),
        isToday: iso === todayIso,
      };
    });
  });
  private readonly _lookup= computed(() => {
    const map = new Map<string, ClassJournal>();
    for (const e of this.entries()) {
      if (e.period != null) map.set(`${e.date.slice(0, 10)}#{e.period}`,e);
    }
    return map;
  });

  protected cell(date:string, period:number):ClassJournal | null {
    return this._lookup().get(`${date}#${period}`) ?? null;
  }

  private _iso(d:Date): string {
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }
}
