import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'app-simple-message-dialog',
  templateUrl: './simple-message-dialog.component.html',
})
// tslint:disable-next-line:component-class-suffix
export class SimpleMessageDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public message: string) {}
}
