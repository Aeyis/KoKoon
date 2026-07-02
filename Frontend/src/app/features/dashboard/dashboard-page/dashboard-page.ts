import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';
import { StudentService } from '@core/services/student.service';
import { AttendanceService } from '@core/services/attendance.service';
import { JournalService } from '@core/services/journal.service';
import { EventService } from '@core/services/event.service';
import { Student } from '@core/models/student.interface';
import { ClassJournal } from '@core/models/journal.interface';
import { AgendaEvent } from '@core/models/event.interface';
import { AttendanceSession, AttendanceStatus } from '@core/enums/attendance.enum';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatIcon, RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly _studentService = inject(StudentService);
  private readonly _attendanceService = inject(AttendanceService);
  private readonly _journalService = inject(JournalService);
  private readonly _eventService = inject(EventService);

  // date du jour au format 'YYYY-MM-DD' pour filtrer le journal
  private readonly _today = new Date().toISOString().slice(0, 10);

  protected readonly students = signal<Student[]>([]);
  protected readonly attendance = signal<Record<number, AttendanceStatus>>({});
  protected readonly journal = signal<ClassJournal[]>([]);
  protected readonly events = signal<AgendaEvent[]>([]);

  protected readonly presentCount = computed(
    () => Object.values(this.attendance()).filter((s) => s === AttendanceStatus.PRESENT).length,
  );
  protected readonly absentCount = computed(
    () => Object.values(this.attendance()).filter((s) => s === AttendanceStatus.ABSENT).length,
  );

  // % de présents, pour remplir l'anneau de la carte présences
  protected readonly presentRatio = computed(() => {
    const total = this.students().length;
    return total === 0 ? 0 : Math.round((this.presentCount() / total) * 100);
  });

  // true si tout le monde est présent (pour le bouton "tout cocher/décocher")
  protected readonly allPresent = computed(
    () =>
      this.students().length > 0 &&
      this.students().every((s) => this.attendance()[s.id] === AttendanceStatus.PRESENT),
  );

  // on ne garde que les entrées du journal datées d'aujourd'hui
  protected readonly todayJournal = computed(() =>
    this.journal().filter((j) => j.date.slice(0, 10) === this._today),
  );
  protected readonly todoCount = computed(
    () => this.todayJournal().filter((j) => !j.done).length,
  );

  // idem pour les événements : seulement ceux du jour
  protected readonly todayEvents = computed(() =>
    this.events().filter((e) => e.date.slice(0, 10) === this._today),
  );

  ngOnInit(): void {
    this.auth.loadCurrentUser().subscribe();
    this._studentService.getAll().subscribe((list) => {
      this.students.set(list);
      // tout le monde présent par défaut
      const initial: Record<number, AttendanceStatus> = {};
      for (const s of list) initial[s.id] = AttendanceStatus.PRESENT;
      this.attendance.set(initial);
    });
    this._journalService.getAll().subscribe((list) => this.journal.set(list));
    this._eventService.getAll().subscribe((list) => this.events.set(list));
  }

  protected isAbsent(studentId: number): boolean {
    return this.attendance()[studentId] === AttendanceStatus.ABSENT;
  }

  // bascule tout le monde : si tous présents -> tous absents, sinon -> tous présents
  protected toggleAll(): void {
    const next = this.allPresent() ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT;
    const updated: Record<number, AttendanceStatus> = {};
    for (const s of this.students()) updated[s.id] = next;
    this.attendance.set(updated);
  }

  protected toggle(studentId: number): void {
    this.attendance.update((current) => ({
      ...current,
      [studentId]:
        current[studentId] === AttendanceStatus.PRESENT
          ? AttendanceStatus.ABSENT
          : AttendanceStatus.PRESENT,
    }));
  }

  protected validate(): void {
    const date = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const records = this.students().map((s) => ({
      studentId: s.id,
      date,
      session: AttendanceSession.MORNING,
      status: this.attendance()[s.id],
    }));

    this._attendanceService.createMany(records).subscribe({
      next: () => console.log('Attendance saved ✅'),
      error: (err) => console.error('Save failed', err),
    });
  }

  // coche/décoche une ligne du journal : PATCH puis maj du signal une fois la réponse OK
  protected toggleJournalDone(item: ClassJournal): void {
    const next = !item.done;
    this._journalService.setDone(item.id, next).subscribe(() => {
      this.journal.update((list) =>
        list.map((j) => (j.id === item.id ? { ...j, done: next } : j)),
      );
    });
  }

  // --- helpers de formatage date/heure pour les événements ---

  // 'YYYY-MM-DD...' -> Date locale (évite le décalage d'un jour dû à l'UTC sur une date sans heure)
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

  // sous-titre = jour relatif + horaire (ex: "Today · 14:00", "Tomorrow · 09:00 – 16:00")
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

  // '14:00:00' -> '14:00'
  private _hm(time: string): string {
    return time.slice(0, 5);
  }
}