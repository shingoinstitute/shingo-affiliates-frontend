import { Component, Input } from '@angular/core';

export type IconType = 'edit' | 'delete' | 'disable' | 'cancel' | 'save' | 'reset' | 'search' | 'accept' | 'deleteForever' | 'form';

@Component({
   selector: 'app-icon-legend',
   templateUrl: './icon-legend.component.html',
   styleUrls: ['./icon-legend.component.scss']
})
export class IconLegendComponent {
   @Input('displayedIcons') displayedIcons: IconType[] = ['edit', 'delete', 'save'];

   constructor() {}

   ngOnInit() {

   }
}