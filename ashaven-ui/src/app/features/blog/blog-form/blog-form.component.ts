import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Blog } from '../../../models/model';
import { BlogService } from '../../../services/blog.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-form.component.html',
  styleUrl: './blog-form.component.css',
})
export class BlogFormComponent {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() set blog(value: Blog | null) {
    if (value) {
      this._blog = { ...value };
    } else {
      this._blog = { ...this.defaultBlog };
    }

    this.postedDateInput = this._blog.postedDate
      ? this.formatDateForInput(this._blog.postedDate)
      : '';
    this.offerDateInput = this._blog.offerDateTime
      ? this.formatDateForInput(this._blog.offerDateTime)
      : '';
    this.previewUrl = this._blog.image
      ? `${this.apiBaseUrl}/api/attachment/get/${this._blog.image}`
      : null;
    this.selectedImage = null;
  }

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  postedDateInput = '';
  offerDateInput = '';
  selectedImage: File | null = null;
  previewUrl: string | null = null;

  private readonly apiBaseUrl = environment.baseUrl;

  private readonly defaultBlog: Blog = {
    id: '',
    title: '',
    description: '',
    image: '',
    isActive: true,
    createdDate: undefined,
    postedDate: undefined,
    offerDateTime: undefined,
    userId: undefined,
  };

  _blog: Blog = { ...this.defaultBlog };

  constructor(private readonly blogService: BlogService) {}

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedImage);
    }
  }

  saveBlog(): void {
    const formData = new FormData();
    formData.append('title', this._blog.title || '');
    formData.append('description', this._blog.description || '');
    if (this.postedDateInput) {
      formData.append('postedDate', this.postedDateInput);
    }
    if (this.offerDateInput) {
      formData.append('offerDateTime', this.offerDateInput);
    }
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    if (this.mode === 'edit') {
      formData.append('id', this._blog.id || '');
    }

    const request$ =
      this.mode === 'create'
        ? this.blogService.createBlog(formData)
        : this.blogService.editBlog(formData);

    request$.subscribe({
      next: (message) => {
        this.blogService.showSuccess(
          message || `Blog ${this.mode === 'create' ? 'created' : 'updated'} successfully`
        );
        this.saved.emit();
      },
      error: (error) => {
        this.blogService.showError(
          `Failed to ${this.mode === 'create' ? 'create' : 'update'} blog: ${
            error.message || 'Unknown error'
          }`
        );
      },
    });
  }

  closeModal(): void {
    this.close.emit();
  }

  private formatDateForInput(date: string): string {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }
    return parsed.toISOString().slice(0, 16);
  }
}
