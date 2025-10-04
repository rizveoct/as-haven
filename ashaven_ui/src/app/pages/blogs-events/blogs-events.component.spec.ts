import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsEventsComponent } from './blogs-events.component';

describe('BlogsEventsComponent', () => {
  let component: BlogsEventsComponent;
  let fixture: ComponentFixture<BlogsEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
