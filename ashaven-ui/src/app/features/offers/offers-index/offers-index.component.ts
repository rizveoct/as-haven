import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../../services/offer.service';
import { OfferFormComponent } from '../offer-form/offer-form.component';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Offer } from '../../../models/model';

@Component({
  selector: 'app-offers-index',
  standalone: true,
  imports: [OfferFormComponent, CommonModule],
  templateUrl: './offers-index.component.html',
  styleUrls: ['./offers-index.component.css'],
})
export class OffersIndexComponent implements OnInit {
  offers: Offer[] = [];
  showCreateModal = false;
  showEditModal = false;
  selectedOffer: Offer | null = null;
  apiBaseUrl = environment.baseUrl;

  constructor(private offerService: OfferService) {}

  ngOnInit() {
    this.fetchOffers();
  }

  fetchOffers() {
    this.offerService.getOffers().subscribe({
      next: (data) => {
        this.offers = data;
      },
      error: (error) => {
        this.offerService.showError(
          'Failed to fetch offers: ' + (error.message || 'Unknown error')
        );
        console.error(error);
      },
    });
  }

  openCreateModal() {
    this.selectedOffer = null;
    this.showCreateModal = true;
  }

  openEditModal(offer: Offer) {
    this.selectedOffer = { ...offer };
    this.showEditModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.selectedOffer = null;
  }

  onOfferSaved() {
    this.fetchOffers();
    this.closeModal();
  }

  toggleActiveStatus(id: string, isActive: boolean) {
    this.offerService.toggleActiveStatus(id, isActive).subscribe({
      next: (response) => {
        if (response === 'Data not found.') {
          this.offerService.showError(response);
        } else {
          this.offerService.showSuccess(
            response ||
              `Offer ${isActive ? 'activated' : 'deactivated'} successfully`
          );
          this.fetchOffers();
        }
      },
      error: (error) => {
        this.offerService.showError(
          `Failed to ${isActive ? 'activate' : 'deactivate'} offer: ${
            error.message || 'Unknown error'
          }`
        );
        console.error(error);
      },
    });
  }

  deleteOffer(id: string) {
    this.offerService.deleteOffer(id).subscribe({
      next: (response) => {
        this.offerService.showSuccess(response || 'Offer deleted successfully');
        this.fetchOffers();
      },
      error: (error) => {
        this.offerService.showError(
          `Failed to delete offer: ${error.message || 'Unknown error'}`
        );
        console.error(error);
      },
    });
  }
}
