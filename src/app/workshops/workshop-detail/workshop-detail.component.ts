import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { Workshop, WorkshopStatusType } from '../../workshops/workshop.model';
import { WorkshopService } from '../../services/workshop/workshop.service';

import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile, Ng2FileDropFiles, Ng2FileDropRejections } from 'ng2-file-drop';

@Component({
  selector: 'app-workshop-detail',
  templateUrl: './workshop-detail.component.html',
  styleUrls: ['./workshop-detail.component.scss']
})
export class WorkshopDetailComponent implements OnInit {

  public workshop: Workshop;
  public attendeeFile: any;
  public evaluations: File[] = [];
  public errors: string[] = [];

  public uploadAttendeeProgress: number = 0;
  public uploadEvaluationsProgress: number = 0;


  public supportedFileTypes: string[] = ['text/csv', 'application/zip', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  public maximumFileSizeInBytes: number = 1000 * 1000 * 25;
  public fileIcon = {
    'text/csv': 'assets/imgs/icons/spreadsheet_icon.png',
    'application/pdf': 'assets/imgs/icons/pdf_icon.png',
    'application/zip': 'assets/imgs/icons/file_icon.png',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'assets/imgs/icons/spreadsheet_icon.png'
  };

  public get showFiles(): boolean {
    return this.workshop.status !== 'Proposed' || this.workshop.status !== ('Verified' as WorkshopStatusType);
  }

  public get showAttendeeUpload(): boolean {
    return this.workshop.status === ('Action Pending' as WorkshopStatusType);
  }

  public get showEvalUpload(): boolean {
    return this.showAttendeeUpload || this.workshop.status === 'Ready To Be Invoiced';
  }

  constructor(public route: ActivatedRoute, public _ws: WorkshopService) { }

  public ngOnInit() {
    this.workshop = this.route.snapshot.data['workshop'];
    const attendeeIndex = this.workshop.files.findIndex(file => {
      return file.Name.match(/attendee_list/);
    });
    if (attendeeIndex !== -1) {
      const file = this.workshop.files[attendeeIndex];
      this.attendeeFile = { name: file.Name, type: file.ContentType, size: file.BodyLength } as File;
    }
    this.evaluations = this.workshop.files.filter(file => file.Name.match(/evaluation/))
      .map(file => {
        file = {
          name: file.Name,
          type: file.ContentType,
          size: file.BodyLength
        };
        return file;
      });
  }

  public uploadAttendeeList(file: Ng2FileDropAcceptedFile) {
    this.attendeeFile = file.file;
  }

  public uploadEvaluations(files: Ng2FileDropFiles) {
    this.errors = [];
    files.accepted.map(file => {
      if (this.evaluations.findIndex(f => f.name === file.file.name) === -1)
        this.evaluations.push(file.file);
    });
    for (const file of files.rejected) this.rejectedFile(file);
  }

  public upload() {
    if (this.attendeeFile && this.attendeeFile.lastModifiedDate)
      this.uploadAttendeeListFile();

    if (this.evaluations.length)
      this.uploadEvaluationsFiles();
  }

  public uploadAttendeeListFile() {
    this.uploadAttendeeProgress = 0;
    this._ws.uploadAttendeeFile(this.workshop.sfId, this.attendeeFile).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * event.loaded / event.total);
        this.uploadAttendeeProgress = percentDone;
      } else if (event instanceof HttpResponse) {
        this.uploadAttendeeProgress = 0;
      } else {
        this.uploadAttendeeProgress = 0;
      }
    });
  }

  public uploadEvaluationsFiles() {
    const files = this.evaluations.filter(f => f.lastModifiedDate);
    this.uploadEvaluationsProgress = 0;
    this._ws.uploadEvaluations(this.workshop.sfId, files).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * event.loaded / event.total);
        this.uploadEvaluationsProgress = percentDone;
      } else if (event instanceof HttpResponse) {
        this.uploadEvaluationsProgress = 0;
      } else {
        this.uploadAttendeeProgress = 0;
      }
    });
  }

  public rejectedFile(file) {
    if (file.reason === Ng2FileDropRejections.FileType)
      this.errors.push(`.${file.file.name.split('.')[1]} is not an accepted file type`);
    else if (file.reason === Ng2FileDropRejections.FileSize)
      this.errors.push(`Your file '${file.file.name}' exceeds the maximum size (${this.fileSize(file.file.size)} > 25 MB)`);
  }

  public fileSize(size: number): string {
    const ratio = size / 1000;
    if (ratio > 1000)
      return `${ratio / 1000} MB`;
    else if (ratio > 1)
      return `${ratio} KB`;
    else
      return `${ratio} Bytes`;
  }

}
