import { Component, Input } from '@angular/core'
import { withUnit } from '../../../util/util'

const fileMap: Record<string, string> = {
  'text/csv': 'assets/imgs/icons/spreadsheet_icon.png',
  'application/pdf': 'assets/imgs/icons/pdf_icon.png',
  'application/zip': 'assets/imgs/icons/file_icon.png',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    'assets/imgs/icons/spreadsheet_icon.png',
}

@Component({
  selector: 'app-file-display',
  templateUrl: './file-display.component.html',
  styleUrls: ['./file-display.component.scss'],
})
export class FileDisplayComponent {
  @Input()
  file: File = new File([], 'unknown')

  public fileIcon(type: string) {
    return fileMap[type] || 'assets/imgs/icons/file_icon.png'
  }

  truncatePipe(str: string, firstLen = 5, lastLen = 5) {
    if (str.length > 3 + firstLen + lastLen) {
      const first = str.substr(0, firstLen)
      const last = str.substr(str.length - lastLen)
      return `${first}...${last}`
    }
    return str
  }

  bytesPipe(size: number) {
    return withUnit(size)
  }
}
