import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { environment } from '../../environments/environment';
import { ProjectService } from '../../services/project.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Slide {
  id: number | string;
  image: string;
  alt: string;
  author: string;
  title: string;
  topic: string;
  des: string;
  thumbnailTitle: string;
  thumbnailDescription: string;
}

@Component({
  selector: 'app-hero-slide',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-slide.component.html',
  styleUrls: ['./hero-slide.component.css'],
  providers: [ProjectService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSlideComponent implements OnInit, OnDestroy, AfterViewInit {
  slides: Slide[] = [];
  currentIndex = 0;
  progress = 0;
  timeAutoNext = 9000;
  baseUrl = environment.baseUrl;

  private progressInterval?: ReturnType<typeof setInterval>;
  private observer?: IntersectionObserver;
  private isVisible = true;
  private readonly destroy$ = new Subject<void>();

  @ViewChildren('navItem') navItems!: QueryList<ElementRef<HTMLButtonElement>>;

  get activeSlide(): Slide | undefined {
    return this.slides[this.currentIndex];
  }

  constructor(
    private projectService: ProjectService,
    private el: ElementRef,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.projectService
      .getActiveProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe((projects) => {
        this.slides = projects.map((project) => ({
          id: project.id,
          image: project.thumbnail
            ? `${this.baseUrl}/api/attachment/get/${project.thumbnail}`
            : 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
          alt: project.name || 'Project image',
          author: project.category || 'Signature Collection',
          title: project.name || 'Untitled Project',
          topic: project.type || 'Project Type',
          des: `Explore our ${project.name || 'latest project'} in ${
            project.category || 'diverse'
          } settings and experience future-ready living today.`,
          thumbnailTitle: project.name || 'Untitled',
          thumbnailDescription: project.category || 'Category',
        }));

        if (this.slides.length) {
          this.currentIndex = 0;
          this.startAutoSlide(true);
        } else {
          this.progress = 0;
        }

        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    // Ensure current item is visible after view loads
    this.scrollCurrentIntoView();

    // Set up IntersectionObserver to pause/resume auto-slide based on visibility
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.zone.run(() => {
              this.isVisible = entry.isIntersecting;
              if (this.isVisible) {
                if (this.slides.length > 1 && !this.progressInterval) {
                  this.startAutoSlide(false);
                }
              } else {
                this.clearTimers();
              }
              this.cdr.markForCheck();
            });
          });
        },
        { threshold: 0.1 }
      );

      this.observer?.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.clearTimers();
    if (this.observer) {
      this.observer.disconnect();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  next(): void {
    if (!this.slides.length) return;

    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.scrollCurrentIntoView();
    this.startAutoSlide(true);
    this.cdr.markForCheck();
  }

  prev(): void {
    if (!this.slides.length) return;

    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.scrollCurrentIntoView();
    this.startAutoSlide(true);
    this.cdr.markForCheck();
  }

  goToSlide(index: number): void {
    if (
      !this.slides.length ||
      index === this.currentIndex ||
      index < 0 ||
      index >= this.slides.length
    )
      return;

    this.currentIndex = index;
    this.scrollCurrentIntoView();
    this.startAutoSlide(true);
    this.cdr.markForCheck();
  }

  trackBySlide(_: number, slide: Slide): number | string {
    return slide.id ?? _;
  }

  private startAutoSlide(resetProgress: boolean = true): void {
    this.clearTimers();

    if (this.slides.length <= 1) {
      this.progress = this.slides.length ? 100 : 0;
      this.cdr.markForCheck();
      return;
    }

    if (!this.isVisible) {
      return;
    }

    if (resetProgress) {
      this.progress = 0;
      this.cdr.markForCheck();
    }

    const intervalDuration = 40;
    const increment = 100 / (this.timeAutoNext / intervalDuration);

    this.zone.runOutsideAngular(() => {
      this.progressInterval = setInterval(() => {
        this.zone.run(() => {
          if (!this.isVisible) {
            this.clearTimers();
            return;
          }

          if (this.progress >= 100) {
            this.next();
            return;
          }

          this.progress = Math.min(100, this.progress + increment);
          this.cdr.markForCheck();
        });
      }, intervalDuration);
    });
  }

  private clearTimers(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = undefined;
    }
  }

  /** Smoothly scroll the active slide button into view */
  private scrollCurrentIntoView(): void {
    const el = this.navItems?.get(this.currentIndex)?.nativeElement;
    if (!el) return;

    el.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }
}
