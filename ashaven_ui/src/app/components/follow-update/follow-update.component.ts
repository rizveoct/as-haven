import { Component, HostListener } from '@angular/core';
import { BlogSlideComponent } from "../blog-slide/blog-slide.component";

@Component({
  selector: 'app-follow-update',
  standalone: true,
  imports: [BlogSlideComponent],
  templateUrl: './follow-update.component.html',
  styleUrl: './follow-update.component.css',
})
export class FollowUpdateComponent {
  scrollAmount = 0;
  scrollStep = 300; // Adjust based on card width
  private scrollTimeout: any;
  scrollContainer: HTMLElement | null = null;
  private isDragging = false;
  private startX = 0;
  private initialScroll = 0;

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.scrollTimeout) return;

    this.scrollTimeout = setTimeout(() => {
      this.scrollTimeout = null;
    }, 500);

    if (event.deltaY > 0) {
      this.next();
    } else if (event.deltaY < 0) {
      this.prev();
    }
  }

  

  prev() {
    if (this.scrollContainer) {
      this.scrollAmount = Math.max(this.scrollAmount - this.scrollStep, 0);
      this.scrollContainer.scrollTo({
        left: this.scrollAmount,
        behavior: 'smooth',
      });
    }
  }

  next() {
    if (this.scrollContainer) {
      const maxScroll = this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth;
      this.scrollAmount = Math.min(this.scrollAmount + this.scrollStep, maxScroll);
      this.scrollContainer.scrollTo({
        left: this.scrollAmount,
        behavior: 'smooth',
      });
    }
  }
}