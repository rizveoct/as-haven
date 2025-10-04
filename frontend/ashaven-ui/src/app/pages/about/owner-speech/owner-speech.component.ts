import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-owner-speech',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owner-speech.component.html',
  styleUrls: ['./owner-speech.component.css'],
})
export class OwnerSpeechComponent {
  @Input() title: string = '';
  @Input() ownerName?: string;
  @Input() ownerDesignation?: string;
  @Input() ownerSpeech?: string;
  @Input() ownerImage?: string;
  // Socials
  @Input() facebook?: string;
  @Input() linkedIn?: string; // keep this casing if already used by parent
  @Input() twitter?: string;
  @Output() imageError = new EventEmitter<Event>();

  onImageError(event: Event) {
    this.imageError.emit(event);
  }

  /** Ensure links include protocol and are non-empty */
  normalizeUrl(u?: string | null): string | null {
    if (!u) return null;
    const trimmed = u.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }
}
