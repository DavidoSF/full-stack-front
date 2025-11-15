import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { AuthActions } from './state/auth.actions';
import { LoginRequestModel } from './models/login-request.model';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  constructor(private store: Store<AppState>) {}

  loginFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    if (this.loginFormGroup.valid) {
      const username = this.loginFormGroup.get('username')?.value ?? '';
      const password = this.loginFormGroup.get('password')?.value ?? '';

      const loginRequest: LoginRequestModel = {
        username,
        password,
      };

      this.store.dispatch(AuthActions.login({ request: loginRequest }));
    }
  }
}
