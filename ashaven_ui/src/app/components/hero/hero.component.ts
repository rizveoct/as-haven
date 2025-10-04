import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideContentAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(100px)',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition('void => *', [
        animate('1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'),
      ]),
      transition('* => void', [
        animate('1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'),
      ]),
    ]),
  ],
})
export class HeroComponent {
  currentSlideIndex = signal(0);

  slides = [
    {
      imageUrl:
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1074&auto=format&fit=crop',
      title: 'Define Your Digital Legacy',
      description:
        'We architect and build bespoke solutions that leave a lasting impact on your industry.',
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1074&auto=format&fit=crop',
      title: 'Crafting Experiences, Not Just Websites',
      description:
        'Our designs are meticulously crafted to engage, inspire, and convert every visitor.',
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1074&auto=format&fit=crop',
      title: 'Innovation is Our Foundation',
      description:
        'Pushing the boundaries of what’s possible with technology to create your advantage.',
    },
  ];

  constructor() {
    setInterval(() => this.nextSlide(), 5000);
  }

  getTranslateX(index: number): string {
    const slideWidth = 100;
    const offset = index - this.currentSlideIndex();
    return offset * slideWidth + '%';
  }

  nextSlide() {
    this.currentSlideIndex.update((i) => (i + 1) % this.slides.length);
  }

  prevSlide() {
    this.currentSlideIndex.update(
      (i) => (i - 1 + this.slides.length) % this.slides.length
    );
  }

  goToSlide(index: number) {
    this.currentSlideIndex.set(index);
  }
}
