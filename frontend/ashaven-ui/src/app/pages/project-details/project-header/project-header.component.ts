import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type HeroStat = { label: string; value: string };

@Component({
  selector: 'app-project-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-header.component.html',
  styleUrls: ['./project-header.component.css'],
})
export class ProjectHeaderComponent {
  @Input() project: any;
  @Input() baseUrl: string = '';

  get heroImage(): string {
    if (this.project?.thumbnail && this.project?.content) {
      return `url(${this.baseUrl}/api/attachment/get/${this.project.thumbnail})`;
    }
    return 'url(/images/fallback.png)';
  }

  get heroStats(): HeroStat[] {
    const stats: { label: string; value: unknown }[] = [
      { label: 'Land Area', value: this.project?.landArea },
      { label: 'Floors', value: this.project?.height },
      { label: 'Apartments', value: this.project?.numberOfApartments },
      { label: 'Parking', value: this.project?.numberOfParking },
      { label: 'Units / Floor', value: this.project?.unitPerFloors },
    ];

    return stats
      .filter((stat) => {
        if (stat.value === null || stat.value === undefined) {
          return false;
        }
        return `${stat.value}`.trim().length > 0;
      })
      .slice(0, 4)
      .map((stat) => ({ label: stat.label, value: `${stat.value}` }));
  }

  get location(): string {
    return this.project?.address || 'No address available';
  }

  get projectTypeBadge(): string | null {
    if (!this.project?.type) {
      return null;
    }
    return `${this.project.type} Collection`;
  }

  get projectTitle(): string {
    return this.project?.name || 'Project Details';
  }
}
