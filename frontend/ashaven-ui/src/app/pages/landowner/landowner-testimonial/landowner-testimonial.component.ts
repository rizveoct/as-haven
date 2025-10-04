import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Testimonial } from '../../../models/model';


@Component({
  selector: 'app-landowner-testimonial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landowner-testimonial.component.html',
  styleUrls: ['./landowner-testimonial.component.css'],
})
export class LandownerTestimonialComponent {
  @Input() testimonials: Testimonial[] = [];
  currentIndex = 0;

  prev() {
    this.currentIndex =
      this.currentIndex > 0
        ? this.currentIndex - 1
        : this.testimonials.length - 1;
  }
  next() {
    this.currentIndex =
      this.currentIndex < this.testimonials.length - 1
        ? this.currentIndex + 1
        : 0;
  }
}
