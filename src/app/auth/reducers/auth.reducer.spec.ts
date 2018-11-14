import { reducer } from './auth.reducer'
// tslint:disable-next-line:no-duplicate-imports
import * as fromAuth from './auth.reducer'
import { AuthApiActions, AuthActions } from '../actions'

describe('AuthReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any

      const result = reducer(undefined, action)

      /**
       * Snapshot tests are a quick way to validate
       * the state produced by a reducer since
       * its plain JavaScript object. These snapshots
       * are used to validate against the current state
       * if the functionality of the reducer ever changes.
       */
      expect(result).toMatchSnapshot()
    })
  })

  describe('LOGIN_SUCCESS', () => {
    it('should set logged in to be true in auth state', () => {
      const createAction = new AuthApiActions.LoginSuccess()

      const expectedResult = {
        isLoggedIn: true,
      }

      const result = reducer(fromAuth.initialState, createAction)

      expect(result).toMatchSnapshot()
    })
  })

  describe('LOGOUT', () => {
    it('should logout a user', () => {
      const initialState = {
        isLoggedIn: false,
      } as fromAuth.State
      const createAction = new AuthActions.Logout()

      const expectedResult = fromAuth.initialState

      const result = reducer(initialState, createAction)

      expect(result).toMatchSnapshot()
    })
  })
})
