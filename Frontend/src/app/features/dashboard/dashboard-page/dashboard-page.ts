import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { ContextService } from '@core/services/context.service';
import { JournalService } from '@core/services/journal.service';
import { EventService } from '@core/services/event.service';
import { ClassJournal } from '@core/models/journal.interface';
import { AgendaEvent } from '@core/models/event.interface';
import { AttendanceSession } from '@core/enums/attendance.enum';
import { UserRole } from '@core/enums/user-role.enum';
import { AttendanceCard } from '../attendance-card/attendance-card';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, AttendanceCard],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  protected readonly auth = inject(AuthService);
  protected readonly context = inject(ContextService);
  private readonly _journalService = inject(JournalService);
  private readonly _eventService = inject(EventService);

  private readonly _today = new Date().toISOString().slice(0, 10);
  private readonly _now = new Date();

  protected readonly AttendanceSession = AttendanceSession;

  protected readonly students = computed(() => this.context.selectedClass()?.students ?? []);
  protected readonly journal = signal<ClassJournal[]>([]);
  protected readonly events = signal<AgendaEvent[]>([]);

  protected readonly isManager = computed(() => {
    const r = this.auth.role();
    return r === UserRole.ADMIN || r === UserRole.PRINCIPAL;
  });

  protected readonly isWednesday = this._now.getDay() === 3;
  protected readonly afternoonAvailable = !this.isWednesday && this._now.getHours() >= 13;
  protected readonly afternoonReason = this.isWednesday
    ? 'No school on Wednesday afternoon'
    : 'Available from 1:00 PM';

  protected readonly todayJournal = computed(() =>
    this.journal().filter((j) => j.date.slice(0, 10) === this._today),
  );
  protected readonly todoCount = computed(
    () => this.todayJournal().filter((j) => !j.done).length,
  );
  protected readonly allJournalDone = computed(() => {
    const items = this.todayJournal();
    return items.length > 0 && items.every((j) => j.done);
  });

  protected readonly todayEvents = computed(() =>
    this.events().filter((e) => e.date.slice(0, 10) === this._today),
  );

  ngOnInit(): void {
    this.auth.loadCurrentUser().subscribe();
    this.context.load();
    this._journalService.getAll().subscribe((list) => this.journal.set(list));
    this._eventService.getAll().subscribe((list) => this.events.set(list));
  }

  protected toggleAllJournal(): void {
    const items = this.todayJournal();
    if (!items.length) return;
    const target = !this.allJournalDone();
    forkJoin(items.map((i) => this._journalService.setDone(i.id, target))).subscribe(() => {
      const ids = new Set(items.map((i) => i.id));
      this.journal.update((list) =>
        list.map((j) => (ids.has(j.id) ? { ...j, done: target } : j)),
      );
    });
  }

  protected toggleJournalDone(item: ClassJournal): void {
    const next = !item.done;
    this._journalService.setDone(item.id, next).subscribe(() => {
      this.journal.update((list) =>
        list.map((j) => (j.id === item.id ? { ...j, done: next } : j)),
      );
    });
  }

  private parseLocalDate(date: string): Date {
    const [y, m, d] = date.slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  protected eventDay(e: AgendaEvent): string {
    return this.parseLocalDate(e.date).getDate().toString();
  }

  protected eventMonth(e: AgendaEvent): string {
    return this.parseLocalDate(e.date).toLocaleDateString('en', { month: 'short' });
  }

  protected eventSubtitle(e: AgendaEvent): string {
    const rel = this._relativeDay(e.date);
    if (e.allDay) return `${rel} · All day`;
    if (e.startTime && e.endTime) return `${rel} · ${this._hm(e.startTime)} – ${this._hm(e.endTime)}`;
    if (e.startTime) return `${rel} · ${this._hm(e.startTime)}`;
    return rel;
  }

  private _relativeDay(date: string): string {
    const today = this.parseLocalDate(this._today);
    const d = this.parseLocalDate(date);
    const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';
    return d.toLocaleDateString('en', { weekday: 'long' });
  }

  private _hm(time: string): string {
    return time.slice(0, 5);
  }
}