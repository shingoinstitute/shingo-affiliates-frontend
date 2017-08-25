import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { Workshop } from '../../../workshops/Workshop';
import { WorkshopService } from '../../../services/workshop/workshop.service';

import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile, Ng2FileDropFiles, Ng2FileDropRejections } from 'ng2-file-drop';
import { FillViewHeightDirective } from "../../../shared/directives/fill-height.directive";

@Component({
  selector: 'app-workshop-detail',
  templateUrl: './workshop-detail.component.html',
  styleUrls: ['./workshop-detail.component.scss'],
  providers: [FillViewHeightDirective]
})
export class WorkshopDetailComponent implements OnInit {

  @ViewChild('pageRoot') pageRoot: ElementRef;

  private workshop: Workshop;
  private attendeeFile: any;
  private evaluations: File[] = [];
  private errors: string[] = [];

  private uploadAttendeeProgress: number = 0;
  private uploadEvalutationsProgress: number = 0;


  private supportedFileTypes: string[] = ['text/csv', 'application/pdf', 'application/zip', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  private maximumFileSizeInBytes: number = 1000 * 1000 * 25;
  private fileIcon = {
    'text/csv': 'assets/imgs/icons/spreadsheet_icon.png',
    'application/pdf': 'assets/imgs/icons/pdf_icon.png',
    'application/zip': 'assets/imgs/icons/file_icon.png',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'assets/imgs/icons/spreadsheet_icon.png'
  }

  constructor(private route: ActivatedRoute, private _ws: WorkshopService, private fillHeight: FillViewHeightDirective) { }

  ngOnInit() {
    this.workshop = this.route.snapshot.data['workshop'];
    const attendeeIndex = this.workshop.files.findIndex(file => {
      return file.Name.match(/attendee_list/);
    });
    if (attendeeIndex !== -1) {
      const file = this.workshop.files[attendeeIndex];
      this.attendeeFile = { name: file.Name, type: file.ContentType, size: file.BodyLength } as File;
    };
    this.evaluations = this.workshop.files.filter(file => file.Name.match(/evaluation/))
      .map(file => { return { name: file.Name, type: file.ContentType, size: file.BodyLength } as File });
  }

  ngAfterViewInit() {
    // Stop making it ugly, Dustin, geez.
    let ele = $('app-workshop-detail');
    if (Array.isArray(ele)) {
      ele = ele.pop();
    }
    ele && this.fillHeight.fillHeightOnElement(ele);
  }

  uploadAttendeeList(file: Ng2FileDropAcceptedFile) {
    this.attendeeFile = file.file;
  }

  uploadEvaluations(files: Ng2FileDropFiles) {
    console.log('evaluations', files);
    this.errors = [];
    files.accepted.map(file => {
      if (this.evaluations.findIndex(f => f.name === file.file.name) === -1)
        this.evaluations.push(file.file);
    });
    for (const file of files.rejected) this.rejectedFile(file);
  }

  upload() {
    if (this.attendeeFile && this.attendeeFile.lastModifiedDate) {
      this.uploadAttendeeListFile();
    }

    if (this.evaluations.length) {
      this.uploadEvaluationsFiles();
    }
  }

  uploadAttendeeListFile() {
    this.uploadAttendeeProgress = 0;
    this._ws.uploadAttendeeFile(this.workshop.sfId, this.attendeeFile).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * event.loaded / event.total);
        this.uploadAttendeeProgress = percentDone;
      } else if (event instanceof HttpResponse) {
        this.uploadAttendeeProgress = 0;
      }
    });
  }

  uploadEvaluationsFiles() {
    const files = this.evaluations.filter(f => f.lastModifiedDate);
    this.uploadEvalutationsProgress = 0;
    this._ws.uploadEvaluations(this.workshop.sfId, files).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * event.loaded / event.total);
        this.uploadEvalutationsProgress = percentDone;
      } else if (event instanceof HttpResponse) {
        this.uploadEvalutationsProgress = 0;
      }
    })
  }

  rejectedFile(file) {
    console.log('rejectedFile', file);
    if (file.reason === Ng2FileDropRejections.FileType) {
      this.errors.push(`.${file.file.name.split('.')[1]} is not an accepted file type`);
    } else if (file.reason === Ng2FileDropRejections.FileSize) {
      this.errors.push(`Your file '${file.file.name}' exceeds the maximum size (${this.fileSize(file.file.size)} > 25 MB)`)
    }
  }

  private fileSize(size: number): string {
    const ratio = size / 1000;
    if (ratio > 1000) {
      return `${ratio / 1000} MB`;
    } else if (ratio > 1) {
      return `${ratio} KB`;
    } else {
      return `${ratio} Bytes`;
    }
  }

}
