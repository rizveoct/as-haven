import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandownerBenefitsComponent } from './landowner-benefits.component';

describe('LandownerBenefitsComponent', () => {
  let component: LandownerBenefitsComponent;
  let fixture: ComponentFixture<LandownerBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandownerBenefitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandownerBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
