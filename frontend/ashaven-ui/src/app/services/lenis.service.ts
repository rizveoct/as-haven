import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, fromEvent, of } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, startWith } from 'rxjs/operators';
import Lenis from '@studio-freight/lenis';

type ScrollEvent = { scroll: number };

type ScrollTarget = Parameters<Lenis['scrollTo']>[0];
type LenisScrollToOptions = Parameters<Lenis['scrollTo']>[1];

@Injectable({ providedIn: 'root' })
export class LenisService {
  public lenis?: Lenis;

  private readonly scrollSubject = new BehaviorSubject<number>(0);
  private readonly windowScroll$?: Observable<number>;
  private motionQuery?: MediaQueryList;
  private rafId?: number;
  private lenisScrollCallback?: (event: ScrollEvent) => void;

  readonly scroll$: Observable<number> = this.scrollSubject.asObservable();

  constructor(private router: Router, private ngZone: NgZone) {
    if (typeof window === 'undefined') {
      this.windowScroll$ = of(0);
      return;
    }

    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.windowScroll$ = fromEvent(window, 'scroll', { passive: true }).pipe(
      startWith(window.scrollY || window.pageYOffset || 0),
      map(() => window.scrollY || window.pageYOffset || 0),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.scrollSubject.next(window.scrollY || window.pageYOffset || 0);

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (event.matches) {
        this.stopLenis();
      } else {
        this.init();
      }
    };

    if (typeof this.motionQuery.addEventListener === 'function') {
      this.motionQuery.addEventListener('change', handleMotionPreference);
    } else if (typeof this.motionQuery.addListener === 'function') {
      this.motionQuery.addListener(handleMotionPreference);
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (!this.lenis) {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          this.scrollSubject.next(0);
          return;
        }

        this.lenis.scrollTo(0, { immediate: true });
      });

    this.handleFallbackScroll();
    this.init();
  }

  init(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (!this.shouldUseLenis()) {
      this.stopLenis();
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    root.style.scrollBehavior = 'auto';
    body.style.scrollBehavior = 'auto';

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

    this.lenisScrollCallback = (event: ScrollEvent) => {
      this.scrollSubject.next(event.scroll);
    };

    this.lenis.on('scroll', this.lenisScrollCallback);

    const runRaf = (time: number) => {
      this.lenis?.raf(time);
      this.scheduleRaf(runRaf);
    };

    this.scheduleRaf(runRaf);
  }

  onScroll(callback: (scroll: number) => void): void {
    this.ngZone.runOutsideAngular(() => {
      this.scroll$.pipe(distinctUntilChanged()).subscribe(callback);
    });
  }

  scrollTo(target: ScrollTarget, options?: LenisScrollToOptions): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.lenis) {
      this.lenis.scrollTo(target, options);
      return;
    }

    const top = this.resolveTarget(target);
    const behavior: ScrollBehavior = this.motionQuery?.matches ? 'auto' : 'smooth';
    window.scrollTo({ top, behavior });
  }

  private resolveTarget(target: ScrollTarget): number {
    if (typeof target === 'number') {
      return target;
    }

    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element instanceof HTMLElement) {
        return element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
      }
      return 0;
    }

    if (target instanceof HTMLElement) {
      return target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
    }

    return 0;
  }

  private shouldUseLenis(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const prefersReducedMotion = this.motionQuery ?? window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      return false;
    }

    return true;
  }

  private stopLenis(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }

    document.documentElement.classList.remove('has-lenis');
    document.body.classList.remove('has-lenis');

    if (this.lenisScrollCallback && this.lenis) {
      this.lenis.off('scroll', this.lenisScrollCallback);
    }
    this.lenisScrollCallback = undefined;

    this.lenis?.destroy();
    this.lenis = undefined;

    if (typeof window !== 'undefined') {
      this.scrollSubject.next(window.scrollY || window.pageYOffset || 0);
    }
  }

  private scheduleRaf(callback: FrameRequestCallback): void {
    this.ngZone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(callback);
    });
  }

  private handleFallbackScroll(): void {
    const windowScroll$ = this.windowScroll$;

    if (!windowScroll$) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      windowScroll$
        .pipe(filter(() => !this.lenis))
        .subscribe((scrollY) => this.scrollSubject.next(scrollY));
    });
  }
}
