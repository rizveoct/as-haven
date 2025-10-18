import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProjectService } from '../../services/project.service';
import { environment } from '../../environments/environment';
import { Project } from '../../models/model';

interface Slide {
  id: string;
  image: string;
  name: string;
  category: string;
  address: string;
  type: string;
  description: string;
}

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('swiper', { read: ElementRef })
  swiperRef!: ElementRef<HTMLElement>;
  slides: Slide[] = [];
  baseUrl = environment.baseUrl;
  private subscription = new Subscription();
  private intersectionObserver?: IntersectionObserver;
  private isSliderVisible = false;
  private pendingInit = false;
  private isSwiperInitialized = false;

  constructor(private projectService: ProjectService, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    this.queueSwiperInit();
  }

  private loadProjects() {
    this.subscription.add(
      this.projectService.getActiveProjects().subscribe({
        next: (projects: Project[]) => {
          this.slides = projects.map((project) => ({
            id: project.id,
            image: project.thumbnail
              ? `${this.baseUrl}/api/attachment/get/${project.thumbnail}`
              : 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
            name: project.name || 'Untitled Project',
            category: project.category || 'Unknown',
            address: project.address || '—',
            type: project.type || '—',
            description:
              project.description || 'Discover elegance in every detail.',
          }));

          this.teardownSwiper();
          this.queueSwiperInit();
        },
        error: (err) => {
          console.error('Error loading projects:', err);
        },
      })
    );
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== '/images/fallback.png') {
      img.src = '/images/fallback.png';
    }
  }

  private initSwiper() {
    const swiperEl = this.swiperRef?.nativeElement as any;
    if (!swiperEl) {
      console.warn('Swiper element not found (initSwiper)');
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.teardownSwiper();

      Object.assign(swiperEl, {
        slidesPerView: 3,
        spaceBetween: 24,
        loop: true,
        speed: 800,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.neo-slider__control--next',
          prevEl: '.neo-slider__control--prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });

      swiperEl.initialize();
    });

    this.isSwiperInitialized = true;
    this.resumeSwiper();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.intersectionObserver?.disconnect();
    this.pauseSwiper();
    this.teardownSwiper();
  }

  private setupIntersectionObserver(): void {
    if (typeof window === 'undefined') {
      this.isSliderVisible = true;
      return;
    }

    const element = this.swiperRef?.nativeElement;
    if (!element) {
      this.isSliderVisible = true;
      return;
    }

    if (!('IntersectionObserver' in window)) {
      this.isSliderVisible = true;
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const isIntersecting = !!entry?.isIntersecting;

          if (isIntersecting === this.isSliderVisible) {
            return;
          }

          this.isSliderVisible = isIntersecting;

          if (isIntersecting) {
            this.queueSwiperInit();
          } else {
            this.pauseSwiper();
          }
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px 200px 0px',
        }
      );

      this.intersectionObserver.observe(element);
    });
  }

  private queueSwiperInit(): void {
    if (this.pendingInit || !this.isSliderVisible || !this.swiperRef || !this.slides.length) {
      return;
    }

    this.pendingInit = true;

    if (typeof window === 'undefined') {
      this.pendingInit = false;
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.pendingInit = false;
        this.maybeInitSwiper();
      });
    });
  }

  private maybeInitSwiper(): void {
    if (!this.swiperRef || !this.slides.length) {
      return;
    }

    if (this.isSwiperInitialized) {
      this.resumeSwiper();
      return;
    }

    if (!this.isSliderVisible) {
      return;
    }

    this.initSwiper();
  }

  private teardownSwiper(): void {
    const swiperEl = this.swiperRef?.nativeElement as any;
    const instance = swiperEl?.swiper;

    if (instance && typeof instance.destroy === 'function') {
      try {
        instance.destroy(true, true);
      } catch (e) {
        // ignore teardown errors
      }
    }

    this.isSwiperInitialized = false;
  }

  private pauseSwiper(): void {
    const swiper = (this.swiperRef?.nativeElement as any)?.swiper;
    if (swiper?.autoplay?.running) {
      try {
        swiper.autoplay.stop();
      } catch (e) {
        // ignore
      }
    }
  }

  private resumeSwiper(): void {
    const swiper = (this.swiperRef?.nativeElement as any)?.swiper;
    if (swiper?.autoplay && !swiper.autoplay.running) {
      try {
        swiper.autoplay.start();
      } catch (e) {
        // ignore
      }
    }
  }
}
