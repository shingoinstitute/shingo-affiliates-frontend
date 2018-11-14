import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store'
import * as fromAuth from './auth.reducer'
import * as fromLoginPage from './login-page.reducer'
import { AuthApiActions } from '../actions'
import { getProperty } from '../../util/functional'

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
  getProperty('status'),
)
export const getLoggedIn = createSelector(
  selectAuthStatusState,
  getProperty('isLoggedIn'),
)
export const selectLoginPageState = createSelector(
  selectAuthState,
  getProperty('loginPage'),
)
export const getLoginPageError = createSelector(
  selectLoginPageState,
  getProperty('error'),
)
export const getLoginPagePending = createSelector(
  selectLoginPageState,
  getProperty('pending'),
)
