import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Blog } from '../model/blog.model';
import { BlogService } from '../service/blog.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css'],
})
export class BlogFormComponent {
  private defaultBlog: Blog = {
    id: '',
    title: '',
    description: '',
    image: '',
    postedDate: '',
    offerDateTime: '',
    isActive: true,
  };
  _blog: Blog = this.defaultBlog;

  @Input() set blog(value: Blog | null) {
    this._blog = value ? { ...value } : { ...this.defaultBlog };
  }
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  selectedFile: File | null = null;

  constructor(private blogService: BlogService) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  saveBlog() {
    const formData = new FormData();
    formData.append('title', this._blog.title || '');
    formData.append('description', this._blog.description || '');
    formData.append('postedDate', this._blog.postedDate || '');
    formData.append('offerDateTime', this._blog.offerDateTime || '');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.mode === 'edit') {
      formData.append('id', this._blog.id || '');
    }

    const serviceMethod =
      this.mode === 'create'
        ? this.blogService.createBlog(formData)
        : this.blogService.editBlog(formData);
    serviceMethod.subscribe({
      next: (response) => {
        this.blogService.showSuccess(
          response ||
            `Blog ${
              this.mode === 'create' ? 'created' : 'updated'
            } successfully`
        );
        this.saved.emit();
      },
      error: (error) => {
        this.blogService.showError(
          `Failed to ${this.mode === 'create' ? 'create' : 'update'} blog: ${
            error.message || 'Unknown error'
          }`
        );
        console.error(error);
      },
    });
  }

  closeModal() {
    this.close.emit();
  }
}
