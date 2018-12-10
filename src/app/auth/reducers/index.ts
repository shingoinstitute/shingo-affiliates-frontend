import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store'
import * as fromAuth from './auth.reducer'
import * as fromLoginPage from './login-page.reducer'
import { AuthApiActions } from '../actions'
import { property } from '../../util/functional'

export interface AuthState {
  status: fromAuth.State
  loginPage: fromLoginPage.State
}

// keys here must not conflict with global state
export interface State {
  auth: AuthState
}

export const reducers: ActionReducerMap<
  AuthState,
  AuthApiActions.AuthApiAction
> = {
  status: fromAuth.reducer,
  loginPage: fromLoginPage.reducer,
}

export const selectAuthState = createFeatureSelector<State, AuthState>('auth')

export const selectAuthStatusState = createSelector(
  selectAuthState,
  property('status'),
)
export const getLoggedIn = createSelector(
  selectAuthStatusState,
  property('isLoggedIn'),
)
export const selectLoginPageState = createSelector(
  selectAuthState,
  property('loginPage'),
)
export const getLoginPageError = createSelector(
  selectLoginPageState,
  property('error'),
)
export const getLoginPagePending = createSelector(
  selectLoginPageState,
  property('pending'),
)
