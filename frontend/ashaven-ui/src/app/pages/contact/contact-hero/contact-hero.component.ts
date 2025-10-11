import { CommonModule } from '@angular/common';
import { Component, NgZone, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollService } from '../../../services/scroll.service';

@Component({
  selector: 'app-contact-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contact-hero.component.html',
  styleUrl: './contact-hero.component.css',
})
export class ContactHeroComponent implements OnDestroy {
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
