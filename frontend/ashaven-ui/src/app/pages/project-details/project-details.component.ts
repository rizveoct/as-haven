import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LenisService } from '../../services/lenis.service';
import { ProjectHeaderComponent } from './project-header/project-header.component';
import { OfferTimerComponent } from './offer-timer/offer-timer.component';
import { MarqueeComponent } from './marquee/marquee.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { AtGlanceComponent } from './at-glance/at-glance.component';
import { FeatureAmenitiesComponent } from './feature-amenities/feature-amenities.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { ProjectGalleryComponent } from './project-gallery/project-gallery.component';
import { LocationMapComponent } from './location-map/location-map.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { environment } from '../../environments/environment';
import { SwiperSliderComponent } from './swiper-slider/swiper-slider.component';
import { ScrollToTopComponent } from "../../components/scroll-to-top/scroll-to-top.component";
import { Project } from '../../models/model';


interface Feature {
  id: number | string;
  title: string;
  icon: string;
}

interface GalleryItem {
  content: string;
  contentType: 'Image' | 'Video';
}

interface RelatedProject {
  id: string;
  name: string;
  category: string;
  type: string;
  thumbnail: string;
}

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProjectHeaderComponent,
    OfferTimerComponent,
    AtGlanceComponent,
    FeatureAmenitiesComponent,
    VideoPlayerComponent,
    ProjectGalleryComponent,
    LocationMapComponent,
    ContactFormComponent,
    SwiperSliderComponent,
],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  baseUrl = environment.baseUrl;
  state = {
    list: [] as Feature[],
    gallery: [] as GalleryItem[],
    projects: [] as RelatedProject[],
    data: null as Project | null,
    timer: {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    },
    offerActive: false,
  };
  projectId: string | null = null;
  private timerInterval: any;
  private paramSubscription: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private lenisService: LenisService
  ) {}

  ngOnInit(): void {
    this.paramSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.projectId = params.get('id');
        if (this.projectId) {
          this.getProject();
          this.getFeatures();
          this.getGallery();
          this.getProjects();
        } else {
          this.toastr.error('Invalid project ID.', 'Error');
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }

  startOfferTimer(): void {
    if (!this.state.data || !this.state.data.offerDateTime) {
      this.state.offerActive = false;
      this.toastr.info('No active offer for this project.', 'Info');
      return;
    }

    const offerDateTime = new Date(this.state.data.offerDateTime).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const timeLeft = offerDateTime - now;

      if (timeLeft <= 0) {
        this.state.timer.days = '00';
        this.state.timer.hours = '00';
        this.state.timer.minutes = '00';
        this.state.timer.seconds = '00';
        this.state.offerActive = false;
        clearInterval(this.timerInterval);
        this.toastr.info('Offer has expired.', 'Info');
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      this.state.timer.days = String(days).padStart(2, '0');
      this.state.timer.hours = String(hours).padStart(2, '0');
      this.state.timer.minutes = String(minutes).padStart(2, '0');
      this.state.timer.seconds = String(seconds).padStart(2, '0');
    };

    this.state.offerActive = true;
    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  getProject(): void {
    if (!this.projectId) {
      this.toastr.error('Invalid project ID.', 'Error');
      return;
    }
    this.http
      .get<Project>(
        `${this.baseUrl}/api/website/getsingleproject?projectId=${this.projectId}`
      )
      .subscribe({
        next: (data) => {
          this.state.data = data;
          this.startOfferTimer();
        },
        error: (err) => {
          console.error('Error fetching project:', err);
          this.toastr.error('Failed to load project details.', 'Error');
        },
      });
  }

  getFeatures(): void {
    if (!this.projectId) return;
    this.http
      .get<Feature[]>(
        `${this.baseUrl}/api/website/getprojectfeatures?projectId=${this.projectId}`
      )
      .subscribe({
        next: (data) => (this.state.list = data),
        error: (err) => {
          console.error('Error fetching features:', err);
          this.toastr.error('Failed to load project features.', 'Error');
        },
      });
  }

  getGallery(): void {
    if (!this.projectId) return;
    this.http
      .get<GalleryItem[]>(
        `${this.baseUrl}/api/website/getgalleries?projectId=${this.projectId}`
      )
      .subscribe({
        next: (data) => {
          console.log('Gallery data:', data);
          this.state.gallery = data;
          if (!data.length) {
            this.toastr.info(
              'No gallery items available for this project.',
              'Info'
            );
          } else {
            this.state.gallery.forEach((item) => {
              console.log(
                'Gallery item URL:',
                `${this.baseUrl}/api/attachment/get/${item.content}`
              );
            });
          }
        },
        error: (err) => {
          console.error('Error fetching gallery:', err);
          this.toastr.error(
            'Failed to load gallery. Please try again.',
            'Error'
          );
        },
      });
  }

  getProjects(): void {
    this.http
      .get<RelatedProject[]>(`${this.baseUrl}/api/website/getprojects`)
      .subscribe({
        next: (data) => {
          this.state.projects = data;
          console.log('Related projects fetched:', this.state.projects);
        },
        error: (err) => {
          console.error('Error fetching projects:', err);
          this.toastr.error('Failed to load related projects.', 'Error');
        },
      });
  }

  onFormSubmit(): void {
    const formData = {
      name: (document.getElementById('name') as HTMLInputElement)?.value,
      email: (document.getElementById('email') as HTMLInputElement)?.value,
      phone: (document.getElementById('phone') as HTMLInputElement)?.value,
      subject: (document.getElementById('subject') as HTMLTextAreaElement)
        ?.value,
      message: (document.getElementById('message') as HTMLTextAreaElement)
        ?.value,
    };

    this.http
      .post(`${this.baseUrl}/api/website/createcontactus`, formData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe({
        next: (response: any) => {
          this.toastr.success(
            response.message || 'Form submitted successfully!',
            'Success'
          );
        },
        error: (err) => {
          this.toastr.error('Error submitting form.', 'Error');
          console.error('Error submitting form:', err);
        },
      });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== '/images/fallback.png') {
      img.src = '/images/fallback.png';
      console.log('Image error, using fallback:', img.src);
    }
  }

  scrollToContactForm() {
    const contactForm = document.getElementById('contacting');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
