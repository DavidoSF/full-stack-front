import { Action } from '@ngrx/store';
import { createReducer, on } from '@ngrx/store';
import { AuthState } from './auth.state';

const initialAuthState: AuthState = {};

export const authReducer = createReducer(initialAuthState);
