import { Injectable } from '@angular/core';
import { MdSidenav } from "@angular/material";

@Injectable()
export class SidenavService {

   private _sidenav: MdSidenav;
   public set sidenav(s: MdSidenav) { this._sidenav = s; }

   private _canToggle: boolean = true;
   public get canToggle() { return this._canToggle; }
   public set canToggle(value: boolean) { 
      this._canToggle = value;
   }

   public toggleSidenav() {
      if (this.sidenav && this.canToggle)
         return this.sidenav.toggle();
   }

   public close() {
      console.log('closing');
      if (this.sidenav && this.canToggle)
         return this.close();
   }

   public open() {
      console.log('opening');
      if (this.sidenav && this.canToggle)
         return this.open();
   }

}