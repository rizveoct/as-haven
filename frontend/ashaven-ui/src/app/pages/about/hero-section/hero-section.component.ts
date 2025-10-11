import { Component, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollService } from '../../../services/scroll.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent implements OnDestroy {
  scrollTransform = 'translateY(-60px)';
  private destroy$ = new Subject<void>();

  constructor(private scrollService: ScrollService, private zone: NgZone) {
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
