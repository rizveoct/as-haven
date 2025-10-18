import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
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
    this.zone.runOutsideAngular(() => {
      this.scrollService.scrollY$
        .pipe(
          map((scrollY) => scrollY > 200),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe((shouldBeVisible) => {
          if (shouldBeVisible === this.isVisible) {
            return;
          }

          this.zone.run(() => {
            this.isVisible = shouldBeVisible;
          });
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
}
