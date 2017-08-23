import { Component, Inject, OnInit, Input } from '@angular/core';
import { Facilitator } from "../Facilitator";
import { MD_DIALOG_DATA, MdSnackBar } from "@angular/material";
import { FacilitatorService } from "../../services/facilitator/facilitator.service";

@Component({
  selector: 'app-facilitator-form',
  templateUrl: './facilitator-form.component.html',
  styleUrls: ['./facilitator-form.component.scss']
})
export class FacilitatorFormComponent implements OnInit {

  @Input('facilitator') facilitator: Facilitator;
  @Input('isDialog') isDialog: boolean;

  constructor(@Inject(MD_DIALOG_DATA) public data: any, private snackbar: MdSnackBar, private _fs: FacilitatorService) {
    
  }

  ngOnInit() {
    if (this.data) {
      this.isDialog = this.data.isDialog;
      this.facilitator = this.data.facilitator;
    }

    if (!this.facilitator) {
      this.facilitator = new Facilitator();
    }
  }

  onClickSave() {
    this.snackbar.open('Saving Changes...');
    if (this.facilitator.sfId == '') {
      this.create();
    } else {
      this.update();
    }
  }

  update() {
    this._fs.update(this.facilitator).subscribe(data => {
      console.log(data);
      this.snackbar.open('Update Successful', null, { duration: 2000 });
    }, err => {
      this.handleError(err);
    });
  }

  create() {
    this._fs.create(this.facilitator).subscribe(data => {
      console.log(data);
      this.snackbar.open('Successfully Created New Facilitator.', null, { duration: 2000 });
    }, err => {
      this.handleError(err);
    });
  }

  handleError(err: any){
    console.error(err);
    this.snackbar.open('An error occured and the requested operation could not be complete.', 'Okay');
  }

}
