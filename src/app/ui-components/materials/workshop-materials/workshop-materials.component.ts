import { Component } from '@angular/core'
import { Observable, of } from 'rxjs'
import {
  FileSystemNode,
  folderNode,
  fileNode,
} from '../../file-tree/file-tree.component'

@Component({
  selector: 'app-workshop-materials',
  templateUrl: './workshop-materials.component.html',
  styleUrls: ['./workshop-materials.component.scss'],
})
export class WorkshopMaterialsComponent {
  TREE_DATA: Observable<FileSystemNode[]> = of([
    folderNode('Discover Excellence', [
      fileNode(
        'Completion Certificate',
        'https://usu.box.com/s/uii6z2w8wd4lbaqw81h6k3xv7k59zv7j',
      ),
      fileNode(
        'Host Site Set-Up & Agenda',
        'https://usu.box.com/s/i6qzri2jgkhjhofpztzlvyvrvektu86j',
      ),
      fileNode(
        'Case Studies',
        'https://usu.box.com/s/s875jegilk3du6k3yas4nju6k5fkgs5l',
      ),
      fileNode(
        'Participant Guide Book',
        'https://usu.box.com/s/1nbiwrlcpjesxz2a1kcdgw2bqlpkyuh0',
      ),
      fileNode(
        'Slide Presentations',
        'https://usu.box.com/s/qjhf6q1900cwa3ioj15rzzsca6lzz0t2',
      ),
      fileNode(
        'Videos',
        'https://usu.box.com/s/abzo82llmun6d6ndihr6m9xcx8wks0tk',
      ),
    ]),
    folderNode('Cultural Enablers', []),
    folderNode('Continuous Improvement', []),
    folderNode('Enterprise Alignment', []),
    folderNode('Build Excellence', []),
    fileNode(
      'General Workshop Graphics',
      'https://usu.box.com/s/v6pm8c6e3tasm3di6izd9p7kstscvshp',
      'link',
    ),
  ])
}
