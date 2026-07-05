import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { StudentService } from '@core/services/student.service';
import { AttendanceService } from '@core/services/attendance.service';
import { StudentDetail } from '@core/models/student.interface';
import { AttendanceStatus } from '@core/enums/attendance.enum';

@Component({
  selector: 'app-student-detail-page',
  imports: [RouterLink, MatIcon],
  templateUrl: './student-detail-page.html',
  styleUrl: './student-detail-page.scss',
})
export class StudentDetailPage implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _studentService = inject(StudentService);
  private readonly _attendanceService = inject(AttendanceService);

  private readonly _month = new Date().toISOString().slice(0, 7);

  protected readonly student = signal<StudentDetail | null>(null);
  protected readonly monthPresent = signal(0);
  protected readonly monthAbsent = signal(0);

  protected readonly monthTotal = computed(() => this.monthPresent() + this.monthAbsent());
  protected readonly monthRatio = computed(() => {
    const t = this.monthTotal();
    return t === 0 ? 0 : Math.round((this.monthPresent() / t) * 100);
  });

  ngOnInit(): void {
    const id = Number(this._route.snapshot.paramMap.get('id'));
    this._studentService.getOne(id).subscribe((s) => this.student.set(s));
    this._attendanceService.getAll().subscribe((rows) => {
      let present = 0;
      let absent = 0;
      for (const a of rows) {
        if (a.student.id !== id || !a.date.startsWith(this._month)) continue;
        if (a.status === AttendanceStatus.PRESENT) present++;
        else if (a.status === AttendanceStatus.ABSENT) absent++;
      }
      this.monthPresent.set(present);
      this.monthAbsent.set(absent);
    });
  }
}
