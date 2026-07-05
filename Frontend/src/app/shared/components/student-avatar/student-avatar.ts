import {Component, input} from '@angular/core';

@Component({
  selector: 'app-student-avatar',
  templateUrl: './student-avatar.html',
  styleUrl: './student-avatar.scss',
})
export class StudentAvatar {
  readonly firstName= input.required<string>();
  readonly lastName= input.required<string>();
  readonly sex= input<'MALE' | 'FEMALE' | null>(null);
}
