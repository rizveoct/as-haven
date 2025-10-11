import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { LenisService } from '../services/lenis.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appHeroParallax]',
  standalone: true,
})
export class HeroParallaxDirective implements OnInit, OnDestroy {
  private scrollSubscription?: Subscription;

  constructor(private el: ElementRef, private lenisService: LenisService) {}

  private updateParallax(scroll: number) {
    const position = Math.max(-100, Math.min(-scroll * 0.2, 100));
    this.el.nativeElement.style.backgroundPositionY = `${position}px`;
  }

  ngOnInit(): void {
    // Set initial position explicitly
    this.el.nativeElement.style.backgroundPosition = 'center 100px';

    // Initialize parallax with scroll = 0
    this.updateParallax(0);

    // Subscribe to scroll events
    this.scrollSubscription = this.lenisService.onScroll((scroll: number) => {
      this.updateParallax(scroll);
    });
  }

  ngOnDestroy(): void {
    this.scrollSubscription?.unsubscribe();
  }
}
