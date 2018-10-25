import { Component, OnInit, Input } from '@angular/core'
import { Observable, of } from 'rxjs'
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material'
import { FlatTreeControl } from '@angular/cdk/tree'

export type FileSystemNode = FolderNode | FileNode

export type NodeAction =
  | { kind: 'href'; target: string }
  | {
      kind: 'callback'
      icon?: string
      target: (click: Event, f: FileNode) => void
    }

export interface FolderNode {
  kind: 'folder'
  name: string
  children: FileSystemNode[]
  action?: NodeAction
}

export interface FileNode {
  kind: 'file'
  name: string
  icon: 'link' | 'insert_drive_file'
  action?: NodeAction
}

const defAction = (action: NodeAction | string): NodeAction =>
  typeof action === 'string' ? { kind: 'href', target: action } : action

export const fileNode = (
  name: string,
  action?: NodeAction | string,
  icon: FileNode['icon'] = 'insert_drive_file',
): FileNode => ({
  kind: 'file',
  name,
  action: typeof action !== 'undefined' ? defAction(action) : undefined,
  icon,
})

export const isFile = <T extends FileSystemNode>(t: T): t is T & FileNode =>
  t.kind === 'file'

export const folderNode = (
  name: string,
  children: FileSystemNode[] = [],
  action?: NodeAction | string,
): FolderNode => ({
  kind: 'folder',
  name,
  children,
  action: typeof action !== 'undefined' ? defAction(action) : undefined,
})

export const isFolder = <T extends FileSystemNode>(t: T): t is T & FolderNode =>
  t.kind === 'folder'

const depth = Symbol('node depth')
type FlatFileSystemNode = FileSystemNode & {
  [depth]: number
}

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
})
export class FileTreeComponent implements OnInit {
  @Input()
  data: Observable<FileSystemNode[]> = of([])

  public treeControl!: FlatTreeControl<FlatFileSystemNode>
  public treeFlattener!: MatTreeFlattener<FileSystemNode, FlatFileSystemNode>
  public dataSource!: MatTreeFlatDataSource<FileSystemNode, FlatFileSystemNode>

  isFolder = (_: number, nodeData: FlatFileSystemNode) =>
    nodeData.kind === 'folder'
  transformer = (node: FileSystemNode, level: number): FlatFileSystemNode => {
    return { ...node, [depth]: level }
  }
  private getLevel = (node: FlatFileSystemNode) => node[depth]
  private isExpandable = (node: FlatFileSystemNode) => node.kind === 'folder'

  // only ever called when isExpandable is true, which limits to folder kind
  private getChildren = (node: FileSystemNode): Observable<FileSystemNode[]> =>
    of((node as FolderNode).children)

  mapDisplay = (node: FlatFileSystemNode) => ({
    ...node,
    depth: node[depth],
  })

  ngOnInit(): void {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    )
    this.treeControl = new FlatTreeControl<FlatFileSystemNode>(
      this.getLevel,
      this.isExpandable,
    )
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener,
    )
    this.data.subscribe(d => {
      this.dataSource.data = d
    })
  }
}
