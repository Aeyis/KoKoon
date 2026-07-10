import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { Dropdown, DropdownOption } from '@shared/components/dropdown/dropdown';
import { EventService } from '@core/services/event.service';
import { EventCategory } from '@core/enums/event.enum';

@Component({
  selector: 'app-event-form',
  imports: [Dropdown],
  templateUrl: './event-form.html',
  styleUrl: './event-form.scss',
})
export class EventForm implements OnInit {
  private readonly _eventService = inject(EventService);

  readonly classId = input.required<number>();
  readonly date = input.required<string>();
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  protected readonly categories: DropdownOption[] = [
    { value: 'OUTING', label: 'Outing' },
    { value: 'MEETING', label: 'Meeting' },
    { value: 'SCHOOL', label: 'School' },
    { value: 'OTHER', label: 'Other' },
  ];

  protected readonly title = signal('');
  protected readonly dateVal = signal('');
  protected readonly category = signal<string>('OUTING');
  protected readonly allDay = signal(true);
  protected readonly startTime = signal('');
  protected readonly endTime = signal('');
  protected readonly location = signal('');
  protected readonly description = signal('');
  protected readonly saving = signal(false);

  protected readonly canSave = computed(() => this.title().trim() !== '' && this.dateVal() !== '');

  ngOnInit(): void {
    this.dateVal.set(this.date());
  }

  protected submit(): void {
    if (!this.canSave()) return;
    this.saving.set(true);
    const allDay = this.allDay();
    this._eventService
      .create({
        title: this.title().trim(),
        date: this.dateVal(),
        category: this.category() as EventCategory,
        allDay,
        startTime: allDay ? undefined : this.startTime() || undefined,
        endTime: allDay ? undefined : this.endTime() || undefined,
        location: this.location().trim() || undefined,
        description: this.description().trim() || undefined,
        classId: this.classId(),
      })
      .subscribe(() => {
        this.saving.set(false);
        this.saved.emit();
      });
  }
}
