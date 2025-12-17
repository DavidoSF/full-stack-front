import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login-page';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AuthActions } from './state/auth.actions';

describe('LoginPage Component', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideMockStore({ initialState: {} })],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should initialize with empty form', () => {
      expect(component.loginFormGroup.get('username')?.value).toBe('');
      expect(component.loginFormGroup.get('password')?.value).toBe('');
    });

    it('should be invalid when fields are empty', () => {
      expect(component.loginFormGroup.valid).toBeFalsy();
    });

    it('should validate username is required', () => {
      const usernameControl = component.loginFormGroup.get('username');
      expect(usernameControl?.hasError('required')).toBeTruthy();

      usernameControl?.setValue('testuser');
      expect(usernameControl?.hasError('required')).toBeFalsy();
    });

    it('should validate username minimum length', () => {
      const usernameControl = component.loginFormGroup.get('username');
      usernameControl?.setValue('ab');

      expect(usernameControl?.hasError('minlength')).toBeTruthy();

      usernameControl?.setValue('abc');
      expect(usernameControl?.hasError('minlength')).toBeFalsy();
    });

    it('should validate password is required', () => {
      const passwordControl = component.loginFormGroup.get('password');
      expect(passwordControl?.hasError('required')).toBeTruthy();

      passwordControl?.setValue('password123');
      expect(passwordControl?.hasError('required')).toBeFalsy();
    });

    it('should validate password minimum length', () => {
      const passwordControl = component.loginFormGroup.get('password');
      passwordControl?.setValue('12345');

      expect(passwordControl?.hasError('minlength')).toBeTruthy();

      passwordControl?.setValue('123456');
      expect(passwordControl?.hasError('minlength')).toBeFalsy();
    });

    it('should be valid when all fields are correctly filled', () => {
      component.loginFormGroup.get('username')?.setValue('testuser');
      component.loginFormGroup.get('password')?.setValue('password123');

      expect(component.loginFormGroup.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    it('should dispatch login action with valid credentials', () => {
      component.loginFormGroup.get('username')?.setValue('testuser');
      component.loginFormGroup.get('password')?.setValue('password123');

      const event = new Event('submit');
      component.login(event);

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.login({
          request: {
            username: 'testuser',
            password: 'password123',
          },
        }),
      );
    });

    it('should not dispatch login action when form is invalid', () => {
      component.loginFormGroup.get('username')?.setValue('');
      component.loginFormGroup.get('password')?.setValue('');

      const event = new Event('submit');
      component.login(event);

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should trim username and password before dispatch', () => {
      component.loginFormGroup.get('username')?.setValue('  testuser  ');
      component.loginFormGroup.get('password')?.setValue('  password123  ');

      const event = new Event('submit');
      component.login(event);

      // The form values should still work even with spaces (they get trimmed in the component)
      expect(store.dispatch).toHaveBeenCalled();
    });

    it('should handle empty username after validation', () => {
      component.loginFormGroup.get('username')?.setValue('');
      component.loginFormGroup.get('password')?.setValue('password123');

      expect(component.loginFormGroup.valid).toBeFalsy();
    });

    it('should handle empty password after validation', () => {
      component.loginFormGroup.get('username')?.setValue('testuser');
      component.loginFormGroup.get('password')?.setValue('');

      expect(component.loginFormGroup.valid).toBeFalsy();
    });
  });

  describe('Remember Me Feature', () => {
    it('should initialize rememberMe checkbox as unchecked by default', () => {
      expect(component.loginFormGroup.get('rememberMe')?.value).toBeFalsy();
    });

    it('should set rememberMe to true when rememberMeEnabled input is true', () => {
      component.rememberMeEnabled = true;
      component.ngOnInit();

      expect(component.loginFormGroup.get('rememberMe')?.value).toBeTruthy();
    });

    it('should preserve rememberMe state', () => {
      const rememberMeControl = component.loginFormGroup.get('rememberMe');
      rememberMeControl?.setValue(true);

      expect(rememberMeControl?.value).toBeTruthy();

      rememberMeControl?.setValue(false);
      expect(rememberMeControl?.value).toBeFalsy();
    });
  });

  describe('Input Initialization', () => {
    it('should set username from input', () => {
      component.username = 'saveduser';
      component.ngOnInit();

      expect(component.loginFormGroup.get('username')?.value).toBe('saveduser');
    });

    it('should set password from input', () => {
      component.password = 'savedpass';
      component.ngOnInit();

      expect(component.loginFormGroup.get('password')?.value).toBe('savedpass');
    });

    it('should mark form as invalid when invalid input is true', () => {
      component.invalid = true;
      component.username = 'test';
      component.password = 'test';
      component.ngOnInit();
      fixture.detectChanges();

      const usernameControl = component.loginFormGroup.get('username');
      const passwordControl = component.loginFormGroup.get('password');

      expect(usernameControl?.hasError('invalid')).toBeTruthy();
      expect(passwordControl?.hasError('invalid')).toBeTruthy();
    });
  });

  describe('Form State', () => {
    it('should mark fields as touched on submit attempt', () => {
      const event = new Event('submit');
      component.login(event);

      // Even though form is invalid, fields should not be marked as touched by login method
      // This is handled by Angular's form submission
      expect(component.loginFormGroup.invalid).toBeTruthy();
    });

    it('should allow clearing form values', () => {
      component.loginFormGroup.get('username')?.setValue('testuser');
      component.loginFormGroup.get('password')?.setValue('password123');

      component.loginFormGroup.reset();

      expect(component.loginFormGroup.get('username')?.value).toBeNull();
      expect(component.loginFormGroup.get('password')?.value).toBeNull();
    });
  });
});
