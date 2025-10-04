import { Component, Input, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  animations: [
    trigger('headingAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [animate('0.6s ease-out')]),
    ]),
    trigger('textAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [animate('0.6s 0.4s ease-out')]),
    ]),
  ],
})
export class HistoryComponent  {
  @Input() history?: string;


}
