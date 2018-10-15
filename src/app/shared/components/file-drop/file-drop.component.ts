import { Component, Input, Output, EventEmitter } from '@angular/core'
import { compose } from '../../../util/functional'

// tslint:disable-next-line:interface-name
export interface FileFailure {
  reason: 'size' | 'accept' | 'multiple' | 'totalSize'
  file: File
}

const stopEvent = ($event: Event) => {
  $event.stopPropagation()
  $event.preventDefault()
}

const testGlob = (accept: string[]) => (type: string) => {
  if (accept.includes('image/*')) {
    return /image\/.*/.test(type)
  } else if (accept.includes('video/*')) {
    return /video\/.*/.test(type)
  } else if (accept.includes('audio/*')) {
    return /audio\/.*/.test(type)
  }

  return false
}

const fileAcceptable = (accept: string[]) => (file: File): boolean => {
  const splitted = file.name.split('.')
  const extension = splitted.length && '.' + splitted[splitted.length - 1]

  return (
    accept.includes(file.type) ||
    accept.includes(extension) ||
    testGlob(accept)(file.type)
  )
}

const validateFile = (accept: string[], maxSize: number) => (
  file: File,
): Either<FileFailure, File> => {
  if (file.size > maxSize) {
    return left({ reason: 'size' as 'size', file })
  }

  if (accept.length > 0 && !fileAcceptable(accept)(file)) {
    return left({ reason: 'accept' as 'accept', file })
  }

  return right(file)
}

function convertFileList(fl: FileList): File[] {
  const files = []

  for (let i = 0; i < fl.length; i++) {
    files.push(fl.item(i))
  }

  return files
}

const supportsFileUpload = () => 'FormData' in window && 'FileReader' in window
const supportsDnD = () => {
  const div = document.createElement('div')
  const supported =
    'draggable' in div || ('ondragstart' in div && 'ondrop' in div)
  return supported
}

export const supportsDnDUpload = () => supportsFileUpload() && supportsDnD()

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
})
export class FileDropComponent {
  /**
   * An array of strings matching the requirements for html file input accept attribute.
   *
   * Takes valid mime type strings, file extension strings (must start with a period character),
   * and the following: `audio/*, video/*, image/*`
   * @see https://html.spec.whatwg.org/multipage/input.html#attr-input-accept
   */
  @Input()
  public accept: string[] = []
  @Input()
  public multiple: boolean | number = false
  @Input()
  public maxTotalSize = Infinity
  @Input()
  public maxFileSize = Infinity
  @Input()
  public disabled = false

  @Output()
  public fileover: EventEmitter<void> = new EventEmitter()
  @Output()
  public fileenter: EventEmitter<void> = new EventEmitter()
  @Output()
  public fileleave: EventEmitter<void> = new EventEmitter()
  // tslint:disable-next-line:no-output-rename
  @Output('file')
  public fileEmitter: EventEmitter<File> = new EventEmitter()
  @Output()
  public error: EventEmitter<FileFailure> = new EventEmitter()
  private _supportsDragAndDropChecked = false
  private _supportsDragAndDrop = false

  public supportsDragAndDrop() {
    if (!this._supportsDragAndDropChecked) {
      this._supportsDragAndDrop = supportsDnDUpload()
      this._supportsDragAndDropChecked = true
    }

    return this._supportsDragAndDrop
  }

  public onDragEnter($event: DragEvent) {
    stopEvent($event)
    this.fileenter.emit()
  }

  public onDragOver($event: DragEvent) {
    stopEvent($event)
    this.fileover.emit()
  }

  public onDragLeave($event: DragEvent) {
    stopEvent($event)
    this.fileleave.emit()
  }

  public onDrop($event: DragEvent) {
    stopEvent($event)
    if (!this.disabled) {
      this.handleFiles(convertFileList($event.dataTransfer.files))
    }
  }

  public onInputChange($event: any) {
    stopEvent($event)
    this.handleFiles(convertFileList($event.target.files))
  }

  private handleFile(file: File) {
    this.fileEmitter.emit(file)
  }

  private handleError(error: FileFailure) {
    this.error.emit(error)
  }

  private handleFiles(files: File[]) {
    let count = 0
    let size = 0

    const multiple =
      typeof this.multiple === 'boolean'
        ? this.multiple
          ? Infinity
          : 1
        : this.multiple

    const fn = compose(
      mapEither(
        (file: File) => this.handleFile(file),
        (err: FileFailure) => this.handleError(err),
      ),
      chainEither(
        (file: File): Either<FileFailure, File> => {
          count++
          size += file.size

          if (count > multiple) {
            return left({ reason: 'multiple' as 'multiple', file })
          }

          if (size > this.maxTotalSize) {
            return left({ reason: 'totalSize' as 'totalSize', file })
          }

          return right(file)
        },
      ),
      validateFile(this.accept, this.maxFileSize),
    )

    files.map(fn)
  }
}
