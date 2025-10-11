import { Injectable, NgZone } from '@angular/core';
import { Observable, of, fromEvent } from 'rxjs';
import { map, startWith, throttleTime, distinctUntilChanged, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  readonly scrollY$: Observable<number>;

  constructor(private zone: NgZone) {
    if (typeof window === 'undefined') {
      this.scrollY$ = of(0);
      return;
    }

    this.scrollY$ = this.zone.runOutsideAngular(() =>
      fromEvent(window, 'scroll', { passive: true }).pipe(
        throttleTime(50, undefined, { leading: true, trailing: true }),
        map(() => window.scrollY || window.pageYOffset || 0),
        startWith(window.scrollY || window.pageYOffset || 0),
        distinctUntilChanged(),
        shareReplay({ bufferSize: 1, refCount: true })
      )
    );
  }
}
