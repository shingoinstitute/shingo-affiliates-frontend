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
    folderNode('Cultural Enablers', [
      fileNode(
        'Behavioral Benchmarking Sheets',
        'https://usu.box.com/s/74kbai22pw8anzzrcdxkc59pj9ytig6r',
      ),
      fileNode(
        'Case Study',
        'https://usu.box.com/s/40vmyun0tsopmojdy9yhhz90fog94bvv',
      ),
      fileNode(
        'Completion Certificates',
        'https://usu.box.com/s/3m3jep49r7y0psznnv47fdt45ed0ljwv',
      ),
      fileNode(
        'Participant Guide Book',
        'https://usu.box.com/s/tuk593un3vtngsu68xtppzzdjv3ykxqk',
      ),
      fileNode(
        'Slide Presentations',
        'https://usu.box.com/s/b3i7zjtffvghu8bqzbtkb7ljc17hdj3h',
      ),
      fileNode(
        'Videos',
        'https://usu.box.com/s/tnlrn0lhtwqnaf7cvsrml5j0fq2vkq2d',
      ),
    ]),
    folderNode('Continuous Improvement', [
      fileNode(
        'Behavioral Benchmarking Sheets',
        'https://usu.box.com/s/uh7d5rr0qs4ixho6e6fjasm2eaj7k4uf',
      ),
      fileNode(
        'Case Study',
        'https://usu.box.com/s/squwroiu53c17xb95gu7dsdq8snu9zpg',
      ),
      fileNode(
        'Completion Certificate',
        'https://usu.box.com/s/nfxlgc50eebwiv2apxcf3yymqy7x9fvp',
      ),
      fileNode(
        'Participant Guide Book',
        'https://usu.box.com/s/yrcmgz0pgmpy26chor7hzuqw45hhvsyd',
      ),
      fileNode(
        'Slide Presentations',
        'https://usu.box.com/s/k5w7lhrhu1e473rcyha5s2j4fxft9n8a',
      ),
    ]),
    folderNode('Enterprise Alignment', [
      fileNode(
        'Behavioral Benchmarking Sheets',
        'https://usu.box.com/s/cr34nbq4iyvbsxsdauta8fesoecyfmei',
      ),
      fileNode(
        'Case Study',
        'https://usu.box.com/s/1si5zahhxi8bac6iwcbq4yx69tnez1ej',
      ),
      fileNode(
        'Completion Certificate',
        'https://usu.box.com/s/g8gbz7px9ybshbjtbs32ps4c5002is60',
      ),
      fileNode(
        'Participant Guide Book',
        'https://usu.box.com/s/19drmj2xugzoi7wwlyzwpjsba0rqumnr',
      ),
      fileNode(
        'Slide Presentations',
        'https://usu.box.com/s/ovvh1vepv4f1c4m54fbr1tmiqppiy827',
      ),
      fileNode(
        'Videos',
        'https://usu.box.com/s/hrbhsrhe3zmgc8cfed27sghsfcfmdscy',
      ),
    ]),
    folderNode('Build Excellence', [
      fileNode(
        'Behavioral Benchmarking Sheets',
        'https://usu.box.com/s/7ts33z6um6blsm9mj9v8tzv255ptez4p',
      ),
      fileNode(
        'Case Study',
        'https://usu.box.com/s/04x7bsvtwcmfs4dae9ajtjct8kscjmvq',
      ),
      fileNode(
        'Completion Certificate',
        'https://usu.box.com/s/z9m6ew0hvcs3rjies1clwv75kof6ka5r',
      ),
      fileNode(
        'Participant Guide Book',
        'https://usu.box.com/s/vcubl5n8frb8zyy4wp4drqg6vtf09nsl',
      ),
      fileNode(
        'Slide Presentations',
        'https://usu.box.com/s/userqtz2c5q8mt5x4p2ex6evhgnvws37',
      ),
      fileNode(
        'Videos',
        'https://usu.box.com/s/9gqriwt5yz174pt4043dmckbp1kcuv3k',
      ),
    ]),
    fileNode(
      'General Workshop Graphics',
      'https://usu.box.com/s/v6pm8c6e3tasm3di6izd9p7kstscvshp',
      'link',
    ),
  ])
}
