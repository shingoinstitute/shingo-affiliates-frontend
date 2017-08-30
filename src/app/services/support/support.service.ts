import { Injectable } from '@angular/core';

import { IVideo } from './video.interface';

@Injectable()
export class SupportService {

  public readonly videos: IVideo[] = [
    {
      id: 0,
      title: 'Getting Started: Affiliate Portal Overview',
      description: 'This video provides a brief overview of the Shingo Affiliate Portal.',
      link: 'https://res.cloudinary.com/shingo/video/upload/v1480722163/Affiliates/AffiliatePortal/Overview.mp4',
      thumbnail: 'https://res.cloudinary.com/shingo/video/upload/so_0,w_200,q_70/v1480722163/Affiliates/AffiliatePortal/Overview.jpg'
    },
    {
      id: 1,
      title: 'Add/Edit/Cancel Workshop',
      description: 'A brief video detailing how to add, edit, and cancel workshops in the Shingo Affiliate Portal.',
      link: 'https://res.cloudinary.com/shingo/video/upload/v1480722163/Affiliates/AffiliatePortal/AddEdit.mp4',
      thumbnail: 'https://res.cloudinary.com/shingo/video/upload/so_0,w_200,q_70/v1480722163/Affiliates/AffiliatePortal/AddEdit.jpg'
    },
    {
      id: 2,
      title: 'Upload Attendee List/Evaluations',
      description: 'A brief video detailing how to upload attendee lists and hard copy evaluations for workshops in the Shingo Affiliate Portal.',
      link: 'https://res.cloudinary.com/shingo/video/upload/v1480722163/Affiliates/AffiliatePortal/Attendee_List.mp4',
      thumbnail: 'https://res.cloudinary.com/shingo/video/upload/so_0,w_200,q_70/v1480722163/Affiliates/AffiliatePortal/Attendee_List.jpg'
    },
    {
      id: 3,
      title: 'Change/Reset Password',
      description: 'A brief video detailing how to change or reset your password in the Shingo Affiliate Portal.',
      link: 'https://res.cloudinary.com/shingo/video/upload/v1480722163/Affiliates/AffiliatePortal/Password.mp4',
      thumbnail: 'https://res.cloudinary.com/shingo/video/upload/so_1,w_200,q_70/v1480722163/Affiliates/AffiliatePortal/Password.jpg'
    }
  ];

}