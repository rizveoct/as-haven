import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Testimonial } from '../../../models/model';
import { TestimonialService } from '../../../services/testimonial.service';

@Component({
  selector: 'app-testimonial-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './testimonial-form.component.html',
  styleUrls: ['./testimonial-form.component.css'],
})
export class TestimonialFormComponent {
  @Input() set testimonial(value: Testimonial | null) {
    this._testimonial = value ? { ...value } : { ...this.defaultTestimonial };
  }
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  selectedImage: File | null = null;
  selectedContent: File | null = null;

  private defaultTestimonial: Testimonial = {
    id: '',
    name: '',
    description: '',
    image: '',
    contentType: '',
    content: '',
    order: 0,
    isActive: true,
    customerType: '',
  };

  _testimonial: Testimonial = this.defaultTestimonial;

  constructor(private testimonialService: TestimonialService) {}

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  onContentChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedContent = input.files[0];
    }
  }

  saveTestimonial() {
    const formData = new FormData();
    formData.append('name', this._testimonial.name || '');
    formData.append('description', this._testimonial.description || '');
    formData.append('contentType', this._testimonial.contentType || '');
    formData.append('order', this._testimonial.order.toString() || '0');
    formData.append('customerType', this._testimonial.customerType || '');
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    if (this.selectedContent) {
      formData.append('content', this.selectedContent);
    }
    if (this.mode === 'edit') {
      formData.append('id', this._testimonial.id || '');
    }

    const serviceMethod =
      this.mode === 'create'
        ? this.testimonialService.createTestimonial(formData)
        : this.testimonialService.editTestimonial(formData);
    serviceMethod.subscribe({
      next: (response) => {
        this.testimonialService.showSuccess(
          response ||
            `Testimonial ${
              this.mode === 'create' ? 'created' : 'updated'
            } successfully`
        );
        this.saved.emit();
      },
      error: (error) => {
        this.testimonialService.showError(
          `Failed to ${
            this.mode === 'create' ? 'create' : 'update'
          } testimonial: ${error.message || 'Unknown error'}`
        );
        console.error(error);
      },
    });
  }

  closeModal() {
    this.close.emit();
  }
}
