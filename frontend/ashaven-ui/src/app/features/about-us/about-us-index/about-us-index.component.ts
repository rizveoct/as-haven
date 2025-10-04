import { Component, OnInit } from '@angular/core';
import { AboutUsService } from '../services/about-us.service';
import { AboutUsFormComponent } from '../about-us-form/about-us-form.component';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { AboutUs } from '../../../models/model';

@Component({
  selector: 'app-about-us-index',
  standalone: true,
  imports: [AboutUsFormComponent, CommonModule],
  templateUrl: './about-us-index.component.html',
  styleUrls: ['./about-us-index.component.css'],
})
export class AboutUsIndexComponent implements OnInit {
  aboutUsList: AboutUs[] = [];
  showCreateModal = false;
  showEditModal = false;
  selectedAboutUs: AboutUs | null = null;
  apiBaseUrl = environment.baseUrl;

  constructor(private aboutUsService: AboutUsService) {}

  ngOnInit() {
    this.fetchAboutUs();
  }

  fetchAboutUs() {
    this.aboutUsService.getAboutUs().subscribe({
      next: (data) => {
        this.aboutUsList = data;
      },
      error: (error) => {
        this.aboutUsService.showError(
          'Failed to fetch About Us: ' + (error.message || 'Unknown error')
        );
        console.error(error);
      },
    });
  }

  openCreateModal() {
    this.selectedAboutUs = null;
    this.showCreateModal = true;
  }

  openEditModal(aboutUs: AboutUs) {
    this.selectedAboutUs = { ...aboutUs };
    this.showEditModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.selectedAboutUs = null;
  }

  onAboutUsSaved() {
    this.fetchAboutUs();
    this.closeModal();
  }

  deleteAboutUs(id: string) {
    this.aboutUsService.deleteAboutUs(id).subscribe({
      next: (response) => {
        this.aboutUsService.showSuccess(
          response || 'About Us deleted successfully'
        );
        this.fetchAboutUs();
      },
      error: (error) => {
        this.aboutUsService.showError(
          `Failed to delete About Us: ${error.message || 'Unknown error'}`
        );
        console.error(error);
      },
    });
  }
}
