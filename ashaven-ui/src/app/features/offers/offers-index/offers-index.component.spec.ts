import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersIndexComponent } from './offers-index.component';

describe('OffersIndexComponent', () => {
  let component: OffersIndexComponent;
  let fixture: ComponentFixture<OffersIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
