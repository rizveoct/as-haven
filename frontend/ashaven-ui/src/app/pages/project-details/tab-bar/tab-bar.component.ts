import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollService } from '../../../services/scroll.service';
import { LenisService } from '../../../services/lenis.service';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.css'],
})
export class TabBarComponent implements OnInit, OnDestroy {
  activeTab: string = '';
  lastScrollTop = 0;
  showRight = false;

  sections = [
    { id: 'atGlance', label: 'At a Glance' },
    { id: 'featureAndAmenities', label: 'Feature & Amenities' },
    { id: 'videoPlayer', label: 'Video' },
    { id: 'projectGallery', label: 'Gallery' },
    { id: 'locationMap', label: 'Location Map' },
    { id: 'contacting', label: 'Contact' },
    { id: 'relatedProjects', label: 'More Projects' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private scrollService: ScrollService,
    private lenisService: LenisService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.scrollService.scrollY$
      .pipe(takeUntil(this.destroy$))
      .subscribe((scrollTop) => {
        this.updateForScroll(scrollTop);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateForScroll(scrollTop: number) {
    const shouldShow = scrollTop > 50;

    const offset = scrollTop + window.innerHeight / 3;
    let nextActive = this.activeTab;
    for (const section of this.sections) {
      const el = document.getElementById(section.id);
      if (
        el &&
        el.offsetTop <= offset &&
        el.offsetTop + el.offsetHeight > offset
      ) {
        nextActive = section.id;
        break;
      }
    }

    const shouldUpdateActive = nextActive !== this.activeTab;
    const shouldUpdateVisibility = shouldShow !== this.showRight;

    if (shouldUpdateActive || shouldUpdateVisibility) {
      this.zone.run(() => {
        if (shouldUpdateVisibility) {
          this.showRight = shouldShow;
        }
        if (shouldUpdateActive) {
          this.activeTab = nextActive;
        }
      });
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  scrollToSection(sectionId: string) {
    this.lenisService.scrollTo(`#${sectionId}`, { duration: 0.8 });
    this.activeTab = sectionId;
  }
}
