import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { MatSnackBar } from '@angular/material'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import * as fromRoot from '~app/reducers'
import { TOKEN_KEY } from '~app/auth/services/auth.service'
import { AuthApiActions } from '~app/auth/actions'

const template = (error: Error) => `
Please fill out the following:

**To Reproduce**
Steps to reproduce the behavior:
EXAMPLE:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Additional context**
Add any other context about the problem here.

# For Developers, Don't Change

${error.name}: ${error.message}

**Stack Trace**
\`\`\`
${error.stack}
\`\`\`

**window.navigator**
\`\`\`json
${JSON.stringify(window.navigator, null, 2)}
\`\`\`
`

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private snackbar: MatSnackBar,
    private router: Router,
    private store: Store<fromRoot.State>,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        () => {},
        err => {
          console.error('HTTP Error', err)
          if (err instanceof HttpErrorResponse) {
            if (err.status === 403) {
              if (err.error === 'ACCESS_FORBIDDEN')
                this.router.navigateByUrl('/403')
              else {
                localStorage.removeItem(TOKEN_KEY)
                this.store.dispatch(new AuthApiActions.LoginRedirect())
              }
              return
            }
            if (err.status === 500) {
              const ref = this.snackbar.open(
                'An unknown server error occured',
                'Report Issue',
              )
              ref.onAction().subscribe(() => {
                const body = template(err.error)
                const url = `https://gitreports.com/issue/shingoinstitute/shingo-affiliates-frontend?details=${encodeURIComponent(
                  body,
                )}`
                window.location.href = url
              })
            }
          }
        },
      ),
    )
  }
}
