import { Injectable } from '@angular/core'
import { MatSidenav } from '@angular/material'
import { AuthService } from '../auth/auth.service'
import { Router, NavigationEnd } from '@angular/router'

@Injectable()
export class SidenavService {
  public _sidenav: MatSidenav | undefined
  public get sidenav() {
    return this._sidenav
  }

  public set sidenav(s: MatSidenav | undefined) {
    this._sidenav = s
    setTimeout(() => {
      if (!this._isMobile && this._sidenav) {
        this._sidenav.open()
      } else if (this._sidenav) {
        this._sidenav.close()
      }
    }, 0)
  }

  public _isMobile = false
  public get isMobile() {
    return this._isMobile
  }
  public set isMobile(mobile: boolean) {
    this._isMobile = mobile
    if (mobile && this.sidenav) {
      this.sidenav.close()
      this.sidenav.mode = 'over'
    } else if (this.isAuth && this.sidenav) {
      this.sidenav.open()
      this.sidenav.mode = 'side'
    }
  }

  public _isAuth = false
  public get isAuth() {
    return this._isAuth
  }
  public set isAuth(auth: boolean) {
    this._isAuth = auth
    if (this._sidenav && !this.isMobile) {
      this._sidenav.open()
    } else if (this._sidenav) {
      this._sidenav.close()
    }
  }

  public get opened(): boolean {
    return !this.isMobile
  }

  public get canToggle() {
    return this.sidenav && this.isMobile
  }

  constructor(public _as: AuthService, public router: Router) {
    this._as.authenticationChange$.subscribe((isAuth: boolean) => {
      this.isAuth = isAuth
    })

    this.router.events.subscribe(route => {
      if (route instanceof NavigationEnd) {
        const url = route.url
        if (url.match(/.*password.*/gi) || url === '/login') {
          // tslint:disable-next-line:no-unused-expression
          this.sidenav && this.sidenav.close()
        } else {
          this.open()
        }
      }
    })

    this._as.updateUserAuthStatus()
  }

  public onResize(windowWidth: number) {
    this.isMobile = windowWidth < 960 ? true : false
  }

  public toggleSidenav() {
    if (this.canToggle) {
      return this.sidenav && this.sidenav.toggle()
    }
  }

  // Allow sidenav to close when the viewport width is small (i.e., mobile device or a monitor for ants).
  public close() {
    if (this.sidenav && this.isMobile) {
      return this.sidenav.close()
    }
  }

  // Allow sidenav to open when the viewport width < 960px AND if the user is authenticated.
  // The sidenav should remain open if the user is authenticated and the viewport width is <= 960px.
  public open() {
    if (this.sidenav && this.isMobile) {
      return this.sidenav.open()
    }
  }
}
