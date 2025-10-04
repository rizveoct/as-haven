import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contact-hero.component.html',
  styleUrl: './contact-hero.component.css',
})
export class ContactHeroComponent {
  scrollY = 0;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.scrollY = window.scrollY;
  }
}
