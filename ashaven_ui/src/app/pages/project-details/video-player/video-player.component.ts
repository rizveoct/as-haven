import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent implements OnChanges {
  @Input() youtubeUrl: string | undefined;
  @Output() registerNowClicked = new EventEmitter<void>();
  safeYoutubeUrl: SafeResourceUrl | null = null;
  thumbnailUrl: string | null = null;
  showModal: boolean = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['youtubeUrl'] && this.youtubeUrl) {
      const videoId = this.extractVideoId(this.youtubeUrl);
      if (videoId) {
        // video embed url
        this.safeYoutubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoId}?rel=0`
        );
        // dynamic thumbnail
        this.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      } else {
        console.error('Invalid YouTube URL:', this.youtubeUrl);
        this.safeYoutubeUrl = null;
        this.thumbnailUrl = null;
      }
    } else {
      this.safeYoutubeUrl = null;
      this.thumbnailUrl = null;
    }
  }
  onRegisterNowClick() {
    this.registerNowClicked.emit(); // Emit event when button is clicked
  }

  extractVideoId(url: string): string | null {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
    if (this.showModal && this.youtubeUrl) {
      const videoId = this.extractVideoId(this.youtubeUrl);
      if (videoId) {
        this.safeYoutubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
        );
      }
    }
  }
}
