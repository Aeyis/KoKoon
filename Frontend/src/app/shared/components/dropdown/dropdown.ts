import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export interface DropdownOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  private readonly _host = inject(ElementRef);

  readonly options = input.required<DropdownOption[]>();
  readonly value = input<string | number | null>(null);
  readonly placeholder = input('Choose…');
  readonly disabled = input(false);
  readonly changed = output<string | number>();

  protected readonly open = signal(false);

  protected readonly selectedLabel = computed(() => {
    const opt = this.options().find((o) => o.value === this.value());
    return opt ? opt.label : this.placeholder();
  });

  protected readonly hasValue = computed(() =>
    this.options().some((o) => o.value === this.value()),
  );

  protected toggle(): void {
    if (this.disabled()) return;
    this.open.update((v) => !v);
  }

  protected select(v: string | number): void {
    this.changed.emit(v);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocClick(e: MouseEvent): void {
    if (this.open() && !this._host.nativeElement.contains(e.target)) {
      this.open.set(false);
    }
  }
}
