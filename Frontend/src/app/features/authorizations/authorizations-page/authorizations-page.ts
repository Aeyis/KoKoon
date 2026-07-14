import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthorizationService } from '@core/services/authorization.service';
import { SchoolService } from '@core/services/school.service';
import { ClassService } from '@core/services/class.service';
import { Teacher, ClassTeacherLink } from '@core/models/teacher.interface';
import { School } from '@core/models/school.interface';
import { ClassRoom } from '@core/models/class.interface';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';

@Component({
  selector: 'app-authorizations-page',
  imports: [StudentAvatar],
  templateUrl: './authorizations-page.html',
  styleUrl: './authorizations-page.scss',
})
export class AuthorizationsPage implements OnInit {
  private readonly _authz = inject(AuthorizationService);
  private readonly _schoolService = inject(SchoolService);
  private readonly _classService = inject(ClassService);

  protected readonly teachers = signal<Teacher[]>([]);
  protected readonly schools = signal<School[]>([]);
  protected readonly classes = signal<ClassRoom[]>([]);
  protected readonly links = signal<ClassTeacherLink[]>([]);
  protected readonly expandedId = signal<number | null>(null);
  protected readonly busy = signal(false);

  ngOnInit(): void {
    this._authz.getTeachers().subscribe((t) => this.teachers.set(t));
    this._schoolService.getMine().subscribe((s) => this.schools.set(s));
    this._classService.getAll().subscribe((c) => this.classes.set(c));
    this._authz.getClassTeachers().subscribe((l) => this.links.set(l));
  }

  protected toggle(id: number): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  protected isInSchool(teacher: Teacher, schoolId: number): boolean {
    return teacher.schools?.some((s) => s.id === schoolId) ?? false;
  }

  protected classesOfSchool(schoolId: number): ClassRoom[] {
    return this.classes().filter((c) => c.school?.id === schoolId);
  }

  protected linkFor(teacherId: number, classId: number): ClassTeacherLink | null {
    return this.links().find((l) => l.teacher.id === teacherId && l.classe.id === classId) ?? null;
  }

  protected schoolCount(teacher: Teacher): number {
    const mine = new Set(this.schools().map((s) => s.id));
    return (teacher.schools ?? []).filter((s) => mine.has(s.id)).length;
  }

  protected toggleSchool(teacher: Teacher, schoolId: number): void {
    if (this.busy()) return;
    this.busy.set(true);
    const member = this.isInSchool(teacher, schoolId);
    const op = member
      ? this._authz.removeStaff(schoolId, teacher.id)
      : this._authz.addStaff(schoolId, teacher.id);
    op.subscribe({
      next: () =>
        this._authz.getTeachers().subscribe((t) => {
          this.teachers.set(t);
          this.busy.set(false);
        }),
      error: () => this.busy.set(false),
    });
  }

  protected toggleClass(teacherId: number, classId: number): void {
    if (this.busy()) return;
    this.busy.set(true);
    const link = this.linkFor(teacherId, classId);
    const op = link
      ? this._authz.removeClassTeacher(link.id)
      : this._authz.addClassTeacher(teacherId, classId);
    op.subscribe({
      next: () =>
        this._authz.getClassTeachers().subscribe((l) => {
          this.links.set(l);
          this.busy.set(false);
        }),
      error: () => this.busy.set(false),
    });
  }
}
