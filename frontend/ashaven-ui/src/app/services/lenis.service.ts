import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import Lenis from '@studio-freight/lenis';

@Injectable({ providedIn: 'root' })
export class LenisService {
  public lenis!: Lenis;
  private router = inject(Router);

  constructor() {
    this.init();
    this.handleRouteChange();
  }

  public init() {
    this.lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      lerp: 0.1,
    });

    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  private handleRouteChange() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.lenis.scrollTo(0, { immediate: true }); // Reset scroll to top
      });
  }

  onScroll(callback: (scroll: number) => void) {
    this.lenis.on('scroll', (event: { scroll: number }) => {
      callback(event.scroll);
    });
  }
}
