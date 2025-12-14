import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, fromEvent, of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
} from 'rxjs/operators';
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
  private viewportQuery?: MediaQueryList;
  private rafId?: number;
  private lenisScrollCallback?: (event: ScrollEvent) => void;
  private motionPreferenceListener?: (event: MediaQueryListEvent) => void;
  private viewportPreferenceListener?: (event: MediaQueryListEvent) => void;
  private routerSubscription?: Subscription;
  private fallbackScrollSubscription?: Subscription;

  // ✅ Missing fields added
  private lastEmittedScroll = 0;
  private loopStartEvents?: string[];
  private loopStarter?: (ev: Event) => void;

  readonly scroll$: Observable<number> = this.scrollSubject.asObservable();

  constructor(private router: Router, private ngZone: NgZone) {
    if (typeof window === 'undefined') {
      this.windowScroll$ = of(0);
      return;
    }

    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.viewportQuery = window.matchMedia('(max-width: 768px)');

    this.windowScroll$ = fromEvent(window, 'scroll', { passive: true }).pipe(
      startWith(window.scrollY || window.pageYOffset || 0),
      map(() => window.scrollY || window.pageYOffset || 0),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    const initialScroll = this.getWindowScrollPosition();
    this.scrollSubject.next(initialScroll);
    this.lastEmittedScroll = initialScroll;

    this.motionPreferenceListener = (event: MediaQueryListEvent) => {
      if (event.matches) {
        this.stopLenis();
      } else {
        this.init();
      }
    };

    if (typeof this.motionQuery.addEventListener === 'function') {
      this.motionQuery.addEventListener(
        'change',
        this.motionPreferenceListener
      );
    } else if (typeof this.motionQuery.addListener === 'function') {
      this.motionQuery.addListener(this.motionPreferenceListener);
    }

    this.viewportPreferenceListener = (event: MediaQueryListEvent) => {
      if (event.matches) {
        this.stopLenis();
      } else {
        this.init();
      }
    };

    if (this.viewportQuery) {
      if (typeof this.viewportQuery.addEventListener === 'function') {
        this.viewportQuery.addEventListener(
          'change',
          this.viewportPreferenceListener
        );
      } else if (typeof this.viewportQuery.addListener === 'function') {
        this.viewportQuery.addListener(this.viewportPreferenceListener);
      }
    }

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (!this.lenis) {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          this.emitScroll(0);
          return;
        }
        this.lenis.scrollTo(0, { immediate: true });
      });

    this.handleFallbackScroll();
    this.init();
  }

  init(): void {
    if (typeof window === 'undefined') return;

    if (!this.shouldUseLenis()) {
      this.stopLenis();
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    root.style.scrollBehavior = 'auto';
    body.style.scrollBehavior = 'auto';

    this.stopLenis(); // ensure clean state

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
      this.emitScroll(event.scroll);
    };
    this.lenis.on('scroll', this.lenisScrollCallback);

    this.startAnimationLoop();
  }

  onScroll(callback: (scroll: number) => void): void {
    this.ngZone.runOutsideAngular(() => {
      this.scroll$.pipe(distinctUntilChanged()).subscribe(callback);
    });
  }

  scrollTo(target: ScrollTarget, options?: LenisScrollToOptions): void {
    if (typeof window === 'undefined') return;

    if (this.lenis) {
      this.scheduleAnimationFrame();
      this.lenis.scrollTo(target, options);
      return;
    }

    const top = this.resolveTarget(target);
    window.scrollTo({ top, behavior: 'auto' });
  }

  private resolveTarget(target: ScrollTarget): number {
    if (typeof target === 'number') return target;

    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element instanceof HTMLElement) {
        return (
          element.getBoundingClientRect().top +
          (window.scrollY || window.pageYOffset || 0)
        );
      }
      return 0;
    }

    if (target instanceof HTMLElement) {
      return (
        target.getBoundingClientRect().top +
        (window.scrollY || window.pageYOffset || 0)
      );
    }

    return 0;
  }

  private shouldUseLenis(): boolean {
    return false;
  }

  private stopLenis(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }

    this.unbindLoopStarters();

    document.documentElement.classList.remove('has-lenis');
    document.body.classList.remove('has-lenis');

    if (this.lenisScrollCallback && this.lenis) {
      this.lenis.off('scroll', this.lenisScrollCallback);
    }
    this.lenisScrollCallback = undefined;

    this.lenis?.destroy();
    this.lenis = undefined;

    if (typeof window !== 'undefined') {
      this.emitScroll(this.getWindowScrollPosition());
    }
  }

  // ✅ keep a single cleanup() implementation
  cleanup(): void {
    this.stopLenis();

    if (this.motionQuery && this.motionPreferenceListener) {
      if (typeof this.motionQuery.removeEventListener === 'function') {
        this.motionQuery.removeEventListener(
          'change',
          this.motionPreferenceListener
        );
      } else if (typeof this.motionQuery.removeListener === 'function') {
        this.motionQuery.removeListener(this.motionPreferenceListener);
      }
    }
    this.motionPreferenceListener = undefined;

    if (this.viewportQuery && this.viewportPreferenceListener) {
      if (typeof this.viewportQuery.removeEventListener === 'function') {
        this.viewportQuery.removeEventListener(
          'change',
          this.viewportPreferenceListener
        );
      } else if (typeof this.viewportQuery.removeListener === 'function') {
        this.viewportQuery.removeListener(this.viewportPreferenceListener);
      }
    }
    this.viewportPreferenceListener = undefined;

    this.routerSubscription?.unsubscribe();
    this.routerSubscription = undefined;

    this.fallbackScrollSubscription?.unsubscribe();
    this.fallbackScrollSubscription = undefined;
  }

  // ✅ keep a single startAnimationLoop() that pairs with bind/unbind helpers
  private startAnimationLoop(): void {
    this.bindLoopStarters();
    this.scheduleAnimationFrame();
  }

  private scheduleAnimationFrame(): void {
    if (this.rafId || !this.lenis) return;

    this.ngZone.runOutsideAngular(() => {
      const onFrame = (time: number) => {
        this.lenis?.raf(time);
        // Keep looping as long as Lenis exists
        if (this.lenis) {
          this.rafId = requestAnimationFrame(onFrame);
        } else {
          this.rafId = undefined;
        }
      };
      this.rafId = requestAnimationFrame(onFrame);
    });
  }

  // ✅ new helper to complement unbindLoopStarters()
  private bindLoopStarters(): void {
    if (typeof window === 'undefined') return;

    this.loopStartEvents = this.loopStartEvents ?? [
      'wheel',
      'touchstart',
      'keydown',
      'scroll',
    ];
    if (!this.loopStarter) {
      this.loopStarter = () => this.scheduleAnimationFrame();
    }

    this.loopStartEvents.forEach((type) => {
      window.addEventListener(type, this.loopStarter as EventListener, {
        passive: true,
      });
    });
  }

  private unbindLoopStarters(): void {
    if (
      typeof window === 'undefined' ||
      !this.loopStartEvents?.length ||
      !this.loopStarter
    )
      return;

    this.loopStartEvents.forEach((type) =>
      window.removeEventListener(type, this.loopStarter as EventListener)
    );
    this.loopStartEvents = undefined;
  }

  private handleFallbackScroll(): void {
    const windowScroll$ = this.windowScroll$;
    if (!windowScroll$) return;

    this.ngZone.runOutsideAngular(() => {
      this.fallbackScrollSubscription?.unsubscribe();
      this.fallbackScrollSubscription = windowScroll$
        .pipe(filter(() => !this.lenis))
        .subscribe((scrollY) => this.emitScroll(scrollY));
    });
  }

  private emitScroll(scrollY: number): void {
    const roundedScroll = Math.round(scrollY);
    if (roundedScroll === this.lastEmittedScroll) return;

    this.lastEmittedScroll = roundedScroll;
    this.scrollSubject.next(roundedScroll);
  }

  private getWindowScrollPosition(): number {
    if (typeof window === 'undefined') return 0;
    return Math.round(window.scrollY || window.pageYOffset || 0);
  }
}
