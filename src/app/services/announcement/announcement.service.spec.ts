import { TestBed, inject } from '@angular/core/testing';

import { AnnouncementService } from './announcement.service';

let service:   AnnouncementService;


describe('AnnouncementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnnouncementService]
    });

    

  });

  it('should be created', inject([AnnouncementService], (service: AnnouncementService) => {
    expect(service).toBeTruthy();
  }));
});
