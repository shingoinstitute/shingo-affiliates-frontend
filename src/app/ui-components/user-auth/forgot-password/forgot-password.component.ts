import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Router } from '@angular/router';

import { SimpleMessageDialog } from '../../../ui-components/simple-message-dialog/simple-message-dialog.component';
import { FacilitatorService } from '../../../services/facilitator/facilitator.service';
import { FillViewHeightDirective } from '../../../shared/directives/fill-height.directive';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [FillViewHeightDirective]
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {

  @ViewChild('forgotRoot') private root: ElementRef;

  private email: string;
  private errMsg: string;
  private errBody: string;
  private isLoading = false;

  constructor(private _fs: FacilitatorService,
    private dialog: MdDialog,
    private router: Router,
    private fillHeight: FillViewHeightDirective) { }

  public ngOnInit() {
    this.email = '';
  }

  public ngAfterViewInit() {
    $(this.root.nativeElement).css('position', 'relative');
    this.fillHeight.fillHeightOnElement(this.root);
  }

  private onSubmit() {
    this.errBody = '';
    this.errMsg = '';
    this.isLoading = true;
    this._fs.resetPassword(this.email)
      .subscribe((data) => {
        this.isLoading = false;
        const dialogRef = this.dialog.open(SimpleMessageDialog, {
          data: `An email has been sent to ${this.email} with a link to reset your password!`
        });
        dialogRef.afterClosed().subscribe(() => this.router.navigateByUrl('/login'));
      }, err => {
        console.error('error', err);
        const msg = err.error && err.error.error ? err.error.error : '';
        if (msg === 'EMAIL_NOT_FOUND' || msg === 'USER_NOT_FOUND') {
          this.errMsg = 'Email not found.';
        } else if (err.status === 0) {
          this.errMsg = 'Connection Refused.';
          this.errBody = 'We may be experiencing server difficulties, please try again later.';
        } else {
          this.errMsg = `An unknown error occured. Please try again later.`;
          this.errBody = JSON.stringify(err, null, 3);
        }
      });
  }

}
