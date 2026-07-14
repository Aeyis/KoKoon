import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { StudentService } from '@core/services/student.service';
import { AttendanceService } from '@core/services/attendance.service';
import { StudentDetail } from '@core/models/student.interface';
import { AttendanceStatus } from '@core/enums/attendance.enum';

@Component({
  selector: 'app-student-detail-page',
  imports: [RouterLink, FormsModule, MatIcon],
  templateUrl: './student-detail-page.html',
  styleUrl: './student-detail-page.scss',
})
export class StudentDetailPage implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _studentService = inject(StudentService);
  private readonly _attendanceService = inject(AttendanceService);

  private readonly _month = new Date().toISOString().slice(0, 7);
  private _id = 0;

  protected readonly student = signal<StudentDetail | null>(null);
  protected readonly monthPresent = signal(0);
  protected readonly monthAbsent = signal(0);

  // invite parent
  protected readonly showInvite = signal(false);
  protected readonly inviteEmail = signal('');
  protected readonly inviteFirst = signal('');
  protected readonly inviteLast = signal('');
  protected readonly inviting = signal(false);
  protected readonly inviteLink = signal<string | null>(null);
  protected readonly inviteMsg = signal<string | null>(null);
  protected readonly copied = signal(false);

  protected readonly monthTotal = computed(() => this.monthPresent() + this.monthAbsent());
  protected readonly monthRatio = computed(() => {
    const t = this.monthTotal();
    return t === 0 ? 0 : Math.round((this.monthPresent() / t) * 100);
  });

  ngOnInit(): void {
    this._id = Number(this._route.snapshot.paramMap.get('id'));
    this._studentService.getOne(this._id).subscribe((s) => this.student.set(s));
    this._attendanceService.getAll().subscribe((rows) => {
      let present = 0;
      let absent = 0;
      for (const a of rows) {
        if (a.student.id !== this._id || !a.date.startsWith(this._month)) continue;
        if (a.status === AttendanceStatus.PRESENT) present++;
        else if (a.status === AttendanceStatus.ABSENT) absent++;
      }
      this.monthPresent.set(present);
      this.monthAbsent.set(absent);
    });
  }

  protected sendInvite(): void {
    if (!this.inviteEmail().trim() || !this.inviteFirst().trim() || !this.inviteLast().trim()) return;
    if (this.inviting()) return;
    this.inviting.set(true);
    this.inviteLink.set(null);
    this.inviteMsg.set(null);
    this.copied.set(false);
    this._studentService
      .inviteGuardian(this._id, {
        email: this.inviteEmail().trim(),
        firstName: this.inviteFirst().trim(),
        lastName: this.inviteLast().trim(),
      })
      .subscribe({
        next: (res) => {
          this.inviting.set(false);
          this.showInvite.set(false);
          this.inviteEmail.set('');
          this.inviteFirst.set('');
          this.inviteLast.set('');
          this.inviteLink.set(res.invitationLink);
          this.inviteMsg.set(
            res.alreadyExisted
              ? 'This parent already had an account and is now linked.'
              : 'Invitation ready — share this link with the parent:',
          );
          this._studentService.getOne(this._id).subscribe((s) => this.student.set(s));
        },
        error: () => {
          this.inviting.set(false);
          this.inviteMsg.set('Could not send the invitation.');
        },
      });
  }

  protected copyLink(): void {
    const link = this.inviteLink();
    if (!link) return;
    navigator.clipboard?.writeText(link).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
