import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferTimerComponent } from './offer-timer.component';

describe('OfferTimerComponent', () => {
  let component: OfferTimerComponent;
  let fixture: ComponentFixture<OfferTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferTimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
