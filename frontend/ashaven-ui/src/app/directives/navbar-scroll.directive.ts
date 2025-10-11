import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { LenisService } from '../services/lenis.service';

@Directive({
  selector: '[appNavbarScroll]',
  standalone: true,
})
export class NavbarScrollDirective {
  private lastScrollTop = 0;
  private isHidden = false;
  

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    // scroll down → hide navbar
    if (
      currentScroll > this.lastScrollTop &&
      currentScroll > 50 &&
      !this.isHidden
    ) {
      this.isHidden = true;
      this.renderer.setStyle(
        this.el.nativeElement,
        'transform',
        'translateY(-120%)'
      );
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
      this.renderer.setStyle(this.el.nativeElement, 'pointerEvents', 'none');
    }
    // scroll up → show navbar
    else if (currentScroll < this.lastScrollTop && this.isHidden) {
      this.isHidden = false;
      this.renderer.setStyle(
        this.el.nativeElement,
        'transform',
        'translateY(0)'
      );
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
      this.renderer.setStyle(this.el.nativeElement, 'pointerEvents', 'auto');
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // avoid negative scroll
  }
}
