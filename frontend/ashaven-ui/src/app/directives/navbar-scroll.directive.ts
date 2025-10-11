import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollService } from '../services/scroll.service';

@Directive({
  selector: '[appNavbarScroll]',
  standalone: true,
})
export class NavbarScrollDirective implements OnInit, OnDestroy {
  private lastScrollTop = 0;
  private isHidden = false;
  private destroy$ = new Subject<void>();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.scrollService.scrollY$
      .pipe(takeUntil(this.destroy$))
      .subscribe((scrollTop) => {
        this.handleScroll(scrollTop);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleScroll(currentScroll: number) {
    // scroll down → hide navbar
    if (currentScroll > this.lastScrollTop && currentScroll > 50 && !this.isHidden) {
      this.isHidden = true;
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-120%)');
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
      this.renderer.setStyle(this.el.nativeElement, 'pointerEvents', 'none');
    }
    // scroll up → show navbar
    else if (currentScroll < this.lastScrollTop && this.isHidden) {
      this.isHidden = false;
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
      this.renderer.setStyle(this.el.nativeElement, 'pointerEvents', 'auto');
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // avoid negative scroll
  }
}
