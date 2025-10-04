import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
// import { ProjectGallery } from '../models/project-gallery.model';
// import { ProjectService } from '../services/project.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ProjectService } from '../../../services/project.service';
import { ProjectGallery } from '../../../models/model';

@Component({
  selector: 'app-project-gallery',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './project-gallery.component.html',
  styleUrls: ['./project-gallery.component.css'],
})
export class ProjectGalleryComponent implements OnInit {
  galleryItems: ProjectGallery[] = [];
  showCreateModal = false;
  projectId: string = '';
  apiBaseUrl = environment.baseUrl;
  newGalleryItem: ProjectGallery = {
    id: '',
    contentType: '',
    content: '',
    order: 0,
    projectId: '',
    isActive: true,
  };
  selectedContent: File | null = null;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.newGalleryItem.projectId = this.projectId;
    this.fetchGallery();
  }

  fetchGallery() {
    this.projectService.getGallery(this.projectId).subscribe({
      next: (data) => {
        this.galleryItems = data;
      },
      error: (error) => {
        this.projectService.showError(
          'Failed to fetch Gallery: ' + (error.message || 'Unknown error')
        );
        console.error(error);
      },
    });
  }

  openCreateModal() {
    this.newGalleryItem = {
      id: '',
      contentType: '',
      content: '',
      order: 0,
      projectId: this.projectId,
      isActive: true,
    };
    this.selectedContent = null;
    this.showCreateModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
  }

  onContentChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedContent = input.files[0];
    }
  }

  saveGalleryItem() {
    const formData = new FormData();
    formData.append('contentType', this.newGalleryItem.contentType || '');
    formData.append('projectId', this.newGalleryItem.projectId || '');
    formData.append('order', this.newGalleryItem.order?.toString() || '0');
    if (this.selectedContent) {
      formData.append('content', this.selectedContent);
    }

    this.projectService.createGallery(formData).subscribe({
      next: (response) => {
        this.projectService.showSuccess(
          response || 'Gallery item created successfully'
        );
        this.fetchGallery();
        this.closeModal();
      },
      error: (error) => {
        this.projectService.showError(
          `Failed to create Gallery item: ${error.message || 'Unknown error'}`
        );
        console.error(error);
      },
    });
  }

  deleteGalleryItem(id: string) {
    this.projectService.deleteGallery(id).subscribe({
      next: (response) => {
        this.projectService.showSuccess(
          response || 'Gallery item deleted successfully'
        );
        this.fetchGallery();
      },
      error: (error) => {
        this.projectService.showError(
          `Failed to delete Gallery item: ${error.message || 'Unknown error'}`
        );
        console.error(error);
      },
    });
  }

  toggleGalleryActive(id: string, value: boolean) {
    this.projectService.toggleGalleryActive(id, value).subscribe({
      next: (response) => {
        this.projectService.showSuccess(
          response ||
            `Gallery item ${value ? 'activated' : 'deactivated'} successfully`
        );
        this.fetchGallery();
      },
      error: (error) => {
        this.projectService.showError(
          `Failed to ${value ? 'activate' : 'deactivate'} Gallery item: ${
            error.message || 'Unknown error'
          }`
        );
        console.error(error);
      },
    });
  }
}
