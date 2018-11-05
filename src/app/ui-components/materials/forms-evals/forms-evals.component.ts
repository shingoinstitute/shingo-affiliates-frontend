import { Component } from '@angular/core'
import { Observable, of } from 'rxjs'
import {
  FileSystemNode,
  folderNode,
  fileNode,
} from '../../file-tree/file-tree.component'

@Component({
  selector: 'app-forms-evals',
  templateUrl: './forms-evals.component.html',
  styleUrls: ['./forms-evals.component.scss'],
})
export class FormsEvalsComponent {
  public folder = { Evaluation: false }
  TREE_DATA: Observable<FileSystemNode[]> = of([
    folderNode(
      'Instructor Evaluation',
      [
        fileNode(
          'Online',
          'https://usu.co1.qualtrics.com/jfe/form/SV_9G2dNDlLoJC8SUZ',
        ),
        fileNode(
          'English',
          'https://usu.box.com/s/hqg8su339i5cvuqnnov6z2xt0jyb7o8r',
        ),
        fileNode(
          'Español',
          'https://usu.box.com/s/y0mcnq3sw5lr7j6xun2g7jh998e88j3n',
        ),
      ],
      'https://usu.app.box.com/files/0/f/8549280365/Instructor_Evaluations',
    ),
    fileNode(
      'Attendance Form',
      'https://usu.box.com/s/9wj1sig0y1ivi23s05pfbdu66ozsjw82',
    ),
    fileNode(
      'Name Sign',
      'https://usu.box.com/s/99cio2jdoqk17hgo6cqm9q6v3j39d3mv',
    ),
  ])
}
