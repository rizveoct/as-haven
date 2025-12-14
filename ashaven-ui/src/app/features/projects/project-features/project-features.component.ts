import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ProjectService } from '../../../services/project.service';
import { ProjectFeature } from '../../../models/model';

@Component({
  selector: 'app-project-features',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './project-features.component.html',
  styleUrls: ['./project-features.component.css'],
})
export class ProjectFeaturesComponent implements OnInit {
  apiBaseUrl = environment.baseUrl;
  features: ProjectFeature[] = [];
  showCreateModal = false;
  projectId: string = '';
  newFeature: ProjectFeature = {
    id: '',
    title: '',
    description: '',
    icon: '',
    order: 0,
    projectId: '',
  };
  selectedIcon: File | null = null;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.newFeature.projectId = this.projectId;
    this.fetchFeatures();
  }

  fetchFeatures() {
    this.projectService.getFeatures(this.projectId).subscribe({
      next: (data) => {
        this.features = data;
      },
      error: (error) => {
        this.projectService.showError(
          'Failed to fetch Features: ' + (error.message || 'Unknown error')
        );
        console.error(error);
      },
    });
  }

  openCreateModal() {
    this.newFeature = {
      id: '',
      title: '',
      description: '',
      icon: '',
      order: 0,
      projectId: this.projectId,
    };
    this.selectedIcon = null;
    this.showCreateModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
  }

  onIconChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedIcon = input.files[0];
    }
  }

  saveFeature() {
    const formData = new FormData();
    formData.append('title', this.newFeature.title || '');
    formData.append('description', this.newFeature.description || '');
    formData.append('projectId', this.newFeature.projectId || '');
    formData.append('order', this.newFeature.order?.toString() || '0');
    if (this.selectedIcon) {
      formData.append('icon', this.selectedIcon);
    }

    this.projectService.createFeature(formData).subscribe({
      next: (response) => {
        this.projectService.showSuccess(
          response || 'Feature created successfully'
        );
        this.fetchFeatures();
        this.closeModal();
      },
      error: (error) => {
        this.projectService.showError(
          `Failed to create Feature: ${error.message || 'Unknown error'}`
        );
        console.error(error);
      },
    });
  }

  deleteFeature(id: string) {
    this.projectService.deleteFeature(id).subscribe({
      next: (response) => {
        this.projectService.showSuccess(
          response || 'Feature deleted successfully'
        );
        this.fetchFeatures();
      },
      error: (error) => {
        this.projectService.showError(
          `Failed to delete Feature: ${error.message || 'Unknown error'}`
        );
        console.error(error);
      },
    });
  }

  toggleFeatureActive(id: string, value: boolean) {
    this.projectService.toggleFeatureActive(id, value).subscribe({
      next: (response) => {
        this.projectService.showSuccess(
          response ||
            `Feature ${value ? 'activated' : 'deactivated'} successfully`
        );
        this.fetchFeatures();
      },
      error: (error) => {
        this.projectService.showError(
          `Failed to ${value ? 'activate' : 'deactivate'} Feature: ${
            error.message || 'Unknown error'
          }`
        );
        console.error(error);
      },
    });
  }
}
