import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-simple-message-dialog',
  templateUrl: './simple-message-dialog.component.html',
  styleUrls: ['./simple-message-dialog.component.scss']
})
export class SimpleMessageDialog {

  constructor( @Inject(MD_DIALOG_DATA) private message: string) { }

}
