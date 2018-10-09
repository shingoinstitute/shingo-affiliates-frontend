import { throwError as observableThrowError } from 'rxjs'
import { parseErrResponse } from '../../util/util'

export abstract class BaseService {
  protected _baseUrl = 'http://localhost'

  /**
   * @description Handles errors from http requests
   */
  public handleError(error: Response | any) {
    if (error.error && typeof error.error === 'string') {
      try {
        error.error = parseErrResponse(error)
        if (error.error === '') {
          error.error = error.message
        }
      } catch (e) {
        console.warn(e)
      }
    }
    return observableThrowError(error)
  }
}
