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
  private fallbackSlides: Slide[] = [
    {
      id: 'signature-lagoon',
      image:
        'https://images.unsplash.com/photo-1616594039964-5c07b911c927?auto=format&fit=crop&w=1200&q=80',
      name: 'Lagoonview Residences',
      category: 'Signature',
      address: 'Emerald Bay, Lagos',
      type: 'Waterfront Villas',
      description:
        'Wraparound terraces, cascading water features, and private marinas curated for sun-washed living beside the lagoon.',
    },
    {
      id: 'signature-orchard',
      image:
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      name: 'The Orchard Lofts',
      category: 'Signature',
      address: 'Ikoyi Crest, Lagos',
      type: 'Skyline Lofts',
      description:
        'Sun-drenched duplex lofts with winter gardens, biophilic interiors, and concierge wellness programming.',
    },
    {
      id: 'signature-dune',
      image:
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
      name: 'Dune Estate',
      category: 'Signature',
      address: 'Eko Atlantic, Lagos',
      type: 'Coastal Penthouses',
      description:
        'Elevated sky homes framed by Atlantic panoramas, featuring private plunge pools and tailored lifestyle services.',
    },
  ];

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
          const apiSlides = projects.map((project, index) => ({
            id: project.id,
            image: project.thumbnail
              ? `${this.baseUrl}/api/attachment/get/${project.thumbnail}`
              : this.fallbackSlides[index % this.fallbackSlides.length].image,
            name: project.name || 'Untitled Project',
            category: project.category || 'Collection',
            address: project.address || '—',
            type: project.type || '—',
            description:
              project.description || 'Discover elegance in every detail.',
          }));

          this.applySlides(apiSlides.length ? apiSlides : this.fallbackSlides);
        },
        error: (err) => {
          console.error('Error loading projects:', err);
          this.applySlides(this.fallbackSlides);
        },
      })
    );
  }

  private applySlides(slides: Slide[]) {
    this.slides = slides;

    // Wait a tick so Angular renders <swiper-slide> nodes, then initialize Swiper element
    setTimeout(() => this.initSwiper(), 50);
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
          nextEl: '.signature-slider__control--next',
          prevEl: '.signature-slider__control--prev',
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
