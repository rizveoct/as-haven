import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandownerHeroComponent } from './landowner-hero.component';

describe('LandownerHeroComponent', () => {
  let component: LandownerHeroComponent;
  let fixture: ComponentFixture<LandownerHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandownerHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandownerHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
