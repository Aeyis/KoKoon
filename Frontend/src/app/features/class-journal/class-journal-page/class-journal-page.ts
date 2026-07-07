import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { JournalService } from '@core/services/journal.service';
import { JournalCategory } from '@core/enums/journal.enum';
import { ClassJournal } from '@core/models/journal.interface';

@Component({
  selector: 'app-class-journal-page',
  imports: [],
  templateUrl: './class-journal-page.html',
  styleUrl: './class-journal-page.scss',
})
export class ClassJournalPage implements OnInit {
  private readonly _journalService = inject(JournalService);

  protected readonly JournalCategory = JournalCategory;
  protected readonly entries = signal<ClassJournal[]>([]);

  protected readonly days = computed(() => {
    const groups: Record<string, ClassJournal[]> = {};
    for (const e of this.entries()) {
      const day = e.date.slice(0, 10);
      (groups[day] ??= []).push(e);
    }
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({ date, items: groups[date] }));
  });

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
}
