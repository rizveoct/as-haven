import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/model';
import { LenisService } from '../../../services/lenis.service';
import { Subject, takeUntil } from 'rxjs';

interface Slide {
  id: string;
  image: string;
  name: string;
  category: string;
  address: string;
  type: string;
}

@Component({
  selector: 'app-swiper-slider',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './swiper-slider.component.html',
  styleUrls: ['./swiper-slider.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwiperSliderComponent implements OnInit, OnDestroy, AfterViewInit {
  slides: Slide[] = [];
  baseUrl = environment.baseUrl;
  currentTranslate = 0;
  slideWidth = 400 + 16;
  speed = 0.5;
  private animationFrameId?: number;
  private pointerMoveFrame?: number;
  isDragging = false;
  startX = 0;
  startTranslate = 0;
  isPaused = false;
  private isViewportPaused = false;
  private isAnimationActive = false;
  private intersectionObserver?: IntersectionObserver;
  swipeDistance = 0;
  swipeThreshold = 50;
  private readonly documentMouseMoveListener = (
    event: MouseEvent | TouchEvent
  ) => this.onMouseMove(event);
  private readonly documentTouchMoveListener = (
    event: MouseEvent | TouchEvent
  ) => this.onMouseMove(event);
  private readonly documentMouseUpListener = () => this.onMouseUp();
  private readonly documentTouchEndListener = () => this.onMouseUp();
  @ViewChild('slidesContainer', { static: true })
  private slidesContainer?: ElementRef<HTMLDivElement>;

  @ViewChild('sliderWrapper', { static: true })
  private sliderWrapper?: ElementRef<HTMLElement>;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private ngZone: NgZone,
    private lenisService: LenisService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    this.updateTransform();
    this.ngZone.runOutsideAngular(() => {
      this.isAnimationActive = true;
      this.scheduleNextFrame();
    });
  }

  ngOnDestroy() {
    this.isAnimationActive = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    if (this.pointerMoveFrame) {
      cancelAnimationFrame(this.pointerMoveFrame);
      this.pointerMoveFrame = undefined;
    }
    document.removeEventListener('mousemove', this.documentMouseMoveListener);
    document.removeEventListener('touchmove', this.documentTouchMoveListener);
    document.removeEventListener('mouseup', this.documentMouseUpListener);
    document.removeEventListener('touchend', this.documentTouchEndListener);
    this.intersectionObserver?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProjects() {
    this.projectService
      .getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: Project[]) => {
          const slides = projects.map((project) => ({
            id: project.id,
            image: project.thumbnail
              ? `${this.baseUrl}/api/attachment/get/${project.thumbnail}`
              : 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
            name: project.name || 'Untitled Project',
            category: project.category || 'Unknown',
            address: project.address,
            type: project.type || '—',
          }));

          this.ngZone.run(() => {
            this.slides = [...slides, ...slides];
            this.cdr.markForCheck();
          });

          this.ngZone.runOutsideAngular(() => this.updateTransform());
        },
        error: (err) => {
          console.error('Error loading projects:', err);
          this.projectService.showError('Failed to load projects');
        },
      });
  }

  private animateSlide = () => {
    if (!this.isAnimationActive) {
      return;
    }

    if (!this.isPaused && !this.isDragging && !this.isViewportPaused) {
      this.currentTranslate -= this.speed;
      const totalWidth = this.slideWidth * this.slides.length;
      if (totalWidth > 0 && Math.abs(this.currentTranslate) >= totalWidth / 2) {
        this.currentTranslate = 0;
      }
      this.updateTransform();
    }

    this.scheduleNextFrame();
  };

  private scheduleNextFrame(): void {
    this.ngZone.runOutsideAngular(() => {
      this.animationFrameId = requestAnimationFrame(this.animateSlide);
    });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src =
      'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg';
  }

  prevSlide() {
    this.currentTranslate += this.slideWidth;
    if (this.currentTranslate > 0) {
      this.currentTranslate = -(this.slideWidth * (this.slides.length / 2));
    }
    this.updateTransform();
  }

  nextSlide() {
    this.currentTranslate -= this.slideWidth;
    const totalWidth = this.slideWidth * this.slides.length;
    if (Math.abs(this.currentTranslate) >= totalWidth / 2) {
      this.currentTranslate = 0;
    }
    this.updateTransform();
  }

  onMouseDown(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isDragging = true;
    this.isPaused = true;
    this.startX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    this.startTranslate = this.currentTranslate;
    this.swipeDistance = 0; // Reset swipe distance
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mousemove', this.documentMouseMoveListener);
      document.addEventListener('touchmove', this.documentTouchMoveListener);
      document.addEventListener('mouseup', this.documentMouseUpListener, {
        once: true,
      });
      document.addEventListener('touchend', this.documentTouchEndListener, {
        once: true,
      });
    });
  }

  onMouseMove(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    if (this.pointerMoveFrame) {
      return;
    }

    const pointerX =
      'touches' in event ? event.touches[0].clientX : event.clientX;

    this.pointerMoveFrame = requestAnimationFrame(() => {
      this.pointerMoveFrame = undefined;
      this.swipeDistance = Math.abs(pointerX - this.startX);
      this.currentTranslate = this.startTranslate + (pointerX - this.startX);
      const totalWidth = this.slideWidth * this.slides.length;
      if (Math.abs(this.currentTranslate) >= totalWidth / 2) {
        this.currentTranslate = 0;
      } else if (this.currentTranslate > 0) {
        this.currentTranslate = -(totalWidth / 2);
      }
      this.updateTransform();
    });
  }

  onMouseUp() {
    this.isDragging = false;
    this.isPaused = false;
    this.swipeDistance = 0; // Reset swipe distance on touch end
    document.removeEventListener('mousemove', this.documentMouseMoveListener);
    document.removeEventListener('touchmove', this.documentTouchMoveListener);
    document.removeEventListener('mouseup', this.documentMouseUpListener);
    document.removeEventListener('touchend', this.documentTouchEndListener);
    if (this.pointerMoveFrame) {
      cancelAnimationFrame(this.pointerMoveFrame);
      this.pointerMoveFrame = undefined;
    }
    this.updateTransform();
  }

  onMouseEnter() {
    this.isPaused = true;
  }

  onMouseLeave() {
    this.isPaused = false;
  }

  onProjectSelect(projectId: string, event: MouseEvent | TouchEvent) {
    if (this.swipeDistance > this.swipeThreshold) {
      event.preventDefault();
      return;
    }
    this.router
      .navigate(['/projectdetails', projectId], {
        onSameUrlNavigation: 'reload',
      })
      .then(() => {
        this.lenisService.scrollTo(0, { duration: 0.8 });
      })
      .catch((err) => console.error('Navigation error:', err));
  }

  private setupIntersectionObserver(): void {
    const target = this.sliderWrapper?.nativeElement;
    if (!target) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        this.isViewportPaused = !(entry?.isIntersecting ?? false);
      },
      { threshold: 0.1 }
    );

    this.intersectionObserver.observe(target);
  }

  private updateTransform(): void {
    const element = this.slidesContainer?.nativeElement;
    if (!element) {
      return;
    }

    element.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  trackSlide(_: number, slide: Slide): string {
    return slide.id;
  }
}
