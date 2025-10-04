import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-mission-vision',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './mission-vision.component.html',
  styleUrls: ['./mission-vision.component.css'],
  animations: [
    trigger('imageAnimation', [
      state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
      state('*', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [animate('0.6s ease-out')]),
    ]),
    trigger('textAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [animate('0.6s 0.3s ease-out')]),
    ]),
    trigger('visionImageAnimation', [
      state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
      state('*', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [animate('0.6s 0.5s ease-out')]),
    ]),
    trigger('visionTextAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [animate('0.6s 0.7s ease-out')]),
    ]),
  ],
})
export class MissionVisionComponent {
  @Input() mission?: string;
  @Input() missionImage?: string;
  @Input() vision?: string;
  @Input() visionImage?: string;
  @Output() imageError = new EventEmitter<Event>();



  onImageError(event: Event) {
    this.imageError.emit(event);
  }
}
