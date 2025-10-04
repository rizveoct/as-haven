import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Faq } from '../../models/model';
import { FaqService } from '../../services/faq.services';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'], // ✅ fixed plural
})
export class FaqComponent implements OnInit {
  faqs: Faq[] = [];
  newFaq: Faq | null = null;
  editingFaq: Faq | null = null;

  constructor(private faqService: FaqService) {}

  ngOnInit() {
    this.loadFaqs();
  }

  loadFaqs() {
    this.faqService.getFaqs().subscribe({
      next: (faqs) => (this.faqs = faqs),
      error: (err) => console.error('Error loading FAQs:', err),
    });
  }

  startAddFaq() {
    this.newFaq = { id: 0, question: '', answer: '' };
    this.editingFaq = null;
  }

  addFaq() {
    if (
      this.newFaq &&
      this.newFaq.question.trim() &&
      this.newFaq.answer.trim()
    ) {
      this.faqService.createFaq(this.newFaq).subscribe({
        next: (faq) => {
          this.faqs.push(faq);
          this.newFaq = null;
        },
        error: (err) => console.error('Error adding FAQ:', err),
      });
    }
  }

  startEditFaq(faq: Faq) {
    this.editingFaq = { ...faq };
    this.newFaq = null;
  }

  updateFaq() {
    if (
      this.editingFaq &&
      this.editingFaq.question.trim() &&
      this.editingFaq.answer.trim()
    ) {
      this.faqService.updateFaq(this.editingFaq).subscribe({
        next: (updatedFaq) => {
          const index = this.faqs.findIndex((f) => f.id === updatedFaq.id);
          if (index !== -1) this.faqs[index] = updatedFaq;
          this.editingFaq = null;
        },
        error: (err) => console.error('Error updating FAQ:', err),
      });
    }
  }

  deleteFaq(id: number) {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      this.faqService.deleteFaq(id).subscribe({
        next: () => (this.faqs = this.faqs.filter((f) => f.id !== id)),
        error: (err) => console.error('Error deleting FAQ:', err),
      });
    }
  }

  cancelEdit() {
    this.editingFaq = null;
  }
}
