import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedProjectsComponent } from './related-projects.component';

describe('RelatedProjectsComponent', () => {
  let component: RelatedProjectsComponent;
  let fixture: ComponentFixture<RelatedProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
