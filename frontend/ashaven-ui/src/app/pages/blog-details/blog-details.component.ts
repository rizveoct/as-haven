import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  signal,
  ChangeDetectionStrategy,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { AnimationService } from '../../services/animation.service';
import { fromEvent, Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  baseURL = environment.baseUrl;
  blogId!: string;

  data = signal<any>(null);
  list = signal<any[]>([]);
  countdowns = signal<string[]>([]);
  countdown = signal<any>(null);
  offerActive = signal<boolean>(true);
  private readonly destroy$ = new Subject<void>();
  private countdownIntervalId: ReturnType<typeof setInterval> | null = null;
  private resizeObserver?: ResizeObserver;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private el: ElementRef,
    private anim: AnimationService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.blogId = this.route.snapshot.paramMap.get('id') || '';
    this.getBlog();
    this.getBlogs();
  }


  ngAfterViewInit() {
    this.anim.animateOnScroll('.fade-up');
    this.anim.animateOnScroll('.zoom-in');
    const blogRow = this.el.nativeElement.querySelector('#blogRow');
    const image = this.el.nativeElement.querySelector('#blogImage');

    if (blogRow && image) {
      const updateHeight = () => {
        blogRow.style.minHeight = image.offsetHeight + 'px';
      };

      updateHeight();

      this.zone.runOutsideAngular(() => {
        this.resizeObserver = new ResizeObserver(() => updateHeight());
        this.resizeObserver.observe(image);
      });

      this.zone.runOutsideAngular(() => {
        fromEvent(window, 'resize')
          .pipe(auditTime(150), takeUntil(this.destroy$))
          .subscribe(() => updateHeight());
      });
    }
  }

  getBlog() {
    this.http
      .get(`${this.baseURL}/api/website/getsingleblog?blogId=${this.blogId}`)
      .subscribe({
        next: (res: any) => {
          this.data.set({
            ...res,
            image: res.image
              ? `${this.baseURL}/api/attachment/get/${res.image}`
              : '/images/fallback.png',
          });
          this.startCountdown();
        },
        error: (error) => {
          console.error('Error fetching blog:', error);
        },
      });
  }

  getBlogs() {
    this.http.get(`${this.baseURL}/api/website/getblogs`).subscribe({
      next: (res: any) => {
        this.list.set(
          res.map((item: any) => ({
            ...item,
            image: item.image
              ? `${this.baseURL}/api/attachment/get/${item.image}`
              : '/images/fallback.png',
            picture: item.picture
              ? `${this.baseURL}/api/attachment/get/${item.picture}`
              : '/images/fallback.png',
          }))
        );
        this.startCountdown();
      },
      error: (error) => {
        console.error('Error fetching blogs:', error);
      },
    });
  }

  startCountdown() {
    this.updateCountdowns();
    if (this.countdownIntervalId) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.countdownIntervalId = setInterval(() => {
        this.zone.run(() => this.updateCountdowns());
      }, 1000);
    });
  }

  updateCountdowns() {
    const now = new Date();

    const blog = this.data();
    if (!blog || !blog.offerDate) {
      this.offerActive.set(false);
      this.countdown.set(null);
    } else {
      const diff = new Date(blog.offerDate).getTime() - now.getTime();
      if (diff > 0) {
        this.countdown.set(this.calcTime(diff));
        this.offerActive.set(true);
      } else {
        this.countdown.set(this.zeroTime());
        this.offerActive.set(false);
      }
    }

    this.countdowns.set(
      this.list().map((item) => {
        if (!item.offerDate) return 'No Offer';
        const diff = new Date(item.offerDate).getTime() - now.getTime();
        return diff > 0
          ? `${this.pad(Math.floor(diff / 86400000))} Days ${this.pad(
              Math.floor((diff / 3600000) % 24)
            )}:${this.pad(Math.floor((diff / 60000) % 60))}:${this.pad(
              Math.floor((diff / 1000) % 60)
            )}`
          : 'Offer Expired';
      })
    );
  }

  calcTime(diff: number) {
    return {
      days: this.pad(Math.floor(diff / 86400000)),
      hours: this.pad(Math.floor((diff / 3600000) % 24)),
      minutes: this.pad(Math.floor((diff / 60000) % 60)),
      seconds: this.pad(Math.floor((diff / 1000) % 60)),
    };
  }

  zeroTime() {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  }

  pad(n: number) {
    return String(n).padStart(2, '0');
  }

  onImageError(event: Event, fallback = '/images/fallback.png') {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== fallback) {
      img.src = fallback;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = null;
    }

    this.resizeObserver?.disconnect();
  }
}
