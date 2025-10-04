import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LenisService } from '../../services/lenis.service';
import { NavbarScrollDirective } from '../../directives/navbar-scroll.directive';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { SidePanelService } from '../../services/sidepanel.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    NavbarScrollDirective,
    SidePanelComponent,
    RouterLink,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isTop: boolean = true;

  constructor(
    public sidePanel: SidePanelService,
    private lenisService: LenisService,
    public router: Router
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isTop = window.scrollY <= 20;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.side-panel') &&
      !target.closest('[data-menu-trigger]') &&
      !target.closest('.carousel') && // ProjectSlideComponent
      !target.closest('#splide01') && // SliderComponent
      !target.closest('.next-splide') &&
      !target.closest('.prev-splide') &&
      !target.closest('#next') &&
      !target.closest('#prev')
    ) {
      this.sidePanel.close();
    }
  }

  scrollToSection(sectionId: string) {
    if (this.lenisService.lenis) {
      this.lenisService.lenis.scrollTo(`#${sectionId}`, { duration: 0.8 });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    this.sidePanel.close();
  }
}
