import { TestBed, inject } from '@angular/core/testing';

import { FacilitatorService } from './facilitator.service';
import { HttpServiceMock } from '../http/http-service-mock';
import { Facilitator } from '../../facilitators/facilitator.model';

describe('FacilitatorService', () => {

  let service: FacilitatorService;

  beforeEach(() => {
    service = new FacilitatorService(new HttpServiceMock([]));
  });

  it('should be created', () => {
    expect(service).not.toBeUndefined();
    expect(service.getAll).not.toBeUndefined();
    expect(service.getById).not.toBeUndefined();
    expect(service.create).not.toBeUndefined();
    expect(service.map).not.toBeUndefined();
    expect(service.update).not.toBeUndefined();
    expect(service.delete).not.toBeUndefined();
    expect(service.disable).not.toBeUndefined();
    expect(service.search).not.toBeUndefined();
    expect(service.describe).not.toBeUndefined();
    expect(service.resetPassword).not.toBeUndefined();
    expect(service.changePassword).not.toBeUndefined();
  });

  it('should call #getAll', () => {
    service.getAll()
      .subscribe(data => {
        expect(data).not.toBeUndefined();
      });
  });

  it('should call #getById', () => {
    service.getById('some id')
      .subscribe(data => {
        expect(data).not.toBeUndefined();
      });
  });
  
  it('should call #create', () => {
    const f = new Facilitator();
    service.create(f).subscribe(data => {
      expect(data).not.toBeUndefined();
    });
  });

  it('should call #map', () => {
    const f = new Facilitator();
    service.map(f).subscribe(data => {
      expect(data).not.toBeUndefined();
    });
  });

  it('should call #update', () => {
    const f = new Facilitator();
    service.update(f).subscribe(data => {
      expect(data).not.toBeUndefined();
    });
  });

  it('should call #delete', () => {
    const f = new Facilitator();
    service.delete(f).subscribe(data => {
      expect(data).not.toBeUndefined();
    });
  });

  it('should call #disable', () => {
    const f = new Facilitator();
    service.disable(f).subscribe(data => {
      expect(data).not.toBeUndefined();
    });
  });

  it('should call #search', () => {
    const q = 'some query';
    service.search(q).subscribe(data => {
      expect(data).not.toBeUndefined();
    });
  });

  it('should call #describe', () => {
    service = new FacilitatorService(new HttpServiceMock({ fields: [] }));
    service.describe().subscribe(data => {
      expect(data).not.toBeUndefined();
    });
  });

  it('should call #resetPassword', () => {
    const email = 'some email address';
    service.resetPassword(email).subscribe(data => {
      expect(data).not.toBeUndefined();
    });
  });

  it('should call #changePassword', () => {
    const token = 'some jwt token';
    const password = 'some password';
    service.changePassword(token, password).subscribe(data => {
      expect(data).not.toBeUndefined();
    });
  });


});
