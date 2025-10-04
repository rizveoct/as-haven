import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsIndexComponent } from './testimonials-index.component';

describe('TestimonialsIndexComponent', () => {
  let component: TestimonialsIndexComponent;
  let fixture: ComponentFixture<TestimonialsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimonialsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
