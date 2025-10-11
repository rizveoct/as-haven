import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
// import { LenisService } from '../../services/lenis.service';

interface ProjectItem {
  id: number | string;
  name: string;
  category: string;
  type: string;
  thumbnail: string;
  address: string;
  canSchedule?: boolean;
  order: number;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChild('categorySelect') categorySelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('typeSelect') typeSelect!: ElementRef<HTMLSelectElement>;

  scrollY = 0;
  baseUrl = environment.baseUrl;

  state = {
    list: [] as ProjectItem[],
  };

  constructor(
    private http: HttpClient,
    // private lenisService: LenisService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    // Read category from query params (e.g., /projects?category=Ongoing)
    this.route.queryParams.subscribe((params) => {
      const category = params['category'] || 'all';

      if (this.categorySelect) {
        this.categorySelect.nativeElement.value = category;
      }

      // Fetch projects with the pre-set filter
      this.getActiveProjects();
    });
  }

  getActiveProjects(): void {
    const category = this.categorySelect?.nativeElement.value || 'all';
    const type = this.typeSelect?.nativeElement.value || 'all';

    const params = new URLSearchParams();
    if (category !== 'all') params.append('category', category);
    if (type !== 'all') params.append('type', type);

    this.http
      .get<ProjectItem[]>(
        `${this.baseUrl}/api/website/getprojects?${params.toString()}`
      )
      .subscribe({
        next: (data) => {
          this.state.list = data.sort((a, b) => {
            // Put items without order at the bottom
            if (a.order == null && b.order == null) return 0;
            if (a.order == null) return 1;
            if (b.order == null) return -1;

            return a.order - b.order; // ascending
          });

          if (!data.length) {
            this.toastr.info(
              'No projects match your filters. Try adjusting criteria.',
              'No Results'
            );
          }
        },
        error: (err) => {
          console.error('Error fetching projects:', err);
          this.state.list = [];
          this.toastr.error(
            'Failed to load projects. Please try again.',
            'Error'
          );
        },
      });
  }

  resetFilters(): void {
    if (this.categorySelect) this.categorySelect.nativeElement.value = 'all';
    if (this.typeSelect) this.typeSelect.nativeElement.value = 'all';
    this.getActiveProjects();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== '/images/fallback.png') {
      img.src = '/images/fallback.png';
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.scrollY = window.scrollY;
  }
}
