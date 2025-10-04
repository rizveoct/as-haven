import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryItem, GalleryService } from '../../services/gallery.service';
import { environment } from '../../environments/environment';
import { ContactHeroComponent } from './gallery-hero/gallery-hero.component';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [CommonModule, ContactHeroComponent],
  templateUrl: './gallery-page.component.html',
  styleUrls: ['./gallery-page.component.css'],
})
export class GalleryPageComponent implements OnInit, AfterViewInit {
  galleryItems: GalleryItem[] = [];
  lightboxOpen = false;
  currentIndex = 0;
  baseUrl = environment.baseUrl;

  private touchStartX = 0;
  private touchEndX = 0;

  @Output() imageError = new EventEmitter<Event>();

  constructor(
    private galleryService: GalleryService,
    private anim: AnimationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.anim.animateOnScroll('.fade-up');
    this.anim.animateOnScroll('.zoom-in');
  }

  ngOnInit(): void {
    this.loadGalleryItems();
  }

  async loadGalleryItems(): Promise<void> {
    try {
      const items = await this.galleryService.getAll();
      this.galleryItems = items
        .filter((item) => item.isActive)
        .sort((a, b) => a.order - b.order);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load gallery items:', error);
    }
  }

  get currentItem(): GalleryItem | null {
    return this.galleryItems[this.currentIndex] || null;
  }

  onImageError(event: Event): void {
    this.imageError.emit(event);
  }

  openLightbox(index: number): void {
    this.currentIndex = index;
    this.lightboxOpen = true;
    this.cdr.detectChanges();
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    this.cdr.detectChanges();
  }

  nextItem(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.galleryItems.length) {
      this.currentIndex = (this.currentIndex + 1) % this.galleryItems.length;
      this.cdr.detectChanges();
    }
  }

  prevItem(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.galleryItems.length) {
      this.currentIndex =
        (this.currentIndex - 1 + this.galleryItems.length) %
        this.galleryItems.length;
      this.cdr.detectChanges();
    }
  }

  // --- Swipe Support ---
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe(): void {
    const swipeDistance = this.touchStartX - this.touchEndX;
    const minSwipe = 50; // px threshold

    if (Math.abs(swipeDistance) > minSwipe) {
      if (swipeDistance > 0) {
        this.nextItem(); // swipe left → next
      } else {
        this.prevItem(); // swipe right → prev
      }
    }
  }
}
