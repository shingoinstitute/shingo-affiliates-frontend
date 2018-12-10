import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpEventType, HttpResponse } from '@angular/common/http'

import { Workshop, WorkshopStatusType } from '~app/workshops/workshop.model'
import { WorkshopService } from '~app/services/workshop/workshop.service'

import { FileFailure } from '~app/shared/components/file-drop/file-drop.component'
import { withUnit } from '~app/util/util'
import { not } from '~app/util/functional'

const syntheticFile = Symbol()
interface SyntheticFile {
  [syntheticFile]: true
  name: string
  size: number
  type: string
}

const isSyntheticFile = (f: File | SyntheticFile): f is SyntheticFile =>
  !!(f as SyntheticFile)[syntheticFile]

@Component({
  selector: 'app-workshop-detail',
  templateUrl: './workshop-detail.component.html',
  styleUrls: ['./workshop-detail.component.scss'],
})
export class WorkshopDetailComponent implements OnInit {
  public workshop!: Workshop
  public attendeeFile: File | SyntheticFile | undefined
  public evaluations: Array<File | SyntheticFile> = []
  public attendeeModified = false
  public evaluationsModified = false
  public errors: Array<{ from: 'attendee' | 'eval'; data: string }> = []

  public uploadAttendeeProgress = 0
  public uploadEvaluationsProgress = 0

  public supportedFileTypes: string[] = [
    '.csv',
    '.pdf',
    '.zip',
    '.xlsx',
    'text/csv',
    'application/pdf',
    'application/zip',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]

  public maximumFileSizeInBytes: number = 1000 * 1000 * 25

  public get showFiles(): boolean {
    return (
      this.workshop.status !== 'Proposed' ||
      this.workshop.status !== ('Verified' as WorkshopStatusType)
    )
  }

  public get showAttendeeUpload(): boolean {
    return this.workshop.status === ('Action Pending' as WorkshopStatusType)
  }

  public get showEvalUpload(): boolean {
    return (
      this.showAttendeeUpload || this.workshop.status === 'Ready To Be Invoiced'
    )
  }

  constructor(public route: ActivatedRoute, public _ws: WorkshopService) {}

  public ngOnInit() {
    this.workshop = this.route.snapshot.data['workshop']
    const file = this.workshop.files.find(
      f => !!(f.Name || '').match(/attendee_list/),
    )
    if (file) {
      this.attendeeFile = {
        [syntheticFile]: true,
        name: file.Name,
        type: file.ContentType,
        size: file.BodyLength,
      } as SyntheticFile
    }
    this.evaluations = this.workshop.files
      .filter(f => f.Name.match(/evaluation/))
      .map(
        f =>
          ({
            [syntheticFile]: true,
            name: f.Name,
            type: f.ContentType,
            size: f.BodyLength,
          } as SyntheticFile),
      )
  }

  public addAttendeeList(file: File) {
    this.attendeeModified = true
    this.attendeeFile = file
    this.errors = this.errors.filter(e => e.from !== 'attendee')
  }

  public addEvaluation(file: File) {
    if (!this.evaluations.find(f => f.name === file.name)) {
      this.evaluationsModified = true
      this.evaluations.push(file)
    }
    this.errors = this.errors.filter(e => e.from !== 'eval')
  }

  public upload() {
    if (this.attendeeFile && this.attendeeModified) {
      this.uploadAttendeeListFile()
    }

    if (this.evaluations.length && this.evaluationsModified) {
      this.uploadEvaluationsFiles()
    }

    this.errors = []
  }

  public uploadAttendeeListFile() {
    if (!this.attendeeFile || isSyntheticFile(this.attendeeFile)) return
    this.uploadAttendeeProgress = 0
    this._ws
      .uploadAttendeeFile(this.workshop.sfId, this.attendeeFile)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round((event.loaded * 100) / event.total)
          this.uploadAttendeeProgress = percentDone
        } else {
          this.uploadAttendeeProgress = 0
          this.attendeeModified = false
        }
      })
  }

  public uploadEvaluationsFiles() {
    const files = this.evaluations.filter(not(isSyntheticFile))
    if (files.length === 0) return
    this.uploadEvaluationsProgress = 0
    this._ws.uploadEvaluations(this.workshop.sfId, files).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round((event.loaded * 100) / event.total)
        this.uploadEvaluationsProgress = percentDone
      } else {
        this.uploadEvaluationsProgress = 0
        this.evaluationsModified = false
      }
    })
  }

  public rejectedFile(err: FileFailure, from: 'attendee' | 'eval') {
    if (err.reason === 'accept') {
      this.errors.push({
        from,
        data: `.${
          err.file.name.split('.')[1]
        } is not an accepted file type (${err.accept.join(', ')})`,
      })
    } else if (err.reason === 'size') {
      this.errors.push({
        from,
        data: `File '${err.file.name}' exceeds the maximum size (${withUnit(
          err.file.size,
        )} > ${withUnit(err.maxSize)})`,
      })
    } else if (err.reason === 'multiple') {
      this.errors.push({
        from,
        data: `No more than ${err.multiple} file(s) allowed, ${
          err.count
        } provided`,
      })
    }
  }
}
