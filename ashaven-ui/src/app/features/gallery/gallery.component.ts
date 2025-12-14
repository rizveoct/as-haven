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

  // 🔹 Pagination state
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  public Math = Math;

  // UI state
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
    this.loadGallery(); // initial load
  }

  /**
   * CLIENT-SIDE PAGINATION (default)
   * Fetch all, then slice on the client.
   * If your API supports paging, see server-side section below.
   */
  async loadGallery(): Promise<void> {
    try {
      this.galleryList = await this.galleryService.getAll();
      this.totalItems = this.galleryList.length;
      // keep currentPage in range if list shrank
      const lastPage = this.pageCount;
      if (this.currentPage > lastPage) {
        this.currentPage = Math.max(1, lastPage);
      }
    } catch (error) {
      this.toastr.error('Failed to load gallery items');
      this.galleryList = [];
      this.totalItems = 0;
    }
  }

  // 🔹 Computed: current page slice
  get pagedGallery(): GalleryItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.galleryList.slice(start, end);
  }

  // 🔹 Computed: total pages
  get pageCount(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  // 🔹 Pages array for template *ngFor
  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }

  // 🔹 Change page by ±1
  changePage(delta: number): void {
    const next = this.currentPage + delta;
    if (next >= 1 && next <= this.pageCount) {
      this.currentPage = next;
    }
  }

  // 🔹 Jump to specific page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.pageCount) {
      this.currentPage = page;
    }
  }

  // 🔹 Change page size
  onPageSizeChange(size: number): void {
    this.pageSize = Number(size);
    this.currentPage = 1; // reset to first page
  }

  /* -------------------- Modals -------------------- */

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
    if (input.files?.length) this.selectedFile = input.files[0];
  }

  onEditFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.editSelectedFile = input.files[0];
  }

  async createData(): Promise<void> {
    if (!this.newItem.title || !this.newItem.contentType) {
      this.toastr.error('Title and content type are required');
      return;
    }
    const formData = new FormData();
    if (this.selectedFile) formData.append('contentname', this.selectedFile);
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
    } catch {
      this.toastr.error('Failed to create gallery item');
    }
  }

  async editData(): Promise<void> {
    if (!this.editItem.title || !this.editItem.contentType) {
      this.toastr.error('Title and content type are required');
      return;
    }
    const formData = new FormData();
    if (this.editSelectedFile)
      formData.append('contentname', this.editSelectedFile);
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
    } catch {
      this.toastr.error('Failed to update gallery item');
    }
  }

  async openEditModal(item: GalleryItem): Promise<void> {
    this.editItem = { ...item };
    this.showEditModal = true;
  }

  /* -------------------- CRUD -------------------- */

  async itemActiveInactive(id: string, value: boolean): Promise<void> {
    try {
      const response = await this.galleryService.setActiveInactive(id, value);
      if (response) {
        this.toastr.success(response);
        await this.loadGallery();
      }
    } catch {
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
    } catch {
      this.toastr.error('Failed to delete gallery item');
    }
  }
}
