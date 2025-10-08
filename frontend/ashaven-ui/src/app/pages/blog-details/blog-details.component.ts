import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  signal,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { AnimationService } from '../../services/animation.service';



@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css'],
})
export class BlogDetailsComponent implements OnInit, OnDestroy {
  baseURL = environment.baseUrl;
  blogId!: string;

  data = signal<any>(null);
  list = signal<any[]>([]);
  countdowns = signal<string[]>([]);
  countdown = signal<any>(null);
  offerActive = signal<boolean>(true);
  private countdownInterval?: ReturnType<typeof setInterval>;
  private resizeObserver?: ResizeObserver;
  private resizeListener?: () => void;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2,
    private anim: AnimationService
  ) {}

  ngOnInit() {
    this.blogId = this.route.snapshot.paramMap.get('id') || '';
    this.getBlog();
    this.getBlogs();
  }


  ngAfterViewInit() {
    //this.animateOnScroll();

    this.anim.animateOnScroll('.fade-up');
    this.anim.animateOnScroll('.zoom-in');
    const blogRow = this.el.nativeElement.querySelector('#blogRow');
    const image = this.el.nativeElement.querySelector('#blogImage');

    if (blogRow && image) {
      const updateHeight = () => {
        blogRow.style.minHeight = image.offsetHeight + 'px';
      };

      // Initial set
      updateHeight();

      // Watch for image resize (responsive)
      this.resizeObserver = new ResizeObserver(() => updateHeight());
      this.resizeObserver.observe(image);

      // Also adjust on window resize
      this.resizeListener = () => updateHeight();
      window.addEventListener('resize', this.resizeListener);
    }
  }

  getBlog() {
    this.http
      .get(`${this.baseURL}/api/website/getsingleblog?blogId=${this.blogId}`)
      .subscribe({
        next: (res: any) => {
          console.log('Blog API Response:', res); // Debug response
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
    this.clearCountdown();
    this.countdownInterval = setInterval(() => this.updateCountdowns(), 1000);
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
    this.clearCountdown();

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }

    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = undefined;
    }
  }

  private clearCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
  }
}
