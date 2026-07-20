import { computed, inject, Injectable, signal } from '@angular/core';
import { SchoolService } from '@core/services/school.service';
import { ClassService } from '@core/services/class.service';
import { School } from '@core/models/school.interface';
import { ClassRoom } from '@core/models/class.interface';

// Contexte partagé : l'école et la classe actuellement sélectionnées par le prof.
@Injectable({ providedIn: 'root' })
export class ContextService {
  private readonly _schoolService = inject(SchoolService);
  private readonly _classService = inject(ClassService);

  private readonly _schools = signal<School[]>([]);
  readonly schools = this._schools.asReadonly();

  private readonly _classes = signal<ClassRoom[]>([]);
  readonly classes = this._classes.asReadonly();

  private readonly _schoolId = signal<number | null>(this._read('schoolId'));
  readonly schoolId = this._schoolId.asReadonly();

  private readonly _classId = signal<number | null>(this._read('classId'));
  readonly classId = this._classId.asReadonly();

  readonly classesOfSchool = computed(() => {
    const sid = this._schoolId();
    return this._classes().filter((c) => sid == null || c.school?.id === sid);
  });

  readonly selectedSchool = computed(
    () => this._schools().find((s) => s.id === this._schoolId()) ?? null,
  );
  readonly selectedClass = computed(
    () => this._classes().find((c) => c.id === this._classId()) ?? null,
  );

  private _loaded = false;

  // Charge une seule fois (idempotent). Utiliser reload() après une mutation.
  load(): void {
    if (this._loaded) return;
    this._loaded = true;
    this.reload();
  }

  reload(): void {
    this._schoolService.getMine().subscribe((list) => {
      this._schools.set(list);
      if (this._schoolId() == null || !list.some((s) => s.id === this._schoolId())) {
        this.setSchool(list[0]?.id ?? null);
      }
    });
    this._classService.getAll().subscribe((list) => {
      this._classes.set(list);
      this._ensureClass();
    });
  }

  setSchool(id: number | null): void {
    this._schoolId.set(id);
    this._persist('schoolId', id);
    this._ensureClass();
  }

  setClass(id: number | null): void {
    this._classId.set(id);
    this._persist('classId', id);
  }

  private _ensureClass(): void {
    const list = this.classesOfSchool();
    if (this._classId() == null || !list.some((c) => c.id === this._classId())) {
      this.setClass(list[0]?.id ?? null);
    }
  }

  private _read(key: string): number | null {
    const v = localStorage.getItem(key);
    return v == null ? null : Number(v);
  }

  private _persist(key: string, id: number | null): void {
    if (id == null) localStorage.removeItem(key);
    else localStorage.setItem(key, String(id));
  }
}
