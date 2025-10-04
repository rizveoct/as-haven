import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnimationService {
  animateOnScroll(selector: string, options?: { threshold?: number }) {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    const threshold = options?.threshold ?? 0.1;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate'); // animate when visible
          } else {
            entry.target.classList.remove('animate'); // remove when out of view for replay
          }
        });
      },
      { threshold }
    );

    elements.forEach((el) => observer.observe(el));
  }
}
