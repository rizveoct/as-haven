import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandownerTestimonialComponent } from './landowner-testimonial.component';

describe('LandownerTestimonialComponent', () => {
  let component: LandownerTestimonialComponent;
  let fixture: ComponentFixture<LandownerTestimonialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandownerTestimonialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandownerTestimonialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
