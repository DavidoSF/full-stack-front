import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { selectUser } from '../login-page/state/auth.selectors';
import { AppState } from '../../store/app.state';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../login-page/models/user-profile.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  private store = inject(Store<AppState>);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  profileForm: FormGroup;
  preferencesForm: FormGroup;
  initialValues: any;

  user$!: Observable<UserProfile | null>;
  loading$ = signal(false);

  constructor() {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullName: [''],
    });

    this.preferencesForm = this.fb.group({
      newsletter: [true],
      defaultMinRating: [0],
    });

    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.loading$.set(true);

    this.http.get<any>(`${environment.apiUrl}/me/`).subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email,
          fullName: profile.fullName || '',
        });

        this.preferencesForm.patchValue({
          newsletter: profile.preferences?.newsletter ?? true,
          defaultMinRating: profile.preferences?.defaultMinRating ?? 0,
        });

        this.initialValues = {
          profile: this.profileForm.value,
          preferences: this.preferencesForm.value,
        };

        this.loading$.set(false);
      },
      error: () => {
        this.loading$.set(false);
        this.snackBar.open('Failed to load profile', 'Close', { duration: 3000 });
      },
    });
  }

  hasChanges(): boolean {
    if (!this.initialValues) return false;

    return (
      JSON.stringify(this.profileForm.value) !== JSON.stringify(this.initialValues.profile) ||
      JSON.stringify(this.preferencesForm.value) !== JSON.stringify(this.initialValues.preferences)
    );
  }

  onSave(): void {
    if (this.profileForm.valid && this.preferencesForm.valid) {
      this.loading$.set(true);

      const updates = {
        fullName: this.profileForm.value.fullName,
        preferences: this.preferencesForm.value,
      };

      this.http.patch<any>(`${environment.apiUrl}/me/`, updates).subscribe({
        next: () => {
          this.initialValues = {
            profile: this.profileForm.value,
            preferences: this.preferencesForm.value,
          };
          this.loading$.set(false);
          this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
        },
        error: () => {
          this.loading$.set(false);
          this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
        },
      });
    }
  }

  onCancel(): void {
    if (this.initialValues) {
      this.profileForm.patchValue(this.initialValues.profile);
      this.preferencesForm.patchValue(this.initialValues.preferences);
    }
  }
}
