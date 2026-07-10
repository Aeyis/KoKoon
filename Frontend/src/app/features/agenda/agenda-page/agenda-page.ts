import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EventService } from '@core/services/event.service';
import { ClassService } from '@core/services/class.service';
import { AgendaEvent } from '@core/models/event.interface';
import { EventCategory } from '@core/enums/event.enum';
import { EventForm } from '../event-form/event-form';

interface DayCell {
  day: number;
  iso: string;
  isToday: boolean;
  events: AgendaEvent[];
}

@Component({
  selector: 'app-agenda-page',
  imports: [EventForm],
  templateUrl: './agenda-page.html',
  styleUrl: './agenda-page.scss',
})
export class AgendaPage implements OnInit {
  private readonly _eventService = inject(EventService);
  private readonly _classService = inject(ClassService);

  protected readonly weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  protected readonly events = signal<AgendaEvent[]>([]);
  protected readonly viewMonth = signal(new Date());
  protected readonly classId = signal<number | null>(null);
  protected readonly showForm = signal(false);
  protected readonly formDate = signal('');

  protected readonly monthLabel = computed(() =>
    this.viewMonth().toLocaleDateString('en', { month: 'long', year: 'numeric' }),
  );

  private readonly _byDay = computed(() => {
    const m = new Map<string, AgendaEvent[]>();
    for (const e of this.events()) {
      const day = e.date.slice(0, 10);
      const arr = m.get(day) ?? [];
      arr.push(e);
      m.set(day, arr);
    }
    return m;
  });

  protected readonly grid = computed<(DayCell | null)[]>(() => {
    const base = this.viewMonth();
    const year = base.getFullYear();
    const month = base.getMonth();
    const startBlanks = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayIso = this._iso(new Date());
    const cells: (DayCell | null)[] = [];
    for (let i = 0; i < startBlanks; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = this._iso(new Date(year, month, d));
      cells.push({
        day: d,
        iso,
        isToday: iso === todayIso,
        events: this._byDay().get(iso) ?? [],
      });
    }
    return cells;
  });

  protected readonly monthEvents = computed(() => {
    const base = this.viewMonth();
    const y = base.getFullYear();
    const m = base.getMonth() + 1;
    return this.events()
      .filter((e) => {
        const [ey, em] = e.date.split('-').map(Number);
        return ey === y && em === m;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  ngOnInit(): void {
    this._eventService.getAll().subscribe((list) => this.events.set(list));
    this._classService.getAll().subscribe((c) => this.classId.set(c[0]?.id ?? null));
  }

  protected openForm(iso: string): void {
    this.formDate.set(iso);
    this.showForm.set(true);
  }

  protected openToday(): void {
    this.openForm(this._iso(new Date()));
  }

  protected onSaved(): void {
    this.showForm.set(false);
    this._eventService.getAll().subscribe((list) => this.events.set(list));
  }

  protected prevMonth(): void {
    const d = this.viewMonth();
    this.viewMonth.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  protected nextMonth(): void {
    const d = this.viewMonth();
    this.viewMonth.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  protected catLabel(cat: EventCategory | null): string {
    switch (cat) {
      case EventCategory.OUTING:
        return 'Outing';
      case EventCategory.MEETING:
        return 'Meeting';
      case EventCategory.SCHOOL:
        return 'School';
      default:
        return 'Other';
    }
  }

  protected evDay(e: AgendaEvent): number {
    return Number(e.date.slice(8, 10));
  }

  protected evMonth(e: AgendaEvent): string {
    const [y, m, d] = e.date.slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en', { month: 'short' });
  }

  private _iso(d: Date): string {
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }
}
