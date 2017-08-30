import { Injectable } from '@angular/core';
import { MdSidenav } from '@angular/material';

@Injectable()
export class SidenavService {

  public set sidenav(s: MdSidenav) { this._sidenav = s; }

  public get canToggle() { return this._canToggle; }
  public set canToggle(value: boolean) { this._canToggle = value; }

  private _sidenav: MdSidenav;
  private _canToggle: boolean = true;

  public toggleSidenav() {
    if (this.sidenav && this.canToggle)
      return this.sidenav.toggle();
  }

  public close() {
    if (this.sidenav && this.canToggle)
      return this.sidenav.close();
  }

  public open() {
    if (this.sidenav && this.canToggle)
      return this.sidenav.open();
  }

}