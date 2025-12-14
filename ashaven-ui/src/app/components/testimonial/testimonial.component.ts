import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialService } from '../../services/testimonial.service';
import { Testimonial } from '../../models/model';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  group,
} from '@angular/animations';

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.css'],
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(
          '0.6s ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate(
          '0.6s ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class TestimonialCarouselComponent implements OnInit, OnDestroy {
  testimonials: Testimonial[] = [];
  baseURL = environment.baseUrl;
  currentIndex = 0;
  private subscription: Subscription = new Subscription();
  private autoSlideInterval: any;

  constructor(private testimonialService: TestimonialService) {}

  ngOnInit(): void {
    this.loadTestimonials();

    // Auto-slide every 5 seconds
    this.autoSlideInterval = setInterval(() => this.next(), 5000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  loadTestimonials(): void {
    this.subscription.add(
      this.testimonialService.getActiveTestimonials().subscribe({
        next: (res: Testimonial[]) => {
          this.testimonials = res.filter((t) => t.isActive);
          if (this.testimonials.length === 0) {
            this.testimonialService.showError('No active testimonials found.');
          } else {
            this.currentIndex = 0;
          }
        },
        error: (err) => console.error(err),
      })
    );
  }

  get currentTestimonial(): Testimonial | null {
    return this.testimonials.length > 0
      ? this.testimonials[this.currentIndex]
      : null;
  }

  next(): void {
    if (this.testimonials.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    }
  }

  prev(): void {
    if (this.testimonials.length > 0) {
      this.currentIndex =
        (this.currentIndex - 1 + this.testimonials.length) %
        this.testimonials.length;
    }
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src =
      'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg';
  }
}
