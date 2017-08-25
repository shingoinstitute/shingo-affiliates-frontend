import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsDialogComponent } from './materials-dialog.component';

describe('MaterialsDialogComponent', () => {
  let component: MaterialsDialogComponent;
  let fixture: ComponentFixture<MaterialsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
