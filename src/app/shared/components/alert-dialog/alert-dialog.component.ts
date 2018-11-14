import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material'
// import { SFObject } from '../../models/sf-object.abstract.model'

export interface AlertDialogData {
  sfObject?: any
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
})
export class AlertDialogComponent {
  public sfObj: any
  public message: string
  public title: string | null
  public destructive: boolean
  public confirm: string
  public cancel: string

  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertDialogData) {
    this.sfObj = data.sfObject
    this.title = data.title ? data.title : null
    this.message = data.message ? data.message : ''
    this.confirm = data.confirmText ? data.confirmText : 'Confirm'
    this.cancel = data.cancelText ? data.cancelText : 'Cancel'
    this.destructive =
      typeof data.destructive !== 'undefined' ? data.destructive : false
  }
}
