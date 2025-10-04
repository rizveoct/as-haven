import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-feature-amenities',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feature-amenities.component.html',
  styleUrls: ['./feature-amenities.component.css'],
})
export class FeatureAmenitiesComponent {
  @Input() features: any[] = [];
  @Input() baseUrl: string = '';
  @Output() imageError = new EventEmitter<Event>();

  onImageError(event: Event): void {
    this.imageError.emit(event);
  }
}
