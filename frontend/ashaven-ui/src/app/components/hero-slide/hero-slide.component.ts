import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { ProjectService } from '../../services/project.service';
import { RouterLink } from '@angular/router';

interface Slide {
  id: number | string;
  image: string;
  alt: string;
  author: string;
  title: string;
  topic: string;
  des: string;
  thumbnailTitle: string;
  thumbnailDescription: string;
}

@Component({
  selector: 'app-hero-slide',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-slide.component.html',
  styleUrls: ['./hero-slide.component.css'],
  providers: [ProjectService],
})
export class HeroSlideComponent implements OnInit, OnDestroy {
  slides: Slide[] = [];
  currentIndex: number = 0;
  timeRunning = 2000;
  timeAutoNext = 5000;
  runTimeOut: any;
  runNextAuto: any;
  baseUrl = environment.baseUrl;
  isMobile: boolean = window.innerWidth < 768;

  constructor(private projectService: ProjectService) {}

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit(): void {
    this.projectService.getActiveProjects().subscribe((projects) => {
      this.slides = projects.map((project) => ({
        id: project.id,
        image: project.thumbnail
          ? `${this.baseUrl}/api/attachment/get/${project.thumbnail}`
          : 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
        alt: project.name || 'Project image',
        author: project.category || 'Unknown Category',
        title: project.name || 'Untitled Project',
        topic: project.type || 'Project Type',
        des: `Explore our ${project.name || 'latest project'} in ${
          project.category || 'various'
        } settings.`,
        thumbnailTitle: project.name || 'Untitled',
        thumbnailDescription: project.category || 'Category',
      }));
      this.startAutoSlide();
    });

    const nextMobile = document.getElementById('next-mobile');
    const prevMobile = document.getElementById('prev-mobile');
    if (nextMobile) {
      nextMobile.onclick = () => this.showSlider('next');
    }
    if (prevMobile) {
      prevMobile.onclick = () => this.showSlider('prev');
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  showSlider(type: 'next' | 'prev'): void {
    const carouselDom = document.querySelector('.carousel');
    const sliderDom = carouselDom?.querySelector('.carousel .list');
    const thumbnailBorderDom = carouselDom?.querySelector(
      '.carousel .thumbnail'
    );
    const sliderItemsDom = sliderDom?.querySelectorAll('.carousel .list .item');
    const thumbnailItemsDom = thumbnailBorderDom?.querySelectorAll(
      '.carousel .thumbnail .item'
    );

    if (
      !sliderDom ||
      !thumbnailBorderDom ||
      !sliderItemsDom ||
      !thumbnailItemsDom
    )
      return;

    this.clearTimers();

    if (type === 'next') {
      sliderDom.appendChild(sliderItemsDom[0]);
      thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
      carouselDom?.classList.add('next');
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    } else {
      sliderDom.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
      thumbnailBorderDom.prepend(
        thumbnailItemsDom[thumbnailItemsDom.length - 1]
      );
      carouselDom?.classList.add('prev');
      this.currentIndex =
        (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    }

    this.runTimeOut = setTimeout(() => {
      carouselDom?.classList.remove('next', 'prev');
    }, this.timeRunning);

    this.startAutoSlide();
    this.scrollThumbnailToActive();
  }

  goToSlide(index: number): void {
    const carouselDom = document.querySelector('.carousel');
    const sliderDom = carouselDom?.querySelector('.carousel .list');
    const thumbnailBorderDom = carouselDom?.querySelector(
      '.carousel .thumbnail'
    );
    const sliderItemsDom = sliderDom?.querySelectorAll('.carousel .list .item');
    const thumbnailItemsDom = thumbnailBorderDom?.querySelectorAll(
      '.carousel .thumbnail .item'
    );

    if (
      !sliderDom ||
      !thumbnailBorderDom ||
      !sliderItemsDom ||
      !thumbnailItemsDom
    )
      return;

    this.clearTimers();

    const currentIndex = Array.from(sliderItemsDom).findIndex((item) =>
      item.classList.contains('active')
    );
    const direction = index > currentIndex ? 'next' : 'prev';

    while (Array.from(sliderItemsDom)[0] !== sliderItemsDom[index]) {
      if (direction === 'next') {
        sliderDom.appendChild(sliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
      } else {
        sliderDom.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(
          thumbnailItemsDom[thumbnailItemsDom.length - 1]
        );
      }
    }

    carouselDom?.classList.add(direction);
    this.currentIndex = index;

    this.runTimeOut = setTimeout(() => {
      carouselDom?.classList.remove('next', 'prev');
    }, this.timeRunning);

    this.startAutoSlide();
    this.scrollThumbnailToActive();
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.startAutoSlide();
    this.scrollThumbnailToActive();
  }

  prev(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.startAutoSlide();
    this.scrollThumbnailToActive();
  }

  setCurrentIndex(index: number): void {
    this.currentIndex = index;
    this.startAutoSlide();
    this.scrollThumbnailToActive();
  }

  private scrollThumbnailToActive(): void {
    if (!this.isMobile) {
      const thumbnailContainer = document.querySelector('.thumbnails');
      const activeThumbnail = document.querySelector(
        `.thumbnail-item:nth-child(${this.currentIndex + 1})`
      );
      if (thumbnailContainer && activeThumbnail) {
        const offsetTop =
          activeThumbnail.getBoundingClientRect().top -
          thumbnailContainer.getBoundingClientRect().top;
        thumbnailContainer.scrollTo({
          top: offsetTop + thumbnailContainer.scrollTop,
          behavior: 'smooth',
        });
      }
    }
  }

  private startAutoSlide(): void {
    this.clearTimers();
    this.runNextAuto = setTimeout(() => {
      if (this.isMobile) {
        this.showSlider('next');
      } else {
        this.next();
      }
    }, this.timeAutoNext);
  }

  private clearTimers(): void {
    if (this.runTimeOut) {
      clearTimeout(this.runTimeOut);
    }
    if (this.runNextAuto) {
      clearTimeout(this.runNextAuto);
    }
  }

  debugClick(event: Event): void {
    console.log('Button clicked:', event);
  }
}
