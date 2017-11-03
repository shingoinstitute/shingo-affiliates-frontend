import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { verify, instance, anyString } from 'ts-mockito';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';

import {
  MatAutocompleteModule
} from '@angular/material';

import { SfLookupComponent } from './sf-lookup.component';
import { Workshop } from '../../../workshops/workshop.model';
import { WorkshopService } from '../../../services/workshop/workshop.service';
import { MockWorkshopService, EXPECTED_WORKSHOPS } from '../../../services/workshop/workshop.service.mock';
import { Affiliate } from '../../../affiliates/affiliate.model';
import { AffiliateService } from '../../../services/affiliate/affiliate.service';
import { MockAffiliateService, EXPECTED_AFFILIATES, EXPECTED_COURSE_MANAGERS } from '../../../services/affiliate/affiliate.service.mock';
import { Facilitator } from '../../../facilitators/facilitator.model';
import { FacilitatorService } from '../../../services/facilitator/facilitator.service';
import { MockFacilitatorService, EXPECTED_FACILITATORS } from '../../../services/facilitator/facilitator.service.mock';
import { CourseManager } from '../../../workshops/course-manager.model';

describe('SfLookupComponent', () => {
  let component: SfLookupComponent;
  let fixture: ComponentFixture<SfLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatAutocompleteModule
      ],
      declarations: [SfLookupComponent],
      providers: [
        { provide: WorkshopService, useFactory: () => instance(MockWorkshopService) },
        { provide: AffiliateService, useFactory: () => instance(MockAffiliateService) },
        { provide: FacilitatorService, useFactory: () => instance(MockFacilitatorService) },
        FormBuilder
      ]
    })
      .compileComponents();

    }));
    
  beforeEach(() => {
    fixture = TestBed.createComponent(SfLookupComponent);
    component = fixture.componentInstance;

    it('should exist', () => {
      expect(component).not.toBeUndefined();
    });
  
    describe('handleQuery', () => {
  
      it('should throw when handleQuery is called without an initialized sfObject', () => {
        expect(() => component.handleQuery('some query')).toThrow();
      });
  
      it('should call AffiliateService.search() when handleQuery is called if typeof sfObject === "Affiliate"', () => {
        component.sfObject = new Affiliate();
        fixture.detectChanges();
        component.handleQuery('some query');
        expect(component.objects).toEqual(EXPECTED_AFFILIATES);
      });
  
      it('should call FacilitatorService.search() when handleQuery is called if typeof sfObject === "Facilitator"', () => {
        component.sfObject = new Facilitator();
        fixture.detectChanges();
        component.handleQuery('some query');
        expect(component.objects).toEqual(EXPECTED_FACILITATORS);
      });
  
      it('should call WorkshopService.search() when handleQuery is called if typeof sfObject === "Workshop"', () => {
        component.sfObject = new Workshop();
        fixture.detectChanges();
        component.handleQuery('some query');
        expect(component.objects).toEqual(EXPECTED_WORKSHOPS);
      });
  
      it('should call CourseManagerService.search() when handleQuery is called if typeof sfObject === "CourseManager"', () => {
        component.sfObject = new CourseManager();
        fixture.detectChanges();
        component.handleQuery('some query');
        expect(component.objects).toEqual(EXPECTED_COURSE_MANAGERS);
      });
  
    });
  });


});
