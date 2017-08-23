import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMessageDialogComponent } from './simple-message-dialog.component';

describe('SimpleMessageDialogComponent', () => {
  let component: SimpleMessageDialogComponent;
  let fixture: ComponentFixture<SimpleMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleMessageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
