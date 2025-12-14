import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { HistoryComponent } from './history/history.component';
import { OwnerSpeechComponent } from './owner-speech/owner-speech.component';
import { MissionVisionComponent } from './mission-vision/mission-vision.component';
import { TeamModalComponent } from './team-modal/team-modal.component';
import { TeamService } from '../../services/team.service';
import { AboutUs, Team } from '../../models/model';
import { TeamComponent } from './team/team.component';
import { environment } from '../../environments/environment';
import { AboutUsService } from '../../services/about-us.service';
import { AnimationService } from '../../services/animation.service';



@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroSectionComponent,
    HistoryComponent,
    OwnerSpeechComponent,
    MissionVisionComponent,
    TeamComponent,
    TeamModalComponent,
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit, AfterViewInit {
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
      facebook?: string;
      linkedIn?: string;
      twitter?: string;
    };
    teams: Team[];
    selectedTeamMember: Team | null;
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
      twitter: '',
      linkedIn: '',
      facebook: '',
    },
    teams: [],
    selectedTeamMember: null,
  };

  expandedSections: { [key: string]: boolean } = {
    history: true, 
    missionVision: false,
    ownerSpeech: false,
    team: false,
  };

  isModalVisible = false;

  constructor(
    private aboutUsService: AboutUsService,
    private teamService: TeamService,
    private anim: AnimationService
  ) {}

  ngAfterViewInit() {
    this.anim.animateOnScroll('.fade-up');
    this.anim.animateOnScroll('.zoom-in');
  }

  ngOnInit(): void {
    this.fetchAboutData();
    this.fetchTeamMembers();
  }

  fetchAboutData(): void {
    this.aboutUsService.getAboutUs().subscribe({
      
      next: (data: AboutUs[]) => {
        console.log(data)
        const about = data[0] || this.state.about;
        this.state.about = {
          history: about.history || '',
          ownerName: about.ownerName || '',
          ownerDesignation: about.ownerDesignation || '',
          ownerSpeech: about.ownerSpeech || '',
          twitter: about.twitter || '',
          facebook: about.facebook || '',
          linkedIn: about.linkedIn || '',
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

  fetchTeamMembers(): void {
    this.teamService.getActiveTeams().subscribe({
      next: (data: Team[]) => {
        // 👈 API type, not Team
        this.state.teams = data.map<Team>((member) => ({
          id: String(member.id), // ✅ make it a string
          name: member.name,
          designation: member.designation,
          image: member.image
            ? `${this.baseUrl}/api/attachment/get/${member.image}`
            : '/images/fallback.png',
          description: member.description ?? '',
          facebook: member.facebook ?? '',
          twiter: member.twiter ?? '',
          linkthen: member.linkthen ?? '',
          isActive: member.isActive,
          order: member.order ?? 0, // keep order required
        }));
      },
      error: (error) => {
        this.teamService.showError(
          `Failed to fetch Team Members: ${error.message || 'Unknown error'}`
        );
        console.error('Error fetching Team Members:', error);
      },
    });
  }

  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  onToggle(member: Team | null = null): void {
    this.state.selectedTeamMember = member ? { ...member } : null;
    this.isModalVisible = !this.isModalVisible;
  }

  onImageError(event: Event, fallback = '/images/fallback.png'): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== fallback) {
      img.src = fallback;
    }
  }
}
