import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Faq } from '../../../models/model';
import { FaqService } from '../../../services/faq.services';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'open',
        style({
          height: '*',
          opacity: 1,
          overflow: 'visible',
        })
      ),
      state(
        'closed',
        style({
          height: '0',
          opacity: 0,
          overflow: 'hidden',
        })
      ),
      transition('closed <=> open', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class FaqComponent implements OnInit {
  faqs: (Faq & { isOpen?: boolean })[] = [];

  constructor(private faqService: FaqService) {}

  ngOnInit(): void {
    this.loadFaqs();
  }

  loadFaqs(): void {
    this.faqService.getFaqs().subscribe({
      next: (faqs) => {
        // add isOpen property for animation state
        this.faqs = faqs.map((f) => ({ ...f, isOpen: false }));
      },
      error: (err) => console.error('Error loading FAQs:', err),
    });
  }

  toggleFaq(faq: Faq & { isOpen?: boolean }) {
    faq.isOpen = !faq.isOpen;
  }
}
