import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsFormComponent } from './blog-form.component';

describe('BlogsFormComponent', () => {
  let component: BlogsFormComponent;
  let fixture: ComponentFixture<BlogsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
