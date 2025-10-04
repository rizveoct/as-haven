import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsIndexComponent } from './blogs-index.component';

describe('BlogsIndexComponent', () => {
  let component: BlogsIndexComponent;
  let fixture: ComponentFixture<BlogsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
