import { Component, OnInit, Input } from '@angular/core';
import { Video, SupportService } from "../../providers/support.service";
import { ActivatedRoute } from "@angular/router";

@Component({
   selector: 'app-support-training',
   templateUrl: './support-training.component.html',
   styleUrls: ['./support-training.component.scss'],
   providers: [SupportService]
})
export class SupportTrainingComponent implements OnInit {

   @Input('video') video: Video;
   nextVideo: Video;
   prevVideo: Video;

   private id: number; 

   constructor(private route: ActivatedRoute, private support: SupportService) { }

   ngOnInit() {
      this.route.params.subscribe(params => {
         this.id = +params['video'];
         if (this.id && this.id < 4 && this.id >= 0)
            this.video = this.support.videos[this.id];
         else
            this.video = this.support.videos[0];
         this.id = this.video.id;
         if (this.video.id != 3)
            this.nextVideo = this.support.videos[this.id + 1];
         if (this.video.id != 0)
            this.prevVideo = this.support.videos[this.id - 1];
      });
   }

}
