import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OfferService } from '../../../services/offer.service';
import { Offer } from '../../../models/model';

@Component({
  selector: 'app-offer-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './offer-form.component.html',
  styleUrls: ['./offer-form.component.css'],
})
export class OfferFormComponent {
  @Input() set offer(value: Offer | null) {
    this._offer = value ? { ...value } : { ...this.defaultOffer };
  }
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  selectedPicture: File | null = null;

  private defaultOffer: Offer = {
    id: '',
    title: '',
    description: '',
    picture: '',
    startDate: '',
    endDate: '',
    isActive: true,
  };
  _offer: Offer = this.defaultOffer;
  constructor(private offerService: OfferService) {}

  onPictureChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPicture = input.files[0];
    }
  }

  saveOffer() {
    const formData = new FormData();
    formData.append('title', this._offer.title || '');
    formData.append('description', this._offer.description || '');
    formData.append('startDate', this._offer.startDate || '');
    formData.append('endDate', this._offer.endDate || '');
    if (this.selectedPicture) {
      formData.append('image', this.selectedPicture);
    }
    if (this.mode === 'edit') {
      formData.append('id', this._offer.id || '');
    }

    const serviceMethod =
      this.mode === 'create'
        ? this.offerService.createOffer(formData)
        : this.offerService.editOffer(formData);
    serviceMethod.subscribe({
      next: (response) => {
        this.offerService.showSuccess(
          response ||
            `Offer ${
              this.mode === 'create' ? 'created' : 'updated'
            } successfully`
        );
        this.saved.emit();
      },
      error: (error) => {
        this.offerService.showError(
          `Failed to ${this.mode === 'create' ? 'create' : 'update'} offer: ${
            error.message || 'Unknown error'
          }`
        );
        console.error(error);
      },
    });
  }

  closeModal() {
    this.close.emit();
  }
}
