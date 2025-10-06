import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gallery-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery-hero.component.html',
  styleUrl: './gallery-hero.component.css',
})
export class GalleryHeroComponent {
  scrollY = 0;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.scrollY = window.scrollY;
  }
}
