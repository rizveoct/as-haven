import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterOutlet,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { FloatingSocialComponent } from './components/floating-social/floating-social.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingService } from './services/loading.service';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { Title, Meta } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    FloatingSocialComponent,
    LoadingComponent,
    ScrollToTopComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private ngZone: NgZone
  ) {
    // Move loading spinner subscription outside Angular to reduce unnecessary change detection
    this.ngZone.runOutsideAngular(() => {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loadingService.show();
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.loadingService.hide();
        }
      });
    });
  }

  ngOnInit(): void {
    // SEO updates inside Angular zone
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        if (data['title']) this.titleService.setTitle(data['title']);
        if (data['description']) {
          this.metaService.updateTag({
            name: 'description',
            content: data['description'],
          });
        }
      });
  }

  hideLayout(): boolean {
    return (
      this.router.url.startsWith('/dashboard') ||
      this.router.url.startsWith('/login')
    );
  }
}
