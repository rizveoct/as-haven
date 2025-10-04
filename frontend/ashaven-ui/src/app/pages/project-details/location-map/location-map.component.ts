import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css'],
})
export class LocationMapComponent {
  @Input() mapIframe?: string;
  @Output() registerNowClicked = new EventEmitter<void>();
  safeMapIframe?: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    if (this.mapIframe) {
      this.safeMapIframe = this.sanitizer.bypassSecurityTrustHtml(
        this.mapIframe
      );
    }
  }

  onRegisterNowClick() {
    this.registerNowClicked.emit(); // Emit event when button is clicked
  }
}
