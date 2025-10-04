import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offer-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer-timer.component.html',
  styleUrls: ['./offer-timer.component.css'],
})
export class OfferTimerComponent {
  @Input() timer: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  } = {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  };
  @Input() offerActive: boolean = false;
}
