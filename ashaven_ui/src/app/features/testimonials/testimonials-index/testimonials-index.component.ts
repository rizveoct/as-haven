import { Component, OnInit } from '@angular/core';
import { TestimonialFormComponent } from '../testimonial-form/testimonial-form.component';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Testimonial } from '../../../models/model';
import { TestimonialService } from '../../../services/testimonial.service';

@Component({
  selector: 'app-testimonials-index',
  standalone: true,
  imports: [TestimonialFormComponent, CommonModule],
  templateUrl: './testimonials-index.component.html',
  styleUrls: ['./testimonials-index.component.css'],
})
export class TestimonialsIndexComponent implements OnInit {
  testimonials: Testimonial[] = [];
  showCreateModal = false;
  showEditModal = false;
  selectedTestimonial: Testimonial | null = null;
  apiBaseUrl = environment.baseUrl;

  constructor(private testimonialService: TestimonialService) {}

  ngOnInit() {
    this.fetchTestimonials();
  }

  fetchTestimonials() {
    this.testimonialService.getTestimonials().subscribe({
      next: (data) => {
        this.testimonials = data;
      },
      error: (error) => {
        this.testimonialService.showError(
          'Failed to fetch testimonials: ' + (error.message || 'Unknown error')
        );
        console.error(error);
      },
    });
  }

  openCreateModal() {
    this.selectedTestimonial = null;
    this.showCreateModal = true;
  }

  openEditModal(testimonial: Testimonial) {
    this.selectedTestimonial = { ...testimonial };
    this.showEditModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.selectedTestimonial = null;
  }

  onTestimonialSaved() {
    this.fetchTestimonials();
    this.closeModal();
  }

  toggleActiveStatus(id: string, isActive: boolean) {
    this.testimonialService.toggleActiveStatus(id, isActive).subscribe({
      next: (response) => {
        if (response === 'Data not found.') {
          this.testimonialService.showError(response);
        } else {
          this.testimonialService.showSuccess(
            response ||
              `Testimonial ${
                isActive ? 'activated' : 'deactivated'
              } successfully`
          );
          this.fetchTestimonials();
        }
      },
      error: (error) => {
        this.testimonialService.showError(
          `Failed to ${isActive ? 'activate' : 'deactivate'} testimonial: ${
            error.message || 'Unknown error'
          }`
        );
        console.error(error);
      },
    });
  }

  deleteTestimonial(id: string) {
    this.testimonialService.deleteTestimonial(id).subscribe({
      next: (response) => {
        this.testimonialService.showSuccess(
          response || 'Testimonial deleted successfully'
        );
        this.fetchTestimonials();
      },
      error: (error) => {
        this.testimonialService.showError(
          `Failed to delete testimonial: ${error.message || 'Unknown error'}`
        );
        console.error(error);
      },
    });
  }
}
