import {
  Component,
  OnInit,
  signal,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BlogCardComponent } from "../blog-card/blog-card.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog-slide',
  standalone: true,
  imports: [BlogCardComponent, CommonModule, RouterModule],
  templateUrl: './blog-slide.component.html',
  styleUrl: './blog-slide.component.css',
})
export class BlogSlideComponent implements OnInit, AfterViewInit, OnDestroy {
  baseURL = environment.baseUrl;
  list = signal<any[]>([]);
  countdowns = signal<string[]>([]);
  @Output() scrollContainer = new EventEmitter<HTMLElement>();
  private countdownInterval?: ReturnType<typeof setInterval>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getBlogs();
  }

  ngAfterViewInit() {
    // Emit the scrollable container to the parent
    const container = document.querySelector('.blog-slider-container') as HTMLElement;
    if (container) {
      this.scrollContainer.emit(container);
    }
  }

  getBlogs() {
    this.http
      .get(`${this.baseURL}/api/website/getblogs`)
      .subscribe((res: any) => {
        this.list.set(res);
        this.startCountdown();
      });
  }

  startCountdown() {
    this.updateCountdowns();
    this.clearCountdown();
    this.countdownInterval = setInterval(() => this.updateCountdowns(), 1000);
  }

  updateCountdowns() {
    const now = new Date();
    this.countdowns.set(
      this.list().map((item) => {
        if (!item.offerDate) return 'No Offer';
        const diff = new Date(item.offerDate).getTime() - now.getTime();
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          return `${this.pad(days)} Days ${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
        } else {
          return 'Offer Expired';
        }
      })
    );
  }

  pad(n: number) {
    return String(n).padStart(2, '0');
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }

  private clearCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
  }
}
