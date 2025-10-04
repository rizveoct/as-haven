import { Component, OnInit } from '@angular/core';
import { Blog } from '../model/blog.model';
import { BlogService } from '../service/blog.service';
import { BlogFormComponent } from '../blog-form/blog-form.component';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blogs-index',
  standalone: true,
  imports: [BlogFormComponent, CommonModule],
  templateUrl: './blogs-index.component.html',
  styleUrls: ['./blogs-index.component.css'],
})
export class BlogsIndexComponent implements OnInit {
  blogs: Blog[] = [];
  showCreateModal = false;
  showEditModal = false;
  selectedBlog: Blog | null = null;
  apiBaseUrl = environment.baseUrl;

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.fetchBlogs();
  }

  fetchBlogs() {
    this.blogService.getBlogs().subscribe({
      next: (data) => {
        this.blogs = data;
      },
      error: (error) => {
        this.blogService.showError(
          'Failed to fetch blogs: ' + (error.message || 'Unknown error')
        );
        console.error(error);
      },
    });
  }

  openCreateModal() {
    this.selectedBlog = null;
    this.showCreateModal = true;
  }

  openEditModal(blog: Blog) {
    this.selectedBlog = { ...blog };
    this.showEditModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.selectedBlog = null;
  }

  onBlogSaved() {
    this.fetchBlogs();
    this.closeModal();
  }

  toggleActiveStatus(id: string, isActive: boolean) {
    this.blogService.toggleActiveStatus(id, isActive).subscribe({
      next: (response) => {
        if (response === 'Data not found.') {
          this.blogService.showError(response);
        } else {
          this.blogService.showSuccess(
            response ||
              `Blog ${isActive ? 'activated' : 'deactivated'} successfully`
          );
          this.fetchBlogs();
        }
      },
      error: (error) => {
        this.blogService.showError(
          `Failed to ${isActive ? 'activate' : 'deactivate'} blog: ${
            error.message || 'Unknown error'
          }`
        );
        console.error(error);
      },
    });
  }

  deleteBlog(id: string) {
    this.blogService.deleteBlog(id).subscribe({
      next: (response) => {
        this.blogService.showSuccess(response || 'Blog deleted successfully');
        this.fetchBlogs();
      },
      error: (error) => {
        this.blogService.showError(
          `Failed to delete blog: ${error.message || 'Unknown error'}`
        );
        console.error(error);
      },
    });
  }
}
