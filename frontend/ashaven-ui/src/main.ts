import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { LenisService } from './app/services/lenis.service';
import { register } from 'swiper/element/bundle';
import 'aos/dist/aos.css';

register();

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig?.providers ?? []),
    provideAnimations(),
    provideHttpClient(),
    provideToastr(),
    LenisService,
  ],
}).catch((err) => console.error(err));
