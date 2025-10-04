import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { RouterModule, Router } from '@angular/router';

interface ProjectCard {
  id: number;
  image: string;
  name: string;
  location: string;
  type: string;
}

@Component({
  selector: 'app-related-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './related-projects.component.html',
  styleUrls: ['./related-projects.component.css'],
})
export class RelatedProjectsComponent implements OnChanges {
  @Input() projects: any[] = [];
  @Input() baseUrl: string = '';
  @Output() imageError = new EventEmitter<Event>();

  cards: ProjectCard[] = [];

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects'] && this.projects) {
      this.cards = this.projects.map((project) => ({
        id: project.id,
        image: project.thumbnail
          ? `${this.baseUrl}/api/attachment/get/${project.thumbnail}`
          : 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
        name: project.name || 'Untitled Project',
        location: project.location || 'Unknown', // Use location instead of category
        type: project.type || '—',
      }));
    }
  }

  onImageError(event: Event): void {
    this.imageError.emit(event);
    const img = event.target as HTMLImageElement;
    img.src =
      'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg'; // Match SwiperSliderComponent fallback
  }

  onProjectSelect(projectId: number): void {
    this.router
      .navigate(['/projectdetails', projectId], {
        onSameUrlNavigation: 'reload',
      })
      .then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((err) => console.error('Navigation error:', err));
  }
}
