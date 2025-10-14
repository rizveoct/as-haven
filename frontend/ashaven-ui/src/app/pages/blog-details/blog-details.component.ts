import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BlogService } from '../../services/blog.service';
import { BlogSummary } from '../../models/model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailsComponent implements OnInit, OnDestroy {
  readonly blog$ = new BehaviorSubject<BlogSummary | null>(null);
  readonly relatedBlogs$ = new BehaviorSubject<BlogSummary[]>([]);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);
  readonly loadError$ = new BehaviorSubject<boolean>(false);
  readonly baseUrl = environment.baseUrl;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.isLoading$.next(true);
          this.loadError$.next(false);
        }),
        map((params) => params.get('id')),
        filter((id): id is string => !!id),
        switchMap((id) =>
          combineLatest([
            this.blogService.getBlogDetails(id),
            this.blogService.getActiveBlogs(),
          ])
        )
      )
      .subscribe({
        next: ([detail, all]) => {
          if (!detail) {
            this.blog$.next(null);
            this.relatedBlogs$.next([]);
            this.isLoading$.next(false);
            this.loadError$.next(true);
            return;
          }

          this.blog$.next(detail);
          this.relatedBlogs$.next(
            (all || []).filter((item) => item.id !== detail.id).slice(0, 3)
          );
          this.isLoading$.next(false);
        },
        error: () => {
          this.isLoading$.next(false);
          this.loadError$.next(true);
        },
      });
  }

  imageUrl(image?: string | null): string {
    if (!image) {
      return '/images/banner/banner-3.png';
    }

    return `${this.baseUrl}/api/attachment/get/${image}`;
  }

  backgroundImage(image?: string | null): string {
    return `url(${this.imageUrl(image)})`;
  }

  trackById(_: number, item: BlogSummary): string {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
