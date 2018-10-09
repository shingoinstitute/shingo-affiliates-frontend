import { Component, Input } from '@angular/core'

export type IconType =
  | 'edit'
  | 'delete'
  | 'disable'
  | 'cancel'
  | 'save'
  | 'reset'
  | 'refresh'
  | 'search'
  | 'accept'
  | 'deleteForever'
  | 'deleteAccount'
  | 'form'
  | 'loginAs'

@Component({
  selector: 'app-icon-legend',
  templateUrl: './icon-legend.component.html',
  styleUrls: ['./icon-legend.component.scss'],
})
export class IconLegendComponent {
  @Input()
  public displayedIcons: IconType[] = ['edit', 'delete', 'save']
}
