import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Offer } from '../../models/model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  animations: [
    trigger('modalAnimation', [
      state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
      state('*', style({ opacity: 1, transform: 'scale(1)' })),
      transition(':enter', [animate('300ms ease-in-out')]),
      transition(':leave', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class ModalComponent {
  @Input() offer: Offer | null = null;
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  baseUrl = environment.baseUrl;

  onClose() {
    this.close.emit();
  }
}
