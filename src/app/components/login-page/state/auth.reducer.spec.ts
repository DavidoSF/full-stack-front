import { authReducer } from './auth.reducer';
import { AuthActions } from './auth.actions';
import { AuthState } from './auth.state';
import { ErrorResponseModel } from '../../../shared/models/error-response.model';

describe('Auth Reducer', () => {
  const initialState: AuthState = {};

  describe('loginSuccess', () => {
    it('should store tokens and user on successful login', () => {
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

      const action = AuthActions.loginSuccess({ response });
      const state = authReducer(initialState, action);

      expect(state.token).toBeDefined();
      expect(state.token?.access).toBe('test-access-token');
      expect(state.token?.refresh).toBe('test-refresh-token');
      expect(state.user).toBeDefined();
      expect(state.user?.username).toBe('testuser');
      expect(state.user?.email).toBe('test@example.com');
      expect(state.loading).toBe(false);
      expect(state.error).toBeUndefined();
    });

    it('should clear loading and error states on success', () => {
      const stateWithError: AuthState = {
        loading: true,
        error: { message: 'Previous error' } as ErrorResponseModel,
      };

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

      const action = AuthActions.loginSuccess({ response });
      const state = authReducer(stateWithError, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeUndefined();
      expect(state.token).toBeDefined();
    });
  });

  describe('loginFailure', () => {
    it('should store error on failed login', () => {
      const error: ErrorResponseModel = { message: 'Invalid credentials' };

      const action = AuthActions.loginFailure({ error });
      const state = authReducer(initialState, action);

      expect(state.error?.message).toBe('Invalid credentials');
      expect(state.loading).toBe(false);
      expect(state.token).toBeUndefined();
      expect(state.user).toBeUndefined();
    });

    it('should clear loading state on failure', () => {
      const stateWithLoading: AuthState = {
        loading: true,
      };

      const error: ErrorResponseModel = { message: 'Network error' };
      const action = AuthActions.loginFailure({ error });
      const state = authReducer(stateWithLoading, action);

      expect(state.loading).toBe(false);
      expect(state.error?.message).toBe('Network error');
    });

    it('should preserve existing data on failure', () => {
      const stateWithData: AuthState = {
        token: {
          access: 'old-token',
          refresh: 'old-refresh',
        },
        user: {
          id: '1',
          username: 'olduser',
          email: 'old@example.com',
          fullName: 'Old User',
        },
      };

      const error: ErrorResponseModel = { message: 'Session expired' };
      const action = AuthActions.loginFailure({ error });
      const state = authReducer(stateWithData, action);

      expect(state.error?.message).toBe('Session expired');
      expect(state.token).toBeDefined();
      expect(state.user).toBeDefined();
    });
  });

  describe('login', () => {
    it('should set loading state and clear error', () => {
      const stateWithError: AuthState = {
        error: { message: 'Previous error' } as ErrorResponseModel,
      };

      const action = AuthActions.login({ request: { username: 'test', password: 'test123' } });
      const state = authReducer(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeUndefined();
    });
  });

  describe('logout', () => {
    it('should clear tokens and user', () => {
      const stateWithAuth: AuthState = {
        token: {
          access: 'test-access-token',
          refresh: 'test-refresh-token',
        },
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          fullName: 'Test User',
        },
      };

      const action = AuthActions.logout();
      const state = authReducer(stateWithAuth, action);

      expect(state.token).toBeUndefined();
      expect(state.user).toBeUndefined();
    });
  });

  describe('loadAuthFromStorageSuccess', () => {
    it('should restore tokens and user from storage', () => {
      const response = {
        access: 'stored-access-token',
        refresh: 'stored-refresh-token',
        user: {
          id: '2',
          username: 'storeduser',
          email: 'stored@example.com',
          fullName: 'Stored User',
        },
      };

      const action = AuthActions.loadAuthFromStorageSuccess({ response });
      const state = authReducer(initialState, action);

      expect(state.token).toBeDefined();
      expect(state.token?.access).toBe('stored-access-token');
      expect(state.token?.refresh).toBe('stored-refresh-token');
      expect(state.user?.username).toBe('storeduser');
    });
  });
});
