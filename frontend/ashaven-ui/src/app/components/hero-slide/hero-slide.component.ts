import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { environment } from '../../environments/environment';
import { ProjectService } from '../../services/project.service';

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
})
export class HeroSlideComponent implements OnInit, OnDestroy, AfterViewInit {
  slides: Slide[] = [];
  currentIndex = 0;
  progress = 0;
  timeAutoNext = 9000;
  baseUrl = environment.baseUrl;

  private progressInterval?: ReturnType<typeof setInterval>;

  @ViewChildren('navItem') navItems!: QueryList<ElementRef<HTMLButtonElement>>;

  get activeSlide(): Slide | undefined {
    return this.slides[this.currentIndex];
  }

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getActiveProjects().subscribe((projects) => {
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
        this.startAutoSlide();
      } else {
        this.progress = 0;
      }
    });
  }

  ngAfterViewInit(): void {
    // Ensure current item is visible after view loads
    this.scrollCurrentIntoView();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  next(): void {
    if (!this.slides.length) return;

    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.scrollCurrentIntoView();
    this.startAutoSlide();
  }

  prev(): void {
    if (!this.slides.length) return;

    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.scrollCurrentIntoView();
    this.startAutoSlide();
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
    this.startAutoSlide();
  }

  trackBySlide(_: number, slide: Slide): number | string {
    return slide.id ?? _;
  }

  private startAutoSlide(): void {
    this.clearTimers();

    if (this.slides.length <= 1) {
      this.progress = this.slides.length ? 100 : 0;
      return;
    }

    this.progress = 0;
    const intervalDuration = 40;
    const increment = 100 / (this.timeAutoNext / intervalDuration);

    this.progressInterval = setInterval(() => {
      this.progress = Math.min(100, this.progress + increment);

      if (this.progress >= 100) {
        this.next();
      }
    }, intervalDuration);
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
      behavior: 'smooth',
    });
  }
}
