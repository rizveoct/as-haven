import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollService } from '../../services/scroll.service';
import { LenisService } from '../../services/lenis.service';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.css'],
  animations: [
    trigger('buttonState', [
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateY(-1000px)',
          pointerEvents: 'none',
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          pointerEvents: 'auto',
        })
      ),
      transition('hidden => visible', [animate('300ms ease-out')]),
      transition('visible => hidden', [animate('300ms ease-in')]),
    ]),
  ],
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
    this.scrollService.scrollY$
      .pipe(takeUntil(this.destroy$))
      .subscribe((scrollY) => {
        const shouldBeVisible = scrollY > 200;
        if (shouldBeVisible !== this.isVisible) {
          this.zone.run(() => {
            this.isVisible = shouldBeVisible;
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scrollToTop() {
    this.lenisService.scrollTo(0, { duration: 0.8 });
  }
}
