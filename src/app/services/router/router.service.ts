import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

@Injectable()
export class RouterService {
  public routeStack: string[] = []
  public defaultRoute = '/dashboard'

  constructor(public router: Router) {}

  public nextRoute() {
    if (this.routeStack.length > 0) {
      this.router.navigateByUrl(this.routeStack.shift())
    } else {
      this.router.navigateByUrl(this.defaultRoute)
    }
  }

  public navigateRoutes(routes: string[]) {
    this.routeStack = Array.from(new Set(routes))
    if (this.routeStack.length > 0) {
      this.router.navigateByUrl(this.routeStack.shift())
    }
  }
}
