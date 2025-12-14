import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BlogService } from '../../services/blog.service';
import { BlogSummary } from '../../models/model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-blog-slide',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-slide.component.html',
  styleUrl: './blog-slide.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogSlideComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('scrollWrapper') scrollWrapper?: ElementRef<HTMLDivElement>;
  @Output() scrollContainer = new EventEmitter<HTMLElement | null>();

  readonly blogs$ = new BehaviorSubject<BlogSummary[]>([]);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);
  readonly loadError$ = new BehaviorSubject<boolean>(false);
  readonly baseUrl = environment.baseUrl;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly blogService: BlogService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.scrollContainer.emit(this.scrollWrapper?.nativeElement ?? null);
    });
  }

  loadBlogs(): void {
    this.isLoading$.next(true);
    this.loadError$.next(false);

    this.blogService
      .getActiveBlogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blogs) => {
          this.blogs$.next(blogs ?? []);
          this.isLoading$.next(false);
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading$.next(false);
          this.loadError$.next(true);
          this.cdr.markForCheck();
        },
      });
  }

  trackById(_: number, item: BlogSummary): string {
    return item.id;
  }

  imageUrl(image?: string | null): string {
    if (!image) {
      return '/images/banner/banner-3.png';
    }

    return `${this.baseUrl}/api/attachment/get/${image}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
