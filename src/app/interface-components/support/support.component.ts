import { Component } from '@angular/core';
import { Video, SupportService } from "../providers/support.service";

@Component({
   selector: 'app-support',
   templateUrl: './support.component.html',
   styleUrls: ['./support.component.scss'],
   providers: [SupportService]
})
export class SupportComponent {

   videos: Video[];

   constructor(private support: SupportService) { }

   ngOnInit() {
      this.videos = this.support.videos;
   }

}

