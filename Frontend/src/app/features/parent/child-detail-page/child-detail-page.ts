import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';
import { MeService } from '@core/services/me.service';
import { Student } from '@core/models/student.interface';
import { Attendance } from '@core/models/attendance.interface';
import { AttendanceStatus } from '@core/enums/attendance.enum';

@Component({
  selector: 'app-child-detail-page',
  imports: [RouterLink, MatIcon, StudentAvatar],
  templateUrl: './child-detail-page.html',
  styleUrl: './child-detail-page.scss',
})
export class ChildDetailPage implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _meService = inject(MeService);

  protected readonly AttendanceStatus = AttendanceStatus;
  protected readonly child = signal<Student | null>(null);
  protected readonly attendance = signal<Attendance[]>([]);

  protected readonly presentCount = computed(
    () => this.attendance().filter((a) => a.status === AttendanceStatus.PRESENT).length,
  );
  protected readonly absentCount = computed(
    () => this.attendance().filter((a) => a.status === AttendanceStatus.ABSENT).length,
  );

  ngOnInit(): void {
    const id = Number(this._route.snapshot.paramMap.get('id'));
    this._meService
      .getChildren()
      .subscribe((list) => this.child.set(list.find((c) => c.id === id) ?? null));
    this._meService.getChildAttendance(id).subscribe((list) => this.attendance.set(list));
  }

  protected statusLabel(s: AttendanceStatus): string {
    return s.charAt(0) + s.slice(1).toLowerCase();
  }

  protected dayLabel(iso: string): string {
    const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }

  protected sessionLabel(s: string): string {
    return s === 'MORNING' ? 'Morning' : 'Afternoon';
  }
}
