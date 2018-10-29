import { Component } from '@angular/core'
import { Observable, of } from 'rxjs'
import {
  FileSystemNode,
  folderNode,
  fileNode,
} from '../../file-tree/file-tree.component'

@Component({
  selector: 'app-marketing-materials',
  templateUrl: './marketing-materials.component.html',
  styleUrls: ['./marketing-materials.component.scss'],
})
export class MarketingMaterialsComponent {
  public folder = { Marketing: false }
  TREE_DATA: Observable<FileSystemNode[]> = of([
    folderNode(
      'Marketing Graphics',
      [
        fileNode(
          'Licensed Affiliate and Facilitator Logos',
          'https://usu.box.com/s/j0w1vq36i8g06jsh91dzyen3fl2khtvu',
        ),
        fileNode(
          'Shingo Event Marketing',
          'https://usu.box.com/s/w6f4y8mxqtm1porzxbugbdolh6d10w1s',
        ),
        fileNode(
          'Shingo Workshop Marketing',
          'https://usu.box.com/s/s539oi4s32r4f5fqustywn1mp848efl1',
        ),
      ],
      'https://usu.app.box.com/files/0/f/8549280365/Instructor_Evaluations',
    ),
    fileNode(
      'Executive Overview Slides and Script',
      'https://usu.box.com/s/o1eo1g3v3vgyf8v4w9ti3q4sgk9bq2er',
    ),
    fileNode(
      'Affiliate Marketing Guide',
      'https://usu.box.com/s/vxb8uf4ls07vxtjxg784gm3epc1wl3kj',
    ),
    fileNode(
      'Shingo Model Basics Booklet',
      'https://usu.box.com/s/9rw5th9xmwmhk6igsap93m3qxksz65jq',
    ),
    fileNode(
      'Shingo Prize Effects',
      'https://usu.box.com/s/ykr58oxd6sfh1dw4e368icplehoco9j2',
    ),
  ])
}
