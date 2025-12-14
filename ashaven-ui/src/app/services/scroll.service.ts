import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, shareReplay, throttleTime } from 'rxjs/operators';
import { LenisService } from './lenis.service';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  readonly scrollY$: Observable<number>;

  constructor(private zone: NgZone, private lenisService: LenisService) {
    if (typeof window === 'undefined') {
      this.scrollY$ = of(0);
      return;
    }

    this.scrollY$ = this.zone.runOutsideAngular(() =>
      this.lenisService.scroll$.pipe(
        throttleTime(50, undefined, { leading: true, trailing: true }),
        distinctUntilChanged(),
        shareReplay({ bufferSize: 1, refCount: true })
      )
    );
  }
}
