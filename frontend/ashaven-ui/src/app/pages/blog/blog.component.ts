import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BlogService } from '../../services/blog.service';
import { BlogSummary } from '../../models/model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent implements OnInit, OnDestroy {
  readonly blogs$ = new BehaviorSubject<BlogSummary[]>([]);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);
  readonly loadError$ = new BehaviorSubject<boolean>(false);
  readonly baseUrl = environment.baseUrl;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
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
        },
        error: () => {
          this.isLoading$.next(false);
          this.loadError$.next(true);
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
