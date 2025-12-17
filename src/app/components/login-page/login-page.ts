import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { AuthActions } from './state/auth.actions';
import { LoginRequestModel } from './models/login-request.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
  ) {}

  /** Form group for login inputs */
  @Input()
  loginFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rememberMe: new FormControl(false),
  });

  @Input()
  rememberMeEnabled = false;

  @Input()
  username = '';

  @Input()
  password = '';

  @Input()
  invalid = false;

  ngOnInit(): void {
    if (this.rememberMeEnabled) {
      this.loginFormGroup.get('rememberMe')?.setValue(true);
    }

    this.loginFormGroup.get('username')?.setValue(this.username);
    this.loginFormGroup.get('password')?.setValue(this.password);

    if (this.invalid) {
      this.loginFormGroup.get('username')?.setErrors({ invalid: true });
      this.loginFormGroup.get('password')?.setErrors({ invalid: true });
      this.loginFormGroup.updateValueAndValidity();
      this.loginFormGroup.markAllAsTouched();
      this.cdr.detectChanges();
    }
  }

  /** Handles the login form submission */
  login($event: Event) {
    if (this.loginFormGroup.valid) {
      const username = this.loginFormGroup.get('username')?.value ?? '';
      const password = this.loginFormGroup.get('password')?.value ?? '';

      const loginRequest: LoginRequestModel = {
        username,
        password,
      };

      this.store.dispatch(AuthActions.login({ request: loginRequest }));
    }
    this.onClick.emit($event);
  }

  /** Testing */
  @Output()
  onClick = new EventEmitter<Event>();
}
