import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core'
import { pipe } from '../../../util/functional'
import { truthy } from '../../../util/util'
import {
  mapEither,
  chainEither,
  left,
  Either,
  right,
} from '../../../util/Either'

export interface MultipleFailure {
  reason: 'multiple'
  file: File
  count: number
  multiple: number
}

export interface SizeFailure {
  reason: 'size'
  file: File
  maxSize: number
}

export interface TotalSizeFailure {
  reason: 'totalSize'
  file: File
  accumSize: number
  totalSize: number
}

export interface AcceptFailure {
  reason: 'accept'
  file: File
  accept: ReadonlyArray<string>
}

export type FileFailure =
  | SizeFailure
  | MultipleFailure
  | TotalSizeFailure
  | AcceptFailure

const stopEvent = ($event: Event) => {
  $event.preventDefault()
  $event.stopPropagation()
}

const testGlob = (accept: ReadonlyArray<string>) => (type: string) => {
  if (accept.includes('image/*')) {
    return /image\/.*/.test(type)
  } else if (accept.includes('video/*')) {
    return /video\/.*/.test(type)
  } else if (accept.includes('audio/*')) {
    return /audio\/.*/.test(type)
  }

  return false
}

const fileAcceptable = (accept: ReadonlyArray<string>) => (
  file: File,
): boolean => {
  const splitted = file.name.split('.')
  const extension = splitted.length > 0 && '.' + splitted[splitted.length - 1]

  return (
    accept.includes(file.type) ||
    (extension && accept.includes(extension)) ||
    testGlob(accept)(file.type)
  )
}

const validateFile = (accept: ReadonlyArray<string>, maxSize: number) => (
  file: File,
): Either<FileFailure, File> => {
  if (file.size > maxSize) {
    return left({ reason: 'size' as 'size', file, maxSize })
  }

  if (accept.length > 0 && !fileAcceptable(accept)(file)) {
    return left({ reason: 'accept' as 'accept', file, accept })
  }

  return right(file)
}

function getDataTransferFiles(dataTransfer: DataTransfer) {
  if (dataTransfer.items) {
    return Array.from(dataTransfer.items)
      .filter(v => v.kind === 'file')
      .map(v => v.getAsFile() as File)
  } else {
    return getFiles(dataTransfer.files)
  }
}

const getFiles = (fs: FileList) => Array.from(fs).filter(truthy)

const supportsFileUpload = () => 'FormData' in window && 'FileReader' in window
const supportsDnD = () => {
  const div = document.createElement('div')
  const supported =
    'draggable' in div || ('ondragstart' in div && 'ondrop' in div)
  document.removeChild(div)
  return supported
}

export const supportsDnDUpload = () => supportsFileUpload() && supportsDnD()

let inputId = 0

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
      }
      .upload {
        display: none;
      }
      .upload-label {
        cursor: pointer;
      }
    `,
  ],
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
  public fileover: EventEmitter<DragEvent> = new EventEmitter()
  @Output()
  public fileenter: EventEmitter<DragEvent> = new EventEmitter()
  @Output()
  public fileleave: EventEmitter<DragEvent> = new EventEmitter()
  @Output()
  public filedrop: EventEmitter<DragEvent> = new EventEmitter()
  // tslint:disable-next-line:no-output-rename
  @Output('file')
  public fileEmitter: EventEmitter<File> = new EventEmitter()
  @Output()
  public error: EventEmitter<FileFailure> = new EventEmitter()

  // angular does not mangle id in templates,
  // so we have to have some kind of mutating state to make them work
  public inputId = `app-file-drop/input-${inputId++}`

  private _supportsDragAndDropChecked = false
  private _supportsDragAndDrop = false

  public supportsDragAndDrop() {
    if (!this._supportsDragAndDropChecked) {
      this._supportsDragAndDrop = supportsDnDUpload()
      this._supportsDragAndDropChecked = true
    }

    return this._supportsDragAndDrop
  }

  @HostListener('dragenter', ['$event'])
  public onDragEnter($event: DragEvent) {
    stopEvent($event)
    this.fileenter.emit()
  }

  @HostListener('dragover', ['$event'])
  public onDragOver($event: DragEvent) {
    stopEvent($event)
    this.fileover.emit()
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave($event: DragEvent) {
    stopEvent($event)
    this.fileleave.emit()
  }

  @HostListener('drop', ['$event'])
  public onDrop($event: DragEvent) {
    stopEvent($event)
    this.filedrop.emit($event)
    if (!this.disabled && $event.dataTransfer) {
      this.handleFiles(getDataTransferFiles($event.dataTransfer))
    }
  }

  public onInputChange(
    $event: Event & {
      target: null | HTMLInputElement & { files?: FileList | null }
    },
  ) {
    stopEvent($event)
    if ($event.target && $event.target.files) {
      this.handleFiles(getFiles($event.target.files))
    }
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

    const fn = pipe(
      validateFile(this.accept, this.maxFileSize),
      chainEither(
        (file): Either<FileFailure, File> => {
          count++
          size += file.size

          if (count > multiple) {
            return left({
              reason: 'multiple' as 'multiple',
              file,
              multiple,
              count,
            })
          }

          if (size > this.maxTotalSize) {
            return left({
              reason: 'totalSize' as 'totalSize',
              file,
              accumSize: size,
              totalSize: this.maxTotalSize,
            })
          }

          return right(file)
        },
      ),
      mapEither(file => this.handleFile(file), err => this.handleError(err)),
    )

    files.map(fn)
  }
}
