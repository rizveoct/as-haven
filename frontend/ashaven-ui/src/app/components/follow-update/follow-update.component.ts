import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BlogSlideComponent } from '../blog-slide/blog-slide.component';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-follow-update',
  standalone: true,
  imports: [BlogSlideComponent],
  templateUrl: './follow-update.component.html',
  styleUrl: './follow-update.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpdateComponent implements AfterViewInit, OnDestroy {
  scrollAmount = 0;
  scrollStep = 300; // Adjust based on card width
  scrollContainer: HTMLElement | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent<WheelEvent>(this.elementRef.nativeElement, 'wheel', {
        passive: true,
      })
        .pipe(throttleTime(150), takeUntil(this.destroy$))
        .subscribe((event) => {
          if (event.deltaY > 0) {
            this.next();
          } else if (event.deltaY < 0) {
            this.prev();
          }
        });
    });
  }

  prev() {
    if (!this.scrollContainer) {
      return;
    }

    this.scrollAmount = Math.max(this.scrollAmount - this.scrollStep, 0);
    this.scrollContainer.scrollTo({
      left: this.scrollAmount,
      behavior: 'auto',
    });
  }

  next() {
    if (!this.scrollContainer) {
      return;
    }

    const maxScroll =
      this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth;
    this.scrollAmount = Math.min(this.scrollAmount + this.scrollStep, maxScroll);
    this.scrollContainer.scrollTo({
      left: this.scrollAmount,
      behavior: 'auto',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
