import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { GalleryService } from '../../services/gallery.service';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  contentType: string;
  contentName: string;
  isActive: boolean;
  order: number;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  galleryList: GalleryItem[] = [];
  showCreateModal = false;
  showEditModal = false;
  newItem: GalleryItem = {
    id: '',
    title: '',
    description: '',
    contentType: '',
    contentName: '',
    isActive: true,
    order: 0,
  };
  editItem: GalleryItem = { ...this.newItem };
  selectedFile: File | null = null;
  editSelectedFile: File | null = null;
  baseUrl = environment.baseUrl;

  constructor(
    private galleryService: GalleryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadGallery();
  }

  async loadGallery(): Promise<void> {
    try {
      this.galleryList = await this.galleryService.getAll();
    } catch (error) {
      this.toastr.error('Failed to load gallery items');
    }
  }

  toggleCreateModal(): void {
    this.showCreateModal = !this.showCreateModal;
    if (!this.showCreateModal) {
      this.resetNewItem();
    }
  }

  toggleEditModal(): void {
    this.showEditModal = !this.showEditModal;
    if (!this.showEditModal) {
      this.resetEditItem();
    }
  }

  resetNewItem(): void {
    this.newItem = {
      id: '',
      title: '',
      description: '',
      contentType: '',
      contentName: '',
      isActive: true,
      order: 0,
    };
    this.selectedFile = null;
  }

  resetEditItem(): void {
    this.editItem = { ...this.newItem };
    this.editSelectedFile = null;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onEditFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.editSelectedFile = input.files[0];
    }
  }

  async createData(): Promise<void> {
    if (!this.newItem.title || !this.newItem.contentType) {
      this.toastr.error('Title and content type are required');
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('contentname', this.selectedFile);
    }
    formData.append('type', this.newItem.contentType);
    formData.append('title', this.newItem.title);
    formData.append('description', this.newItem.description);
    formData.append('order', this.newItem.order.toString());

    try {
      const response = await this.galleryService.create(formData);
      if (response) {
        this.toastr.success(response);
        this.toggleCreateModal();
        await this.loadGallery();
      }
    } catch (error) {
      this.toastr.error('Failed to create gallery item');
    }
  }

  async editData(): Promise<void> {
    if (!this.editItem.title || !this.editItem.contentType) {
      this.toastr.error('Title and content type are required');
      return;
    }

    const formData = new FormData();
    if (this.editSelectedFile) {
      formData.append('contentname', this.editSelectedFile);
    }
    formData.append('id', this.editItem.id);
    formData.append('type', this.editItem.contentType);
    formData.append('title', this.editItem.title);
    formData.append('description', this.editItem.description);
    formData.append('order', this.editItem.order.toString());

    try {
      const response = await this.galleryService.edit(formData);
      if (response) {
        this.toastr.success(response);
        this.toggleEditModal();
        await this.loadGallery();
      }
    } catch (error) {
      this.toastr.error('Failed to update gallery item');
    }
  }

  async openEditModal(item: GalleryItem): Promise<void> {
    this.editItem = { ...item };
    this.showEditModal = true;
  }

  async itemActiveInactive(id: string, value: boolean): Promise<void> {
    try {
      const response = await this.galleryService.setActiveInactive(id, value);
      if (response) {
        this.toastr.success(response);
        await this.loadGallery();
      }
    } catch (error) {
      this.toastr.error('Failed to update status');
    }
  }

  async itemDelete(id: string): Promise<void> {
    try {
      const response = await this.galleryService.delete(id);
      if (response) {
        this.toastr.success(response);
        await this.loadGallery();
      }
    } catch (error) {
      this.toastr.error('Failed to delete gallery item');
    }
  }
}
