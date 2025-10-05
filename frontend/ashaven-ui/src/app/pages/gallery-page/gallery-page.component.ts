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
  activeFilter: 'all' | 'image' | 'video' = 'all';
  isLoading = false;
  loadError = '';
  skeletonPlaceholders = Array.from({ length: 6 });

  private touchStartX = 0;
  private touchEndX = 0;

  @Output() imageError = new EventEmitter<Event>();

  constructor(
    private galleryService: GalleryService,
    private anim: AnimationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.registerScrollAnimations();
  }

  ngOnInit(): void {
    this.loadGalleryItems();
  }

  async loadGalleryItems(): Promise<void> {
    this.isLoading = true;
    this.loadError = '';
    this.cdr.detectChanges();

    try {
      const items = await this.galleryService.getAll();
      this.galleryItems = items
        .filter((item) => item.isActive)
        .sort((a, b) => a.order - b.order);

      if (this.galleryItems.length) {
        this.deferAnimationRefresh();
      }
    } catch (error) {
      console.error('Failed to load gallery items:', error);
      this.loadError = 'Unable to load gallery items at the moment.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  get filteredGalleryItems(): GalleryItem[] {
    if (this.activeFilter === 'image') {
      return this.galleryItems.filter((item) => this.isImage(item));
    }
    if (this.activeFilter === 'video') {
      return this.galleryItems.filter((item) => this.isVideo(item));
    }
    return this.galleryItems;
  }

  get featuredItem(): GalleryItem | null {
    return this.filteredGalleryItems[0] || null;
  }

  get supportingItems(): GalleryItem[] {
    return this.filteredGalleryItems.slice(1);
  }

  get totalItems(): number {
    return this.galleryItems.length;
  }

  get totalImages(): number {
    return this.galleryItems.filter((item) => this.isImage(item)).length;
  }

  get totalVideos(): number {
    return this.galleryItems.filter((item) => this.isVideo(item)).length;
  }

  get currentItem(): GalleryItem | null {
    return this.galleryItems[this.currentIndex] || null;
  }

  onImageError(event: Event): void {
    this.imageError.emit(event);
  }

  setFilter(filter: 'all' | 'image' | 'video'): void {
    this.activeFilter = filter;
    const nextItem = this.filteredGalleryItems[0];

    if (nextItem) {
      const nextIndex = this.galleryItems.findIndex(
        (item) => item.id === nextItem.id
      );
      this.currentIndex = nextIndex !== -1 ? nextIndex : 0;
    } else {
      this.currentIndex = 0;
    }

    if (
      this.lightboxOpen &&
      (!this.currentItem ||
        !this.filteredGalleryItems.some(
          (item) => item.id === this.currentItem?.id
        ))
    ) {
      this.closeLightbox();
    } else {
      this.deferAnimationRefresh();
      this.cdr.detectChanges();
    }
  }

  openItem(item: GalleryItem): void {
    const actualIndex = this.galleryItems.findIndex(
      (galleryItem) => galleryItem.id === item.id
    );
    if (actualIndex !== -1) {
      this.openLightbox(actualIndex);
    }
  }

  mediaUrl(item: GalleryItem): string {
    return `${this.baseUrl}/api/attachment/get/${item.contentName}`;
  }

  isVideo(item: GalleryItem): boolean {
    return item.contentType?.toLowerCase() === 'video';
  }

  isImage(item: GalleryItem): boolean {
    return item.contentType?.toLowerCase() === 'image';
  }

  getAriaLabel(item: GalleryItem): string {
    const typeLabel = this.isVideo(item) ? 'Video' : 'Image';
    const title = item.title?.trim().length ? item.title : 'Gallery item';
    return `${typeLabel}: ${title}`;
  }

  trackById(_: number, item: GalleryItem): string {
    return item.id;
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

  private registerScrollAnimations(): void {
    this.anim.animateOnScroll('.fade-up', {
      threshold: 0.15,
      rootMargin: '0px 0px -80px',
    });
  }

  private deferAnimationRefresh(): void {
    if (typeof window === 'undefined' || !window.requestAnimationFrame) {
      this.registerScrollAnimations();
      return;
    }

    window.requestAnimationFrame(() => this.registerScrollAnimations());
  }
}
