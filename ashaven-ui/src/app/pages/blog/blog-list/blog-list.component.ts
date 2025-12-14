import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BlogCardComponent } from '../../../components/blog-card/blog-card.component';
import { environment } from '../../../environments/environment';
import { BlogSummary } from '../../../models/model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, BlogCardComponent],
  templateUrl: './blog-list.component.html',
})
export class BlogListComponent implements OnInit {
  baseURL = environment.baseUrl;
  list = signal<BlogSummary[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getBlogs();
  }

  getBlogs() {
    this.http
      .get<BlogSummary[] | null>(`${this.baseURL}/api/website/getblogs`)
      .subscribe((res: BlogSummary[] | null) => {
        this.list.set(res ?? []);
      });
  }
}
