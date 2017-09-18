import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ForbiddenPageComponent } from './forbidden-page.component';

describe('ForbiddenPageComponent', () => {
  let component: ForbiddenPageComponent;
  let fixture: ComponentFixture<ForbiddenPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForbiddenPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForbiddenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(component).toBeDefined();
  });

  it('should have a 403 heading', () => {
    const el = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(el.textContent).toContain('403 - Forbidden');
  });

  it('should have a message that says "Insuffecient privileges!"', () => {
    const el = fixture.debugElement.query(By.css('b')).nativeElement;
    expect(el.textContent).toContain('Insuffecient privileges!');
  });

});
