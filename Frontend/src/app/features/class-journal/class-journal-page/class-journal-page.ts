import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { JournalService } from '@core/services/journal.service';
import { ClassJournal } from '@core/models/journal.interface';
import { PERIODS } from '@core/constants/periods';
import {WeekPlanner} from '@features/class-journal/week-planner/week-planner';
import { TaskForm } from '../task-form/task-form';
import { ClassService } from '@core/services/class.service';

@Component({
  selector: 'app-class-journal-page',
  imports: [WeekPlanner, TaskForm, CdkDrag, CdkDropList, CdkDropListGroup, MatIcon],

  templateUrl: './class-journal-page.html',
  styleUrl: './class-journal-page.scss',
})
export class ClassJournalPage implements OnInit {
  private readonly _journalService = inject(JournalService);
  private readonly _classService = inject(ClassService);

  private readonly _today = new Date().toISOString().slice(0, 10);

  protected readonly entries = signal<ClassJournal[]>([]);
  protected readonly view = signal<'day' | 'week'>('day');
  protected readonly moveMode = signal(false);
  protected readonly classId = signal<number | null>(null);
  protected readonly showForm = signal(false);
  protected readonly formDate = signal<string | null>(null);
  protected readonly formPeriod = signal<number | null>(null);

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
  protected readonly allDayDone = computed(() => {
    const items = [...this._byPeriod().values()];
    return items.length > 0 && items.every((e) => e.done);
  });

  ngOnInit(): void {
    this._classService.getAll().subscribe((c) => this.classId.set(c[0]?.id ?? null));
    this._load();
  }

  private _load(): void {
    this._journalService.getAll().subscribe((list) => this.entries.set(list));
  }

  protected openSlot(date: string, period: number): void {
    this.formDate.set(date);
    this.formPeriod.set(period);
    this.showForm.set(true);
  }

  protected openDaySlot(period: number): void {
    this.openSlot(this._today, period);
  }

  protected openEdit(entry: ClassJournal): void {
    this.openSlot(entry.date.slice(0, 10), entry.period!);
  }

  protected onCreated(): void {
    this._load();
  }

  protected dropDay(event: CdkDragDrop<unknown>, period: number): void {
    const dragged = event.item.data as ClassJournal;
    if (dragged.period === period) return;
    const target = this._byPeriod().get(period) ?? null;
    this._journalService.move(dragged.id, this._today, period).subscribe(() => {
      if (target && target.id !== dragged.id) {
        this._journalService
          .move(target.id, this._today, dragged.period!)
          .subscribe(() => this._load());
      } else {
        this._load();
      }
    });
  }

  protected toggleAllDay(): void {
    const items = [...this._byPeriod().values()];
    if (!items.length) return;
    const target = !this.allDayDone();
    forkJoin(items.map((e) => this._journalService.setDone(e.id, target))).subscribe(() =>
      this._load(),
    );
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
