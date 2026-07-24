import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { Student } from '@core/models/student.interface';
import { Desk, SeatingPlan as SeatingPlanData } from '@core/models/seating.interface';
import { ClassService } from '@core/services/class.service';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';

@Component({
  selector: 'app-seating-plan',
  imports: [CdkDrag, CdkDropList, CdkDropListGroup, MatIcon, StudentAvatar],
  templateUrl: './seating-plan.html',
  styleUrl: './seating-plan.scss',
})
export class SeatingPlan implements OnInit {
  private readonly _classService = inject(ClassService);

  readonly classId = input.required<number>();
  readonly students = input.required<Student[]>();

  protected readonly plan = signal<SeatingPlanData>({ rows: 5, cols: 5, desks: [] });
  readonly editing = signal(false);
  protected readonly selectedStudentId = signal<number | null>(null);
  protected readonly selectedDeskId = signal<string | null>(null);

  protected readonly cells = computed(() => {
    const p = this.plan();
    const out: { row: number; col: number; key: string }[] = [];
    for (let r = 0; r < p.rows; r++) {
      for (let c = 0; c < p.cols; c++) out.push({ row: r, col: c, key: `${r}-${c}` });
    }
    return out;
  });

  protected readonly studentById = computed(() => {
    const map: Record<number, Student> = {};
    for (const s of this.students()) map[s.id] = s;
    return map;
  });

  protected readonly placedIds = computed(() => {
    const ids = new Set<number>();
    for (const d of this.plan().desks) {
      for (const s of d.seats) if (s !== null) ids.add(s);
    }
    return ids;
  });

  protected readonly unplaced = computed(() =>
    this.students().filter((s) => !this.placedIds().has(s.id)),
  );

  ngOnInit(): void {
    this._classService.getSeating(this.classId()).subscribe((p) => {
      if (p) this.plan.set(p);
    });
  }

  protected deskAt(row: number, col: number): Desk | undefined {
    return this.plan().desks.find((d) => d.row === row && d.col === col);
  }

  protected addRow(): void {
    this.plan.update((p) => ({ ...p, rows: p.rows + 1 }));
  }

  protected removeRow(): void {
    this.plan.update((p) => {
      if (p.rows <= 1) return p;
      const rows = p.rows - 1;
      return { ...p, rows, desks: p.desks.filter((d) => d.row < rows) };
    });
  }

  protected addCol(): void {
    this.plan.update((p) => ({ ...p, cols: p.cols + 1 }));
  }

  protected removeCol(): void {
    this.plan.update((p) => {
      if (p.cols <= 1) return p;
      const cols = p.cols - 1;
      return { ...p, cols, desks: p.desks.filter((d) => d.col < cols) };
    });
  }

  protected addDesk(): void {
    const p = this.plan();
    for (let r = 0; r < p.rows; r++) {
      for (let c = 0; c < p.cols; c++) {
        if (!p.desks.some((d) => d.row === r && d.col === c)) {
          const desk: Desk = { id: crypto.randomUUID(), row: r, col: c, orientation: 'H', seats: [null, null] };
          this.plan.update((cur) => ({ ...cur, desks: [...cur.desks, desk] }));
          return;
        }
      }
    }
  }

  protected removeDesk(id: string): void {
    this.plan.update((p) => ({ ...p, desks: p.desks.filter((d) => d.id !== id) }));
    this.selectedDeskId.set(null);
  }

  protected selectDesk(id: string): void {
    if (!this.editing()) return;
    this.selectedDeskId.update((cur) => (cur === id ? null : id));
  }

  protected rotate(id: string): void {
    this.plan.update((p) => ({
      ...p,
      desks: p.desks.map((d) => (d.id === id ? { ...d, orientation: d.orientation === 'H' ? 'V' : 'H' } : d)),
    }));
  }

  protected dropDesk(event: CdkDragDrop<unknown>, row: number, col: number): void {
    const dragged = event.item.data as Desk;
    if (dragged.row === row && dragged.col === col) return;
    this.plan.update((p) => {
      const target = p.desks.find((d) => d.row === row && d.col === col);
      const desks = p.desks.map((d) => {
        if (d.id === dragged.id) return { ...d, row, col };
        if (target && d.id === target.id) return { ...d, row: dragged.row, col: dragged.col };
        return d;
      });
      return { ...p, desks };
    });
  }

  protected pickStudent(id: number): void {
    this.selectedStudentId.update((cur) => (cur === id ? null : id));
  }

  protected onSeat(desk: Desk, index: number): void {
    if (!this.editing()) return;
    if (desk.seats[index] !== null) {
      this._setSeat(desk.id, index, null);
      return;
    }
    const sel = this.selectedStudentId();
    if (sel === null) return;
    this.plan.update((p) => {
      const desks = p.desks.map((d) => ({
        ...d,
        seats: d.seats.map((s) => (s === sel ? null : s)),
      }));
      const target = desks.find((d) => d.id === desk.id);
      if (target) target.seats[index] = sel;
      return { ...p, desks };
    });
    this.selectedStudentId.set(null);
  }

  private _setSeat(deskId: string, index: number, value: number | null): void {
    this.plan.update((p) => ({
      ...p,
      desks: p.desks.map((d) =>
        d.id === deskId ? { ...d, seats: d.seats.map((s, i) => (i === index ? value : s)) } : d,
      ),
    }));
  }

  save(): void {
    this._classService.setSeating(this.classId(), this.plan()).subscribe(() => {
      this.editing.set(false);
      this.selectedDeskId.set(null);
    });
  }
}
