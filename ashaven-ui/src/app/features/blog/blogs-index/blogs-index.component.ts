import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BlogService } from '../../../services/blog.service';
import { Blog } from '../../../models/model';
import { environment } from '../../../environments/environment';
import { BlogFormComponent } from '../blog-form/blog-form.component';

@Component({
  selector: 'app-blogs-index',
  standalone: true,
  imports: [CommonModule, BlogFormComponent],
  templateUrl: './blogs-index.component.html',
  styleUrl: './blogs-index.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogsIndexComponent implements OnInit, OnDestroy {
  blogs: Blog[] = [];
  isLoading = false;
  loadError = false;
  showCreateModal = false;
  showEditModal = false;
  selectedBlog: Blog | null = null;
  readonly apiBaseUrl = environment.baseUrl;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly blogService: BlogService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.isLoading = true;
    this.loadError = false;
    this.blogService
      .getBlogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blogs) => {
          this.blogs = blogs || [];
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.blogs = [];
          this.isLoading = false;
          this.loadError = true;
          this.cdr.markForCheck();
        },
      });
  }

  openCreateModal(): void {
    this.selectedBlog = null;
    this.showCreateModal = true;
    this.cdr.markForCheck();
  }

  openEditModal(blog: Blog): void {
    this.selectedBlog = blog;
    this.showEditModal = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.selectedBlog = null;
    this.cdr.markForCheck();
  }

  onBlogSaved(): void {
    this.closeModal();
    this.loadBlogs();
  }

  toggleBlogActive(id: string, value: boolean): void {
    this.blogService.toggleBlogActive(id, value).subscribe({
      next: (message) => {
        this.blogService.showSuccess(
          message || `Blog ${value ? 'activated' : 'deactivated'} successfully`
        );
        this.loadBlogs();
      },
      error: (error) => {
        this.blogService.showError(
          `Failed to update blog: ${error.message || 'Unknown error'}`
        );
      },
    });
  }

  deleteBlog(id: string): void {
    this.blogService.deleteBlog(id).subscribe({
      next: (message) => {
        this.blogService.showSuccess(message || 'Blog deleted successfully');
        this.loadBlogs();
      },
      error: (error) => {
        this.blogService.showError(
          `Failed to delete blog: ${error.message || 'Unknown error'}`
        );
      },
    });
  }

  trackById(_: number, blog: Blog): string {
    return blog.id;
  }

  imageUrl(image?: string | null): string {
    if (!image) {
      return '/images/banner/banner-3.png';
    }

    return `${this.apiBaseUrl}/api/attachment/get/${image}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
