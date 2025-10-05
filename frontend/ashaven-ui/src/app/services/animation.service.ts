import { Injectable } from '@angular/core';

type AnimationOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

@Injectable({ providedIn: 'root' })
export class AnimationService {
  private observers = new Map<string, IntersectionObserver>();

  animateOnScroll(selector: string, options?: AnimationOptions): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(selector)
    );

    if (!elements.length) {
      return;
    }

    const threshold = options?.threshold ?? 0.1;
    const rootMargin = options?.rootMargin ?? '0px';
    const once = options?.once ?? false;

    const existingObserver = this.observers.get(selector);
    existingObserver?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove('animate');
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach((el) => {
      el.classList.remove('animate');
      observer.observe(el);
    });

    this.observers.set(selector, observer);
  }
}
