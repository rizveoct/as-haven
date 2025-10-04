import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Consultant } from '../../../models/model';
import { ConsultantService } from '../../../services/consultant.service';

interface Slide {
  id: string;
  image: string;
  name: string;
  location: string;
}

@Component({
  selector: 'app-interior-slider',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './interior.component.html',
  styleUrls: ['./interior.component.css'],
})
export class InteriorSliderComponent implements OnInit, OnDestroy {
  slides: Slide[] = [];
  baseUrl = environment.baseUrl;
  currentTranslate = 0;
  slideWidth = 400 + 16;
  speed = 0.5;
  animationFrameId!: number;
  isDragging = false;
  startX = 0;
  startTranslate = 0;
  isPaused = false;
  swipeDistance = 0;
  swipeThreshold = 50;
  selectedSlide: Slide | null = null;
  isModalOpen = false;

  constructor(
    private projectService: ConsultantService,
    private router: Router
  ) {}

  openModal(slide: Slide, event: MouseEvent | TouchEvent) {
    if (this.swipeDistance > this.swipeThreshold) {
      event.preventDefault();
      return;
    }
    this.selectedSlide = slide;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedSlide = null;
  }

  ngOnInit() {
    this.loadProjects();
    this.animateSlide();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  }

  loadProjects() {
    this.projectService.getConsultant().subscribe({
      next: (projects: Consultant[]) => {
        const nonInterior = (projects ?? []).filter(
          (p) => Number(p.isInterior) === 1
        );

        this.slides = nonInterior.map((project) => ({
          id: project.id,
          image: project.image
            ? `${this.baseUrl}/api/attachment/get/${project.image}`
            : 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
          name: project.name || 'Untitled Project',
          location: project.location,
        }));

        // duplicate for infinite loop
        this.slides = [...this.slides, ...this.slides];
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.projectService.showError('Failed to load projects');
      },
    });
  }

  animateSlide() {
    if (!this.isPaused && !this.isDragging) {
      this.currentTranslate += this.speed; // move right instead of left
      const totalWidth = this.slideWidth * this.slides.length;

      // when we've gone too far right, reset to the negative half
      if (this.currentTranslate >= 0) {
        this.currentTranslate = -(totalWidth / 2);
      }
    }
    this.animationFrameId = requestAnimationFrame(() => this.animateSlide());
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
  }

  nextSlide() {
    this.currentTranslate -= this.slideWidth;
    const totalWidth = this.slideWidth * this.slides.length;
    if (Math.abs(this.currentTranslate) >= totalWidth / 2) {
      this.currentTranslate = 0;
    }
  }

  onMouseDown(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isDragging = true;
    this.isPaused = true;
    this.startX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    this.startTranslate = this.currentTranslate;
    this.swipeDistance = 0; // Reset swipe distance
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('touchmove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this), {
      once: true,
    });
    document.addEventListener('touchend', this.onMouseUp.bind(this), {
      once: true,
    });
  }

  onMouseMove(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    const currentX =
      'touches' in event ? event.touches[0].clientX : event.clientX;
    this.swipeDistance = Math.abs(currentX - this.startX);
    this.currentTranslate = this.startTranslate + (currentX - this.startX);
    const totalWidth = this.slideWidth * this.slides.length;
    if (Math.abs(this.currentTranslate) >= totalWidth / 2) {
      this.currentTranslate = 0;
    } else if (this.currentTranslate > 0) {
      this.currentTranslate = -(totalWidth / 2);
    }
  }

  onMouseUp() {
    this.isDragging = false;
    this.isPaused = false;
    this.swipeDistance = 0; // Reset swipe distance on touch end
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('touchmove', this.onMouseMove.bind(this));
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((err) => console.error('Navigation error:', err));
  }
}
