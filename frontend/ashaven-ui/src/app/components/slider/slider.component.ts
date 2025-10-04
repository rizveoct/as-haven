import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('swiper', { read: ElementRef })
  swiperRef!: ElementRef<HTMLElement>;
  slides: Slide[] = [];
  baseUrl = environment.baseUrl;
  private subscription = new Subscription();

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  ngAfterViewInit(): void {
    // nothing here — initialization happens after slides are loaded and rendered
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

          // Wait a tick so Angular renders <swiper-slide> nodes, then initialize Swiper element
          setTimeout(() => this.initSwiper(), 50);
        },
        error: (err) => {
          console.error('Error loading projects:', err);
        },
      })
    );
  }

  private initSwiper() {
    const swiperEl = this.swiperRef?.nativeElement as any;
    if (!swiperEl) {
      console.warn('Swiper element not found (initSwiper)');
      return;
    }

    // If already initialized, destroy first (safe-guard)
    try {
      if (swiperEl.swiper && typeof swiperEl.swiper.destroy === 'function') {
        swiperEl.swiper.destroy(true, true);
      }
    } catch (e) {
      // ignore
    }

    // Assign configuration as properties (use JS props because we used init="false")
    Object.assign(swiperEl, {
      // core
      slidesPerView: 3,
      spaceBetween: 24,
      loop: true,
      speed: 800,

      // autoplay module
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },

      // navigation - selectors must exist in DOM at initialize time
      navigation: {
        nextEl: '.luxe-slider__control--next',
        prevEl: '.luxe-slider__control--prev',
      },

      // pagination - we will place an element with class .swiper-pagination in template
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      breakpoints: {
        0: { slidesPerView: 1 }, // 📱 Mobile
        640: { slidesPerView: 1 }, // Small tablets
        768: { slidesPerView: 2 }, // Medium tablets
        1024: { slidesPerView: 3 }, // Laptops/desktops
      },

      // events (optional)
      on: {
        init() {
          // console.log('swiper init', arguments);
        },
        slideChange() {
          // console.log('slide changed');
        },
      },
    });

    // Initialize
    swiperEl.initialize();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
