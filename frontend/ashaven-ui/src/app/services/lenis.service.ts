import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import Lenis from '@studio-freight/lenis';

type ScrollEvent = { scroll: number };

@Injectable({ providedIn: 'root' })
export class LenisService {
  public lenis?: Lenis;
  private router = inject(Router);
  private rafId?: number;
  private motionQuery?: MediaQueryList;

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionQuery = this.motionQuery;
    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (event.matches) {
        this.stopLenis();
      } else {
        this.init();
      }
    };

    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', handleMotionPreference);
    } else if (typeof motionQuery.addListener === 'function') {
      // Safari < 14 fallback
      motionQuery.addListener(handleMotionPreference);
    }

    this.init();
    this.handleRouteChange();
  }

  public init(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    root.style.scrollBehavior = 'auto';
    body.style.scrollBehavior = 'auto';

    const prefersReducedMotion = this.motionQuery ?? window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      this.stopLenis();
      return;
    }

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    this.stopLenis();

    this.lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.1,
      lerp: 0.075,
    });

    root.classList.add('has-lenis');
    body.classList.add('has-lenis');

    const runRaf = (time: number) => {
      this.lenis?.raf(time);
      this.rafId = requestAnimationFrame(runRaf);
    };

    this.rafId = requestAnimationFrame(runRaf);
  }

  private stopLenis(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }

    document.documentElement.classList.remove('has-lenis');
    document.body.classList.remove('has-lenis');

    this.lenis?.destroy();
    this.lenis = undefined;
  }

  private handleRouteChange(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (!this.lenis) {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          return;
        }

        this.lenis.scrollTo(0, { immediate: true });
      });
  }

  onScroll(callback: (scroll: number) => void): void {
    if (this.lenis) {
      this.lenis.on('scroll', (event: ScrollEvent) => {
        callback(event.scroll);
      });
      return;
    }

    if (typeof window !== 'undefined') {
      window.addEventListener(
        'scroll',
        () => callback(window.scrollY || window.pageYOffset || 0),
        { passive: true }
      );
    }
  }
}
