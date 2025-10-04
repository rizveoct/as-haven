import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingSocialComponent } from './floating-social.component';

describe('FloatingSocialComponent', () => {
  let component: FloatingSocialComponent;
  let fixture: ComponentFixture<FloatingSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingSocialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
