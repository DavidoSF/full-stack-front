import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import { User, UpdateUserRequest, OrderSummary } from './user.model';

export class UserActions {
  static loadUser = createAction('[User] Load User');
  static loadUserSuccess = createAction('[User] Load User Success', props<{ user: User }>());
  static loadUserFailure = createAction('[User] Load User Failure', props<{ error: string }>());

  static updateUser = createAction('[User] Update User', props<{ updates: UpdateUserRequest }>());
  static updateUserSuccess = createAction('[User] Update User Success', props<{ user: User }>());
  static updateUserFailure = createAction('[User] Update User Failure', props<{ error: string }>());

  static loadUserOrders = createAction('[User] Load User Orders');
  static loadUserOrdersSuccess = createAction(
    '[User] Load User Orders Success',
    props<{ orders: OrderSummary[] }>(),
  );
  static loadUserOrdersFailure = createAction(
    '[User] Load User Orders Failure',
    props<{ error: string }>(),
  );

  static clearUser = createAction('[User] Clear User');
}
