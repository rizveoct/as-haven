import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogSummary } from '../../models/model';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css'],
})
export class BlogCardComponent {
  @Input({ required: true }) blog!: BlogSummary;
  @Input() variant: 'feature' | 'highlight' | 'grid' = 'grid';
  @Input() baseUrl = '';

  imageUrl(image?: string | null): string {
    if (!image) {
      return '/images/banner/banner-3.png';
    }

    if (!this.baseUrl) {
      return image;
    }

    return `${this.baseUrl}/api/attachment/get/${image}`;
  }
}
