import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landowner-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landowner-hero.component.html',
  styleUrls: ['./landowner-hero.component.css'],
})
export class LandownerHeroComponent {
  scrollY = 0;
  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.scrollY = window.scrollY;
  }
}
