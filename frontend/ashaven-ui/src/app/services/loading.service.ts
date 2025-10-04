import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private timer: any;
  private minTime = 1500; // Minimum time to show loader in ms
  private startTime = 0;

  show() {
    this.startTime = Date.now();
    this.loadingSubject.next(true);
  }

  hide() {
    const elapsed = Date.now() - this.startTime;
    const remaining = this.minTime - elapsed;

    if (remaining > 0) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.loadingSubject.next(false);
      }, remaining);
    } else {
      this.loadingSubject.next(false);
    }
  }
}
