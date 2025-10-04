import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutUsService } from '../../services/about-us.service';
import { AboutUs } from '../../models/model';


@Component({
  selector: 'app-vision-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vision-banner.component.html',
  styleUrls: ['./vision-banner.component.css'],
})
export class VisionBannerComponent implements OnInit {
  vision: string | undefined; // Property to hold the vision text

  constructor(private aboutUsService: AboutUsService) {}

  ngOnInit(): void {
    this.loadVision();
  }

  loadVision(): void {
    this.aboutUsService.getAboutUs().subscribe({
      next: (data: AboutUs[]) => {
        if (data && data.length > 0) {
          this.vision = data[0].vision; // Assuming you want the first record's vision
          this.aboutUsService.showSuccess('Vision loaded successfully!');
        }
      },
      error: (error) => {
        this.aboutUsService.showError('Failed to load vision.');
        console.error('Error fetching vision:', error);
      },
    });
  }
}
