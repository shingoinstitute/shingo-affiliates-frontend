import { Component } from '@angular/core';
import { Facilitator } from "../../../facilitators/Facilitator";
import { FacilitatorService } from "../../../services/facilitator/facilitator.service";
import { MdSnackBar, MdDialog } from "@angular/material";
import { FacilitatorFormComponent } from "../../../facilitators/facilitators.module";

@Component({
  selector: 'app-admin-facilitator-tab',
  templateUrl: './admin-facilitator-tab.component.html',
  styleUrls: ['./admin-facilitator-tab.component.scss', '../admin-panel.component.scss']
})
export class AdminFacilitatorTabComponent {

  isLoading: boolean = true;

  displayedColumns = ["name"];

   newFacilitator: Facilitator;

   constructor(private _fs: FacilitatorService, private snackbar: MdSnackBar, private dialog: MdDialog) {}

   onClickSaveHandler(facilitator: Facilitator) {
     this.isLoading = true;
     this.snackbar.open('Saving Changes...');
     if (facilitator.sfId == '') {
       this.create(facilitator);
     } else {
       this.update(facilitator);
     }
   }

   resetPassword(fac: Facilitator) {
      this.isLoading = true;
      this.snackbar.open(`Sending password reset email to ${fac.email}...`);
      this._fs.resetPassword(fac.email).subscribe(data => {
         this.apiCallbackHandler(data);
         this.snackbar.open('Password reset email has been sent.', null, { duration: 2000 });
      }, err => { 
        this.apiCallbackHandler(null, err); 
      });
   }

   update(fac: Facilitator) {
      this._fs.update(fac).subscribe(data => {
         this.apiCallbackHandler(data);
         this.snackbar.open('Facilitator Successfully Updated', null, { duration: 2000 });
      }, err => { 
        this.apiCallbackHandler(null, err); 
      });
   }

   create(facilitator: Facilitator) {
     this._fs.create(facilitator).subscribe(data => {
       this.apiCallbackHandler(data);
       this.snackbar.open('Facilitator Succesfully Created', null, { duration: 2000 });
     }, err => {
       this.apiCallbackHandler(null, err);
     });
   }

   delete(fac: Facilitator) {
      this.isLoading = true;
      this.snackbar.open(`Deleting ${fac.name}'s Account...`);
      this._fs.delete(fac).subscribe(data => {
         this.apiCallbackHandler(data);
         this.snackbar.open('Facilitator Successfully Deleted.', null, { duration: 2000 });
      }, err => { 
        this.apiCallbackHandler(null, err); 
      });
   }

   disable(fac: Facilitator) {
      this.isLoading = true;
      this.snackbar.open(`Disabling ${fac.name}'s Account...`);
      this._fs.disable(fac).subscribe(data => {
         this.apiCallbackHandler(data);
         this.snackbar.open('Facilitator Successfully Disabled', 'Okay', { duration: 2000 });
      }, err => { 
        this.apiCallbackHandler(null, err); 
      });
   }

  onClickCreate() {
    let dialogRef = this.dialog.open(FacilitatorFormComponent, {
      data: {
        isDialog: true,
        facilitator: new Facilitator()
      }
    });

    dialogRef.afterClosed().subscribe(facilitator => {
      if (facilitator) {
        this.onClickSaveHandler(facilitator);
      }
    });
  }

   apiCallbackHandler(data?: any, err?: any) {
      this.isLoading = false;
      this._fs.reloadData$.emit();
      if (data) { console.log(data); }
      if (err) {
         this.snackbar.open('An error occured and the requested operation could not be completed.', 'Okay', { duration: 3000 });
         console.error(err);
      }
   }

}
