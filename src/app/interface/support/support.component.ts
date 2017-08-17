import { Component } from '@angular/core';
import { Video, SupportService } from "../../services/support/support.service";

@Component({
    selector: 'app-support',
    templateUrl: './support.component.html',
    styleUrls: ['./support.component.scss']
})
export class SupportComponent {

    videos: Video[];

    constructor(private support: SupportService) { }

    ngOnInit() {
        this.videos = this.support.videos;
    }

}

