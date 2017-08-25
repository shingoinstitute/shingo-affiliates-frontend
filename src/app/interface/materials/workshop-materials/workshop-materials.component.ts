import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workshop-materials',
  templateUrl: './workshop-materials.component.html',
  styleUrls: ['./workshop-materials.component.scss']
})
export class WorkshopMaterialsComponent implements OnInit {

  private folder = {
    'Discover': false,
    'Enable': false,
    'Improve': false,
    'Align': false,
    'Build': false
  };

  constructor() { }

  ngOnInit() {
  }

}
