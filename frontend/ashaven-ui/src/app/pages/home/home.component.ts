import { AfterViewInit, Component } from '@angular/core';
import { VisionBannerComponent } from '../../components/vision-banner/vision-banner.component';
import { TestimonialCarouselComponent } from '../../components/testimonial/testimonial.component';
import { HeroSlideComponent } from '../../components/hero-slide/hero-slide.component';
import { SliderComponent } from '../../components/slider/slider.component';
import { ProjectExploreComponent } from '../../components/project-explore/project-explore.components';
import { AnimationService } from '../../services/animation.service';
import { Offer } from '../../models/model';
import { OfferService } from '../../services/offer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProjectExploreComponent,
    VisionBannerComponent,
    TestimonialCarouselComponent,
    SliderComponent,
    HeroSlideComponent
],
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  offers: Offer[] = [];
  currentOfferIndex = 0;
  isModalVisible = false;
  isHovered = false;

  constructor(
    private offerService: OfferService,
    private anim: AnimationService
  ) {}

  ngAfterViewInit() {
    this.anim.animateOnScroll('.fade-up');
    this.anim.animateOnScroll('.zoom-in');

    if (!sessionStorage.getItem('offerShown')) {
      setTimeout(() => this.loadOffers(), 2500);
    }
  }

  loadOffers() {
    this.offerService.getActiveOffers().subscribe((res) => {
      const today = new Date();
      this.offers = res.filter(
        (o) =>
          o.isActive &&
          new Date(o.startDate) <= today &&
          new Date(o.endDate) >= today
      );

      if (this.offers.length > 0) this.showOffer();
    });
  }

  showOffer() {
    this.isModalVisible = true;
    sessionStorage.setItem('offerShown', 'true');
  }

  closeModal() {
    this.isModalVisible = false;

    // Show next offer if available
    this.currentOfferIndex++;
    if (this.currentOfferIndex < this.offers.length) {
      setTimeout(() => this.showOffer(), 500);
    }
  }

  onHover(state: boolean) {
    this.isHovered = state;
  }

  get currentOffer(): Offer | null {
    return this.offers[this.currentOfferIndex] || null;
  }
}
