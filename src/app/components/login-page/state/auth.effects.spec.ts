import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { AuthService } from '../services/auth.service';
import { AuthActions } from './auth.actions';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

describe('Auth Effects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;
  let authService: jasmine.SpyObj<AuthService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'refreshToken',
      'getCurrentUser',
    ]);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'error',
      'success',
      'warning',
      'info',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    effects = TestBed.inject(AuthEffects);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationService = TestBed.inject(
      NotificationService,
    ) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('login$', () => {
    it('should return loginSuccess on successful login', (done) => {
      const loginRequest = { username: 'testuser', password: 'password123' };
      const mockResponse = {
        access: 'test-access-token',
        refresh: 'test-refresh-token',
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          fullName: 'Test User',
        },
      };

      authService.login.and.returnValue(of(mockResponse));

      actions$ = of(AuthActions.login({ request: loginRequest }));

      effects.login$.subscribe((action) => {
        expect(action.type).toBe(AuthActions.loginSuccess.type);
        if (action.type === AuthActions.loginSuccess.type) {
          expect(action.response).toEqual(mockResponse);
        }
        expect(authService.login).toHaveBeenCalledWith({
          username: loginRequest.username,
          password: loginRequest.password,
        });
        done();
      });
    });

    it('should return loginFailure on API error', (done) => {
      const loginRequest = { username: 'testuser', password: 'wrongpassword' };
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Invalid credentials' },
        status: 401,
        statusText: 'Unauthorized',
      });

      authService.login.and.returnValue(throwError(() => errorResponse));

      actions$ = of(AuthActions.login({ request: loginRequest }));

      effects.login$.subscribe((action) => {
        expect(action.type).toBe(AuthActions.loginFailure.type);
        if (action.type === AuthActions.loginFailure.type) {
          expect(action.error).toBeDefined();
        }
        done();
      });
    });

    it('should handle network errors', (done) => {
      const loginRequest = { username: 'testuser', password: 'password123' };
      const error = new Error('Network error');

      authService.login.and.returnValue(throwError(() => error));

      actions$ = of(AuthActions.login({ request: loginRequest }));

      effects.login$.subscribe((action) => {
        expect(action.type).toBe(AuthActions.loginFailure.type);
        done();
      });
    });

    it('should handle empty credentials', (done) => {
      const loginRequest = { username: '', password: '' };
      const mockResponse = {
        access: 'token',
        refresh: 'refresh',
        user: {
          id: '1',
          username: '',
          email: '',
          fullName: '',
        },
      };

      authService.login.and.returnValue(of(mockResponse));

      actions$ = of(AuthActions.login({ request: loginRequest }));

      effects.login$.subscribe((action) => {
        expect(action.type).toBe(AuthActions.loginSuccess.type);
        expect(authService.login).toHaveBeenCalledWith({
          username: loginRequest.username,
          password: loginRequest.password,
        });
        done();
      });
    });
  });

  describe('loginFailure$', () => {
    it('should show error notification for 401 status (invalid credentials)', (done) => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Invalid credentials' },
        status: 401,
        statusText: 'Unauthorized',
      });

      actions$ = of(AuthActions.loginFailure({ error: errorResponse }));

      effects.loginFailure$.subscribe(() => {
        expect(notificationService.error).toHaveBeenCalledWith('Invalid username or password.');
        done();
      });
    });

    it('should show error notification for 429 status (rate limiting)', (done) => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Too many requests' },
        status: 429,
        statusText: 'Too Many Requests',
      });

      actions$ = of(AuthActions.loginFailure({ error: errorResponse }));

      effects.loginFailure$.subscribe(() => {
        expect(notificationService.error).toHaveBeenCalledWith(
          'Too many login attempts. Please try again later.',
        );
        done();
      });
    });

    it('should show generic error message for other HTTP errors', (done) => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Server error' },
        status: 500,
        statusText: 'Internal Server Error',
      });

      actions$ = of(AuthActions.loginFailure({ error: errorResponse }));

      effects.loginFailure$.subscribe(() => {
        expect(notificationService.error).toHaveBeenCalled();
        const errorMessage = notificationService.error.calls.mostRecent().args[0];
        // Generic error shows the HTTP error response message
        expect(errorMessage).toBeTruthy();
        done();
      });
    });

    it('should handle error with custom message in response', (done) => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Custom error message' },
        status: 400,
        statusText: 'Bad Request',
      });

      actions$ = of(AuthActions.loginFailure({ error: errorResponse }));

      effects.loginFailure$.subscribe(() => {
        expect(notificationService.error).toHaveBeenCalled();
        done();
      });
    });

    it('should handle non-HTTP errors', (done) => {
      const error = new Error('Network timeout');

      actions$ = of(AuthActions.loginFailure({ error }));

      effects.loginFailure$.subscribe(() => {
        expect(notificationService.error).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('loginSuccess$', () => {
    it('should navigate to home on successful login', (done) => {
      const response = {
        access: 'test-access-token',
        refresh: 'test-refresh-token',
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          fullName: 'Test User',
        },
      };

      actions$ = of(AuthActions.loginSuccess({ response }));

      effects.loginSuccess$.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/shop']);
        done();
      });
    });
  });

  describe('logout$', () => {
    it('should navigate to login on logout', (done) => {
      actions$ = of(AuthActions.logout());

      effects.logout$.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });
  });
});
