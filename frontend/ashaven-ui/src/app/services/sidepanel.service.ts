import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidePanelService {
  open$ = signal(false);

  toggle() {
    console.log('Side panel toggled'); // Debug log
    this.open$.set(!this.open$());
  }

  open() {
    console.log('Side panel opened'); // Debug log
    this.open$.set(true);
  }

  close() {
    console.log('Side panel closed, stack trace:', new Error().stack); // Log call stack
    this.open$.set(false);
  }
}
