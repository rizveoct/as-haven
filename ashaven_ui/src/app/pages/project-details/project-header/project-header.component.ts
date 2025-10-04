import {
  Component,
  Input,
  AfterViewInit,
  AfterViewChecked,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-header.component.html',
  styleUrls: ['./project-header.component.css'],
})
export class ProjectHeaderComponent implements AfterViewInit, AfterViewChecked {
  @Input() project: any; // Replace with your Project interface
  @Input() baseUrl: string = ''; // Base URL for API

  @ViewChild('parallaxContainer') parallaxContainer?: ElementRef;
  @ViewChild('parallaxImage') parallaxImage?: ElementRef;
  @ViewChild('parallaxImageRight') parallaxImageRight?: ElementRef;

  imageError: boolean = false;
  private ticking = false;

  ngAfterViewInit() {
    // Run initial update after DOM is painted
    setTimeout(() => this.updateParallax(), 0);
  }

  ngAfterViewChecked() {
    // Ensure async-loaded content also gets parallax applied
    this.updateParallax();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.updateParallax();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  updateParallax() {
    if (
      !this.parallaxContainer ||
      !this.parallaxImage ||
      !this.parallaxImageRight
    ) {
      return; // Exit safely if elements are not available
    }

    const container = this.parallaxContainer.nativeElement;
    const imgLeft = this.parallaxImage.nativeElement;
    const imgRight = this.parallaxImageRight.nativeElement;

    if (!container || !imgLeft || !imgRight) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Only apply parallax when container is in view
    if (rect.top < windowHeight && rect.bottom > 0) {
      const scrollY = window.scrollY || window.pageYOffset;
      const offset = rect.top + scrollY;
      const speed = 0.1; // Further reduced for minimal movement
      const translateY = (scrollY - offset) * speed;

      // Apply parallax to both images
      imgLeft.style.transform = `translateY(${translateY}px)`;
      imgRight.style.transform = `translateY(${translateY}px)`;

      // Debug dimensions
      console.log('Container:', rect.width, rect.height);
      console.log('Left Image:', imgLeft.naturalWidth, imgLeft.naturalHeight);
      console.log(
        'Right Image:',
        imgRight.naturalWidth,
        imgRight.naturalHeight
      );
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/fallback.png';
    this.imageError = true;
  }
}
