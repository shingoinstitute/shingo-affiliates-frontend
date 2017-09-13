import { TestBed, async } from '@angular/core/testing';

import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        MaterialModule,
        RouterModule
      ]
    }).compileComponents();
  }));

  describe('proof of concept test', () => {
    it('true is true', () => expect(true).toBe(true));
  });

});
