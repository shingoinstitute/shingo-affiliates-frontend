import { Component } from '@angular/core';

@Component({
  selector: 'app-workshop-materials',
  templateUrl: './workshop-materials.component.html',
  styleUrls: ['./workshop-materials.component.scss']
})
export class WorkshopMaterialsComponent {

  private folder = {
    'Discover': false,
    'Enable': false,
    'Improve': false,
    'Align': false,
    'Build': false
  };

}
