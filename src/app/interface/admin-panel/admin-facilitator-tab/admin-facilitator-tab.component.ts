import { Component } from '@angular/core';
import { Facilitator } from "../../../facilitators/Facilitator";
import { FacilitatorService } from "../../../services/facilitator/facilitator.service";
import { MdSnackBar } from "@angular/material";

@Component({
   selector: 'app-admin-facilitator-tab',
   templateUrl: './admin-facilitator-tab.component.html',
   styleUrls: ['./admin-facilitator-tab.component.scss', '../admin-panel.component.scss']
})
export class AdminFacilitatorTabComponent {

   isLoading: boolean = true;

   displayedColumns = ["name"];

   constructor(private _fs: FacilitatorService, private snackbar: MdSnackBar) {

   }

   ngOnInit() {
   }

   resetPassword(fac: Facilitator) {
      this.isLoading = true;
      this._fs.resetPassword(fac).subscribe(data => {
         this.apiCallbackHandler(data);
      }, err => { this.apiCallbackHandler(null, err); })
   }

   save(fac: Facilitator) {
      this.isLoading = true;
      this._fs.update(fac).subscribe(data => {
         this.apiCallbackHandler(data);
         this.snackbar.open('Facilitator Update Successful', null, { duration: 1500 });
      }, err => { this.apiCallbackHandler(null, err); });
   }

   delete(fac: Facilitator) {
      this.isLoading = true;
      this._fs.delete(fac).subscribe(data => {
         this.apiCallbackHandler(data);
      }, err => { this.apiCallbackHandler(null, err); });
   }

   disable(fac: Facilitator) {
      this.isLoading = true;
      this._fs.disable(fac).subscribe(data => {
         this.apiCallbackHandler(data);
      }, err => { this.apiCallbackHandler(null, err); });
   }

   apiCallbackHandler(data?: any, err?: any) {
      this.isLoading = false;
      if (data)
         console.log(data);
      if (err) {
         this.snackbar.open('An error occured and the requested operation could not be completed.', 'Okay');
         console.error(err);
      }
   }

}
