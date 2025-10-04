import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface ExploreItem {
  id: number;
  title: string;
  route: string;
  image: string;
}

@Component({
  selector: 'app-project-explore',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-explore.component.html',
  styleUrls: ['./project-explore.component.css'],
})
export class ProjectExploreComponent {
  projects: ExploreItem[] = [
    {
      id: 1,
      title: 'Ongoing Residences',
      route: '/projects',
      image: 'images/icons/hook.png',
    },
    {
      id: 2,
      title: 'Upcoming Landmark',
      route: '/projects',
      image: 'images/icons/coming-soon.png',
    },
    {
      id: 3,
      title: 'Completed Masterpieces',
      route: '/projects',
      image: 'images/icons/architect.png',
    },
    {
      id: 4,
      title: 'Entire Portfolio',
      route: '/projects',
      image: 'images/icons/architect.png',
    },
  ];

  onMouseMove(event: MouseEvent) {
    const wrapper = event.currentTarget as HTMLElement | null;
    const card = wrapper?.querySelector(
      '.luxe-explore__inner'
    ) as HTMLElement | null;
    if (!wrapper || !card) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -10;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  }

  onMouseLeave(event: MouseEvent) {
    const wrapper = event.currentTarget as HTMLElement | null;
    const card = wrapper?.querySelector(
      '.luxe-explore__inner'
    ) as HTMLElement | null;
    if (!card) {
      return;
    }

    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  }
}
