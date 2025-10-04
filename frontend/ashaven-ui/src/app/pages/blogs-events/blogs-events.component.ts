
// import { HttpClient } from '@angular/common/http'; // Commented out
// import { environment } from '../../environments/environment'; // Commented out


  // baseUrl = environment.apiBaseUrl; // Commented out

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';

interface BlogItem {
  id: number | string;
  title: string;
  image?: string;
  picture?: string;
  name?: string;
  postedDate: string; // ISO string
  offerDate?: string; // ISO string
  category?: string;
  readTime?: string;
}

@Component({
  selector: 'app-blogs-events',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blogs-events.component.html',
  styleUrls: ['./blogs-events.component.css'],
})
export class BlogsEventsComponent implements OnInit, OnDestroy {
  baseUrl = 'https://dummy.com'; // Replace with real environment variable if available

  state: {
    list: BlogItem[];
    countdowns: string[];
  } = {
    list: [
      {
        id: 1,
        title: 'First Blog Post',
        image: 'dummy-blog-1.jpg',
        picture: 'dummy-author-1.jpg',
        name: 'John Doe',
        postedDate: '2025-07-15T10:00:00Z',
        offerDate: '2025-08-10T10:00:00Z',
        category: 'Updates',
        readTime: '4 min read',
      },
      {
        id: 2,
        title: 'Event Announcement',
        image: 'dummy-blog-2.jpg',
        picture: 'dummy-author-2.jpg',
        name: 'Jane Smith',
        postedDate: '2025-07-20T14:00:00Z',
        offerDate: '2025-08-05T10:00:00Z',
        category: 'Events',
        readTime: '2 min read',
      },
    ],
    countdowns: [],
  };

  private countdownSub?: Subscription;

  ngOnInit(): void {
    this.initializeCountdowns();
  }

  ngOnDestroy(): void {
    this.countdownSub?.unsubscribe();
  }

  private initializeCountdowns(): void {
    this.updateCountdowns(); // initial
    this.countdownSub = interval(1000).subscribe(() => this.updateCountdowns());
  }

  private formatDiff(diffMs: number): string {
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  private updateCountdowns(): void {
    const now = new Date().getTime();
    this.state.countdowns = this.state.list.map((item) => {
      if (!item.offerDate) return '—';
      const offerTime = new Date(item.offerDate).getTime();
      const diff = offerTime - now;
      if (diff > 0) {
        return this.formatDiff(diff);
      } else {
        return 'Offer Expired';
      }
    });
  }

  isSoon(offerDate?: string): boolean {
    if (!offerDate) return false;
    const now = Date.now();
    const diff = new Date(offerDate).getTime() - now;
    return diff > 0 && diff < 1000 * 60 * 60 * 6; // less than 6 hours
  }

  onImageError(
    event: Event,
    fallback: string = '/images/fallback-avatar.svg'
  ): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== fallback) {
      img.src = fallback;
    }
  }

  // Optional helper to derive accent color per category (used in template if desired)
  categoryAccent(category?: string): string {
    switch ((category || '').toLowerCase()) {
      case 'events':
        return 'from-green-400 to-teal-500';
      case 'updates':
        return 'from-indigo-400 to-purple-500';
      default:
        return 'from-blue-400 to-indigo-500';
    }
  }
}
