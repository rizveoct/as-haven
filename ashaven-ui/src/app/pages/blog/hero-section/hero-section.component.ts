import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollService } from '../../../services/scroll.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent implements OnDestroy {
  scrollTransform = 'translateY(-60px)';

  private readonly destroy$ = new Subject<void>();

  constructor(private scrollService: ScrollService, private zone: NgZone) {
    this.zone.runOutsideAngular(() => {
      this.scrollService.scrollY$
        .pipe(takeUntil(this.destroy$))
        .subscribe((scrollY) => {
          const transform = `translateY(${scrollY * 0.3 - 60}px)`;
          if (transform !== this.scrollTransform) {
            this.zone.run(() => {
              this.scrollTransform = transform;
            });
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
