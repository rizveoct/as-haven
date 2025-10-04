import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LandownerHeroComponent } from './landowner-hero/landowner-hero.component';
import { LandownerBenefitsComponent } from './landowner-benefits/landowner-benefits.component';
import { LandownerFormComponent } from './landowner-form/landowner-form.component';
import { AnimationService } from '../../services/animation.service';
import { OwnerSpeechComponent } from "../about/owner-speech/owner-speech.component";
import { environment } from '../../environments/environment';
import { AboutUsService } from '../../services/about-us.service';
import { AboutUs } from '../../models/model';
import { ConsultantSliderComponent } from './consultent/consultant.component';
import { InteriorSliderComponent } from "./interior/interior.component";

@Component({
  selector: 'app-landowner',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LandownerHeroComponent,
    LandownerBenefitsComponent,
    LandownerFormComponent,
    OwnerSpeechComponent,
    ConsultantSliderComponent,
    InteriorSliderComponent
],
  templateUrl: './landowner.component.html',
  styleUrls: ['./landowner.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandownerComponent implements OnInit, AfterViewInit {
  baseUrl = environment.baseUrl;

  state: {
    about: {
      history?: string;
      ownerName?: string;
      ownerDesignation?: string;
      ownerSpeech?: string;
      ownerImage?: string;
      mission?: string;
      missionImage?: string;
      vision?: string;
      visionImage?: string;
    };
  } = {
    about: {
      history: '',
      ownerName: '',
      ownerDesignation: '',
      ownerSpeech: '',
      ownerImage: '',
      mission: '',
      missionImage: '',
      vision: '',
      visionImage: '',
    },
  };

  expandedSections: { [key: string]: boolean } = {
    history: true, // Open by default
    missionVision: false,
    ownerSpeech: false,
    team: false,
  };
  constructor(private aboutUsService: AboutUsService,private anim: AnimationService) {}

  ngAfterViewInit() {
    this.anim.animateOnScroll('.fade-up');
    this.anim.animateOnScroll('.zoom-in');
  }

  ngOnInit(): void {
    this.fetchAboutData();
  }

  fetchAboutData(): void {
    this.aboutUsService.getAboutUs().subscribe({
      next: (data: AboutUs[]) => {
        const about = data[0] || this.state.about;
        this.state.about = {
          history: about.history || '',
          ownerName: about.ownerName || '',
          ownerDesignation: about.ownerDesignation || '',
          ownerSpeech: about.ownerSpeech || '',
          ownerImage: about.ownerImage
            ? `${this.baseUrl}/api/attachment/get/${about.ownerImage}`
            : '/images/fallback.png',
          mission: about.mission || '',
          missionImage: about.missionImage
            ? `${this.baseUrl}/api/attachment/get/${about.missionImage}`
            : '/images/fallback.png',
          vision: about.vision || '',
          visionImage: about.visionImage
            ? `${this.baseUrl}/api/attachment/get/${about.visionImage}`
            : '/images/fallback.png',
        };
      },
      error: (error) => {
        this.aboutUsService.showError(
          `Failed to fetch About Us data: ${error.message || 'Unknown error'}`
        );
        console.error('Error fetching About Us:', error);
      },
    });
  }

  onImageError(event: Event, fallback = '/images/fallback.png'): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== fallback) {
      img.src = fallback;
    }
  }
}


