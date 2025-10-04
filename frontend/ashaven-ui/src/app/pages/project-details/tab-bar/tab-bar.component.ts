import { Component, HostListener } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.css'],
})
export class TabBarComponent {
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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Show only if scroll > 50px
    this.showRight = scrollTop > 50;

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    // Highlight active tab
    const offset = scrollTop + window.innerHeight / 3;
    for (const section of this.sections) {
      const el = document.getElementById(section.id);
      if (
        el &&
        el.offsetTop <= offset &&
        el.offsetTop + el.offsetHeight > offset
      ) {
        this.activeTab = section.id;
        break;
      }
    }
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeTab = sectionId;
    }
  }
}
