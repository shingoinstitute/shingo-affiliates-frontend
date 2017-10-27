import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsDialog } from './materials-dialog.component';

describe('MaterialsDialogComponent', () => {
  let component: MaterialsDialog;
  let fixture: ComponentFixture<MaterialsDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialsDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
