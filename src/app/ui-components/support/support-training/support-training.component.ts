// Angular Modules
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// App Modules
import { SupportService } from '../../../services/support/support.service';
import { IVideo } from '../../../services/support/video.interface';

@Component({
  selector: 'app-support-training',
  templateUrl: './support-training.component.html',
  styleUrls: ['./support-training.component.scss']
})
export class SupportTrainingComponent implements OnInit {

  @Input() public video: IVideo;

  public nextVideo: IVideo;
  public prevVideo: IVideo;
  public id: number;

  constructor(public route: ActivatedRoute, public support: SupportService) { }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['video'];
      if (this.id && this.id < 4 && this.id >= 0)
        this.video = this.support.videos[this.id];
      else
        this.video = this.support.videos[0];

      this.id = this.video.id;
      if (this.video.id !== 3)
        this.nextVideo = this.support.videos[this.id + 1];
      if (this.video.id !== 0)
        this.prevVideo = this.support.videos[this.id - 1];
    });
  }

}
