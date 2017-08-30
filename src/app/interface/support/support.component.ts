import { Component, OnInit } from '@angular/core';
import { SupportService } from '../../services/support/support.service';
import { IVideo } from '../../services/support/video.interface';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  private videos: IVideo[];

  constructor(private support: SupportService) { }

  public ngOnInit() {
    this.videos = this.support.videos;
  }

}

