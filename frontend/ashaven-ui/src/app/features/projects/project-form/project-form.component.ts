import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/model';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HttpClient } from '@angular/common/http'; // Add HttpClient for fetching images
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ImageCropperComponent],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
})
export class ProjectFormComponent {
  @Input() set project(value: Project | null) {
    this._project = value ? { ...value } : { ...this.defaultProject };
    this.contentType = this._project.contentType || '';
    if (this._project.offerDateTime) {
      this._project.offerDateTime = this.formatDateForInput(
        this._project.offerDateTime
      );
    }
    // Initialize previews for existing images
    if (this._project.thumbnail) {
      this.thumbnailPreview = this.sanitizer.bypassSecurityTrustUrl(
        `${this.apiBaseUrl}/api/attachment/get/${this._project.thumbnail}`
      );
    }
    if (this._project.content && this._project.contentType === 'Image') {
      this.contentPreview = this.sanitizer.bypassSecurityTrustUrl(
        `${this.apiBaseUrl}/api/attachment/get/${this._project.content}`
      );
    } else if (this._project.content && this._project.contentType === 'Video') {
      this.contentPreview = this.sanitizer.bypassSecurityTrustUrl(
        `${this.apiBaseUrl}/api/attachment/get/${this._project.content}`
      );
    }
  }
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  selectedThumbnail: File | null = null;
  selectedContent: File | null = null;
  selectedPdf: File | null = null;
  contentType: string = '';
  thumbnailPreview: SafeUrl | null = null;
  contentPreview: SafeUrl | null = null;
  imageToCrop: string | undefined = undefined;
  croppedImage: File | null = null;
  showCropper: boolean = false;
  cropperType: 'thumbnail' | 'content' | null = null;
  pdfError: string | null = null;
  private apiBaseUrl = environment.baseUrl; 

  private defaultProject: Project = {
    id: '',
    name: '',
    description: '',
    createDate: '',
    address: '',
    thumbnail: '',
    category: '',
    type: '',
    content: '',
    contentType: '',
    offerTitle: '',
    offerDateTime: '',
    isActive: true,
    landArea: '',
    builtUpArea: '',
    height: '',
    numberOfApartments: 0,
    numberOfParking: 0,
    noOfMotorParking: 0,
    unitPerFloors: '',
    sizeOfEachApartment: '',
    mapLink: '',
    pdfFile: '',
    videoLink: '',
    order: 0,
  };

  _project: Project = this.defaultProject;

  constructor(
    private projectService: ProjectService,
    private sanitizer: DomSanitizer,
    private http: HttpClient // Add HttpClient
  ) {}

  onThumbnailChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedThumbnail = input.files[0];
      this._project.thumbnail = this.selectedThumbnail.name; // Update project thumbnail name
      this.generatePreview(this.selectedThumbnail, 'thumbnail');
    }
  }

  onContentChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedContent = input.files[0];
      this._project.content = this.selectedContent.name; // Update project content name
      this.generatePreview(this.selectedContent, 'content');
    }
  }

  onPdfChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // 5MB = 5 * 1024 * 1024 bytes
      if (file.size > 5 * 1024 * 1024) {
        this.pdfError = 'PDF size must not exceed 5MB';
        input.value = ''; // Reset input
        this.selectedPdf = null;
        this._project.pdfFile = '';
        return;
      }

      this.pdfError = null; // clear error if valid
      this.selectedPdf = file;
      this._project.pdfFile = file.name;
    }
  }

  generatePreview(file: File, type: 'thumbnail' | 'content') {
    const reader = new FileReader();
    reader.onload = () => {
      const url = this.sanitizer.bypassSecurityTrustUrl(
        reader.result as string
      );
      if (type === 'thumbnail') {
        this.thumbnailPreview = url;
      } else {
        this.contentPreview = url;
      }
    };
    reader.readAsDataURL(file);
  }

  startCropping(file: File | string, type: 'thumbnail' | 'content') {
    if (typeof file === 'string') {
      // Fetch existing image as base64 for cropping
      this.http
        .get(`${this.apiBaseUrl}/api/attachment/get/${file}`, {
          responseType: 'blob',
        })
        .subscribe({
          next: (blob) => {
            const reader = new FileReader();
            reader.onload = () => {
              this.imageToCrop = reader.result as string;
              this.showCropper = true;
              this.cropperType = type;
            };
            reader.readAsDataURL(blob);
          },
          error: (error) => {
            console.error('Failed to fetch image for cropping:', error);
            this.projectService.showError('Failed to load image for editing');
          },
        });
    } else {
      // Handle newly uploaded file
      const reader = new FileReader();
      reader.onload = () => {
        this.imageToCrop = reader.result as string;
        this.showCropper = true;
        this.cropperType = type;
      };
      reader.readAsDataURL(file);
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      const fileName =
        this.cropperType === 'thumbnail' ? 'thumbnail.jpg' : 'content.jpg';
      this.croppedImage = new File([event.blob], fileName, {
        type: 'image/jpeg',
      });
      const reader = new FileReader();
      reader.onload = () => {
        const url = this.sanitizer.bypassSecurityTrustUrl(
          reader.result as string
        );
        if (this.cropperType === 'thumbnail') {
          this.thumbnailPreview = url;
          this.selectedThumbnail = this.croppedImage;
          this._project.thumbnail = fileName; // Update project thumbnail name
        } else {
          this.contentPreview = url;
          this.selectedContent = this.croppedImage;
          this._project.content = fileName; // Update project content name
        }
      };
      reader.readAsDataURL(event.blob);
    }
  }

  closeCropper() {
    this.showCropper = false;
    this.imageToCrop = undefined;
    this.cropperType = null;
  }

  formatDateForInput(date: string): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  saveProject() {
    const formData = new FormData();
    formData.append('name', this._project.name || '');
    formData.append('description', this._project.description || '');
    formData.append('address', this._project.address || '');
    formData.append('category', this._project.category || '');
    formData.append('type', this._project.type || '');
    formData.append('contentType', this.contentType || '');
    formData.append('offerTitle', this._project.offerTitle || '');
    formData.append('offerDateTime', this._project.offerDateTime || '');
    formData.append('landArea', this._project.landArea || '');
    formData.append('builtUpArea', this._project.builtUpArea || '');
    formData.append('height', this._project.height || '');
    formData.append('mapLink', this._project.mapLink || '');
    formData.append('pdfFile', this._project.pdfFile || '');
    formData.append('videoLink', this._project.videoLink || '');
    formData.append('order', this._project.order?.toString() || '0');
    formData.append(
      'numberOfApartments',
      this._project.numberOfApartments?.toString() || '0'
    );
    formData.append(
      'numberOfParking',
      this._project.numberOfParking?.toString() || '0'
    );
    formData.append(
      'noOfMotorParking',
      this._project.noOfMotorParking?.toString() || '0'
    );
    formData.append('unitPerFloors', this._project.unitPerFloors || '');
    formData.append(
      'sizeOfEachApartment',
      this._project.sizeOfEachApartment || ''
    );
    if (this.selectedThumbnail) {
      formData.append('thumbnail', this.selectedThumbnail);
    }
    if (this.selectedContent) {
      formData.append('content', this.selectedContent);
    }
    if (this.selectedPdf) {
      formData.append('pdfFile', this.selectedPdf);
    }
    if (this.mode === 'edit') {
      formData.append('id', this._project.id || '');
    }

    const serviceMethod =
      this.mode === 'create'
        ? this.projectService.createProject(formData)
        : this.projectService.editProject(formData);
    serviceMethod.subscribe({
      next: (response) => {
        this.projectService.showSuccess(
          response ||
            `Project ${
              this.mode === 'create' ? 'created' : 'updated'
            } successfully`
        );
        this.saved.emit();
      },
      error: (error) => {
        this.projectService.showError(
          `Failed to ${this.mode === 'create' ? 'create' : 'update'} Project: ${
            error.message || 'Unknown error'
          }`
        );
        console.error(error);
      },
    });
  }

  closeModal() {
    this.close.emit();
  }
}
