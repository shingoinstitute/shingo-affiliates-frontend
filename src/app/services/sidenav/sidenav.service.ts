import { Injectable } from '@angular/core';
import { MdSidenav } from '@angular/material';
import { AuthService } from '../auth/auth.service';
import { AppComponent } from '../../app.component';

@Injectable()
export class SidenavService {

  public _sidenav: MdSidenav;
  public get sidenav() { return this._sidenav; }
  public set sidenav(s: MdSidenav) { 
    this._sidenav = s; 
    if (!this.sidenav) return;
    if (this.isAuth && !this._isMobile) {
      this._sidenav.open();
    } else {
      this._sidenav.close();
    }
  }

  public _isMobile: boolean;
  public get isMobile() { return this._isMobile; }
  public set isMobile(mobile: boolean) {
    this._isMobile = mobile;
    if (!this.sidenav) return;
    if (mobile) {
      this.sidenav.close();
      this.sidenav.mode = 'over';
    } else if (this.isAuth) {
      this.sidenav.open();
      this.sidenav.mode = 'side';
    }
  }

  public _isAuth: boolean;
  public get isAuth() { return this._isAuth; }
  public set isAuth(i: boolean) {
    this._isAuth = i;
    if (this.sidenav) return;
    if (!i) {
      this._sidenav.close();
    }
  }

  public get canToggle() { return this.sidenav && this.isAuth && this.isMobile; }

  constructor(public _as: AuthService) {
    this._as.authenticationChange$.subscribe((isAuth: boolean) => {
      this._isAuth = isAuth;
    });
  }

  public onResize(windowWidth: number) {
    this.isMobile = windowWidth < 960 ? true : false;
  }

  public toggleSidenav() {
    if (this.canToggle) {
      return this.sidenav.toggle();
    }
  }

  // Allow sidenav to close when the viewport width is small (i.e., mobile device or a monitor for ants)
  public close() {
    if (this.sidenav && this.isMobile) {
      return this.sidenav.close();
    }
  }

  // Allow sidenav to open when the viewport width < 960px AND if the user is authenticated
  // The sidenav should remain open if the user is authenticated and the viewport width is <= 960px
  public open() {
    if (this.sidenav && this.isAuth && this.isMobile) {
      return this.sidenav.open();
    }
  }

}