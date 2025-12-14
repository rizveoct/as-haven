import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  initSeoListener() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary')
      )
      .subscribe((route) => {
        const seoData = route.snapshot.data['seo'];
        if (seoData) {
          this.updateSeo(seoData);
        }
      });
  }

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateMetaTags(tags: MetaTag[]) {
    tags.forEach((tag) => {
      if (tag.name) {
        this.meta.updateTag({ name: tag.name, content: tag.content });
      } else if (tag.property) {
        this.meta.updateTag({ property: tag.property, content: tag.content });
      }
    });
  }

  updateSeo(config: SeoConfig) {
    // Update title
    this.updateTitle(config.title);

    // Prepare meta tags
    const tags: MetaTag[] = [
      { name: 'description', content: config.description },
      {
        name: 'keywords',
        content:
          config.keywords ||
          'real estate, Rajshahi, Bangladesh, property, developers',
      },
      { name: 'author', content: 'Ashaven Developers Ltd' },

      // Open Graph tags for social sharing
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:type', content: config.ogType || 'website' },
      { property: 'og:url', content: config.url || '' },
      {
        property: 'og:image',
        content: config.image || '/assets/images/ashaven-og-image.jpg',
      },
      { property: 'og:site_name', content: 'Ashaven Developers Ltd' },

      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: config.title },
      { name: 'twitter:description', content: config.description },
      {
        name: 'twitter:image',
        content: config.image || '/assets/images/ashaven-og-image.jpg',
      },

      // Additional SEO tags
      { name: 'robots', content: config.robots || 'index, follow' },
      { name: 'googlebot', content: 'index, follow' },
    ];

    if (config.canonical) {
      this.updateCanonicalUrl(config.canonical);
    }

    this.updateMetaTags(tags);
  }

  updateCanonicalUrl(url: string) {
    let link: HTMLLinkElement | null = document.querySelector(
      "link[rel='canonical']"
    );

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
  image?: string;
  ogType?: string;
  canonical?: string;
  robots?: string;
}
