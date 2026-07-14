import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-onboarding-page',
  imports: [ReactiveFormsModule, MatIcon, RouterLink],
  templateUrl: './onboarding-page.html',
  styleUrl: './onboarding-page.scss',
})
export class OnboardingPage implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  private _token = '';

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly missingToken = signal(false);

  readonly form = this._fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', [Validators.required]],
    },
    { validators: this._matchPasswords },
  );

  ngOnInit(): void {
    this._token = this._route.snapshot.queryParamMap.get('token') ?? '';
    if (!this._token) this.missingToken.set(true);
  }

  private _matchPasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirm')?.value;
    return password && confirm && password !== confirm ? { mismatch: true } : null;
  }

  onSubmit(): void {
    if (this.form.invalid || !this._token) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.loading.set(true);
    const { password } = this.form.getRawValue();

    this._auth.acceptInvitation(this._token, password!).subscribe({
      next: () => this._router.navigate([this._auth.isParent() ? '/parent' : '/dashboard']),
      error: () => {
        this.loading.set(false);
        this.error.set('This invitation link is invalid or has expired.');
      },
    });
  }
}
