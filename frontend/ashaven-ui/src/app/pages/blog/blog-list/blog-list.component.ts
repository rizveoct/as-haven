import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogSummary } from '../../../models/model';
import { BlogCardComponent } from '../../../components/blog-card/blog-card.component';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, BlogCardComponent],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
})
export class BlogListComponent {
  @Input() blogs: BlogSummary[] | null | undefined;
  @Input() isLoading = false;
  @Input() loadError = false;
  @Input() baseUrl = '';
  @Output() retry = new EventEmitter<void>();

  get hasBlogs(): boolean {
    return !!(this.blogs && this.blogs.length);
  }

  get featuredBlog(): BlogSummary | null {
    if (!this.blogs || this.blogs.length === 0) {
      return null;
    }
    return this.blogs[0];
  }

  get highlightBlogs(): BlogSummary[] {
    if (!this.blogs || this.blogs.length <= 1) {
      return [];
    }
    return this.blogs.slice(1, Math.min(this.blogs.length, 4));
  }

  get gridBlogs(): BlogSummary[] {
    if (!this.blogs || this.blogs.length <= 1) {
      return [];
    }

    const highlightCount = this.highlightBlogs.length;
    return this.blogs.slice(1 + highlightCount);
  }

  trackById(_: number, blog: BlogSummary): string {
    return blog.id;
  }

  onRetry(): void {
    this.retry.emit();
  }
}
