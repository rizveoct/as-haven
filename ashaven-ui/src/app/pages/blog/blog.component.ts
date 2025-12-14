import { Component } from '@angular/core';
import { HeroSectionComponent } from "./hero-section/hero-section.component";
import { BlogFormComponent } from "../../features/blogs/blog-form/blog-form.component";
import { BlogListComponent } from "./blog-list/blog-list.component";

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [HeroSectionComponent, BlogFormComponent, BlogListComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {

}
