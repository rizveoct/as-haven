import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-gallery.component.html',
  styleUrls: ['./project-gallery.component.css'],
})
export class ProjectGalleryComponent {
  @Input() gallery: any[] = [];
  @Input() baseUrl: string = '';
  @Output() imageError = new EventEmitter<Event>();

  lightboxOpen = false;
  currentIndex = 0;

  get currentItem() {
    return this.gallery[this.currentIndex];
  }

  onImageError(event: Event): void {
    this.imageError.emit(event);
  }

  openLightbox(index: number): void {
    this.currentIndex = index;
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
  }

  nextItem(): void {
    if (this.gallery.length) {
      this.currentIndex = (this.currentIndex + 1) % this.gallery.length;
    }
  }

  prevItem(): void {
    if (this.gallery.length) {
      this.currentIndex =
        (this.currentIndex - 1 + this.gallery.length) % this.gallery.length;
    }
  }
}
