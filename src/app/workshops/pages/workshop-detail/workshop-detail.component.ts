import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpEventType } from '@angular/common/http'

import { WorkshopBase } from '~app/workshops/workshop.model'
// tslint:disable-next-line:no-duplicate-imports
import * as W from '~app/workshops/workshop.model'
import { WorkshopService } from '~app/workshops/services/workshop.service'

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
const attendeeFileRegex = /attendee_list/
const evaluationFileRegex = /evaluation/

@Component({
  selector: 'app-workshop-detail',
  templateUrl: './workshop-detail.component.html',
  styleUrls: ['./workshop-detail.component.scss'],
})
export class WorkshopDetailComponent implements OnInit {
  workshop!: WorkshopBase
  attendeeFile: File | SyntheticFile | undefined
  evaluations: Array<File | SyntheticFile> = []
  attendeeModified = false
  evaluationsModified = false
  errors: Array<{ from: 'attendee' | 'eval'; data: string }> = []

  uploadAttendeeProgress = 0
  uploadEvaluationsProgress = 0

  supportedFileTypes: string[] = [
    '.csv',
    '.pdf',
    '.zip',
    '.xlsx',
    'text/csv',
    'application/pdf',
    'application/zip',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]

  maximumFileSizeInBytes: number = 1000 * 1000 * 25

  get showFiles(): boolean {
    const status = W.status(this.workshop)
    return status !== 'Proposed' && status !== 'Verified'
  }

  get showAttendeeUpload(): boolean {
    return W.status(this.workshop) === 'Action Pending'
  }

  get showEvalUpload(): boolean {
    return (
      this.showAttendeeUpload ||
      W.status(this.workshop) === 'Ready To Be Invoiced'
    )
  }

  constructor(public route: ActivatedRoute, public _ws: WorkshopService) {}

  ngOnInit() {
    this.workshop = this.route.snapshot.data['workshop']
    const files = W.files(this.workshop)
    const aFile = files.find(f => attendeeFileRegex.test(f.Name || ''))
    if (aFile) {
      this.attendeeFile = {
        [syntheticFile]: true,
        // tslint:disable:no-non-null-assertion
        name: aFile.Name!,
        type: aFile.ContentType!,
        size: aFile.BodyLength!,
        // tslint:enable:no-non-null-assertion
      }
    }
    this.evaluations = files
      .filter(f => evaluationFileRegex.test(f.Name || ''))
      .map<SyntheticFile>(f => ({
        [syntheticFile]: true,
        // tslint:disable:no-non-null-assertion
        name: f.Name!,
        type: f.ContentType!,
        size: f.BodyLength!,
        // tslint:enable:no-non-null-assertion
      }))
  }

  addAttendeeList(file: File) {
    this.attendeeModified = true
    this.attendeeFile = file
    this.errors = this.errors.filter(e => e.from !== 'attendee')
  }

  addEvaluation(file: File) {
    if (!this.evaluations.find(f => f.name === file.name)) {
      this.evaluationsModified = true
      this.evaluations.push(file)
    }
    this.errors = this.errors.filter(e => e.from !== 'eval')
  }

  upload() {
    if (this.attendeeFile && this.attendeeModified) {
      this.uploadAttendeeListFile()
    }

    if (this.evaluations.length && this.evaluationsModified) {
      this.uploadEvaluationsFiles()
    }

    this.errors = []
  }

  uploadAttendeeListFile() {
    if (!this.attendeeFile || isSyntheticFile(this.attendeeFile)) return
    this.uploadAttendeeProgress = 0
    this._ws
      .uploadAttendeeFile(this.workshop.Id, this.attendeeFile, true)
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

  uploadEvaluationsFiles() {
    const files = this.evaluations.filter(not(isSyntheticFile))
    if (files.length === 0) return
    this.uploadEvaluationsProgress = 0
    this._ws
      .uploadEvaluations(this.workshop.Id, files, true)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round((event.loaded * 100) / event.total)
          this.uploadEvaluationsProgress = percentDone
        } else {
          this.uploadEvaluationsProgress = 0
          this.evaluationsModified = false
        }
      })
  }

  rejectedFile(err: FileFailure, from: 'attendee' | 'eval') {
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
