import { Component, ElementRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ContextService } from '@core/services/context.service';

@Component({
  selector: 'app-context-switcher',
  imports: [MatIcon],
  templateUrl: './context-switcher.html',
  styleUrl: './context-switcher.scss',
})
export class ContextSwitcher implements OnInit {
  protected readonly context = inject(ContextService);
  private readonly _host = inject(ElementRef);

  protected readonly openMenu = signal<'school' | 'class' | null>(null);

  ngOnInit(): void {
    this.context.load();
  }

  protected toggle(menu: 'school' | 'class'): void {
    this.openMenu.update((v) => (v === menu ? null : menu));
  }

  protected pickSchool(id: number): void {
    this.context.setSchool(id);
    this.openMenu.set(null);
  }

  protected pickClass(id: number): void {
    this.context.setClass(id);
    this.openMenu.set(null);
  }

  @HostListener('document:click', ['$event'])
  protected onDocClick(e: MouseEvent): void {
    if (this.openMenu() && !this._host.nativeElement.contains(e.target)) {
      this.openMenu.set(null);
    }
  }
}
