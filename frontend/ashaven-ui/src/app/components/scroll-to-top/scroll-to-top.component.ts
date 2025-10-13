import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, fromEvent, merge } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  startWith,
  takeUntil,
  throttleTime,
} from 'rxjs/operators';
import { ScrollService } from '../../services/scroll.service';
import { LenisService } from '../../services/lenis.service';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollToTopComponent implements OnInit, OnDestroy {
  isVisible = false;
  private destroy$ = new Subject<void>();

  constructor(
    private scrollService: ScrollService,
    private lenisService: LenisService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    const fallbackScroll$ = this.createFallbackScroll$();
    const scroll$ = fallbackScroll$
      ? merge(this.scrollService.scrollY$, fallbackScroll$)
      : this.scrollService.scrollY$;

    this.zone.runOutsideAngular(() => {
      scroll$
        .pipe(takeUntil(this.destroy$))
        .subscribe((scrollY) => {
          const shouldBeVisible = scrollY > 200;
          if (shouldBeVisible !== this.isVisible) {
            this.zone.run(() => {
              this.isVisible = shouldBeVisible;
            });
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scrollToTop() {
    this.lenisService.scrollTo(0, { duration: 0.8 });
  }

  private createFallbackScroll$(): Observable<number> | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return fromEvent(window, 'scroll', { passive: true }).pipe(
      startWith(window.scrollY || window.pageYOffset || 0),
      map(() => window.scrollY || window.pageYOffset || 0),
      throttleTime(50, undefined, { leading: true, trailing: true }),
      distinctUntilChanged()
    );
  }
}
