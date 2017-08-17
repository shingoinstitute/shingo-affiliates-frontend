import { TestBed, inject } from '@angular/core/testing';

import { WorkshopService } from './workshop.service';

describe('WorkshopService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkshopService]
    });
  });

  it('should be created', inject([WorkshopService], (service: WorkshopService) => {
    expect(service).toBeTruthy();
  }));
});
