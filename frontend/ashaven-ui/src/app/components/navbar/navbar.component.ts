import { Component, HostListener, OnDestroy, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { LenisService } from '../../services/lenis.service';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { SidePanelService } from '../../services/sidepanel.service';
import { RouterLink, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, SidePanelComponent, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isTop: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    public sidePanel: SidePanelService,
    // private lenisService: LenisService,
    public router: Router,
    private scrollService: ScrollService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.scrollService.scrollY$
      .pipe(takeUntil(this.destroy$))
      .subscribe((scrollY) => {
        const isTop = scrollY <= 20;
        if (isTop !== this.isTop) {
          this.zone.run(() => {
            this.isTop = isTop;
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    // if (this.lenisService.lenis) {
    //   this.lenisService.lenis.scrollTo(`#${sectionId}`, { duration: 0.8 });
    // } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // }

    this.sidePanel.close();
  }
}
