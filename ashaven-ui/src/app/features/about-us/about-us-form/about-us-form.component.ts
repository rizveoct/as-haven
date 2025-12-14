import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AboutUsService } from '../services/about-us.service';
import { CommonModule } from '@angular/common';
import { AboutUs } from '../../../models/model';

@Component({
  selector: 'app-about-us-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './about-us-form.component.html',
  styleUrls: ['./about-us-form.component.css'],
})
export class AboutUsFormComponent {
  @Input() set aboutUs(value: AboutUs | null) {
    this._aboutUs = value ? { ...value } : { ...this.defaultAboutUs };
  }
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  selectedOwnerImage: File | null = null;
  selectedVisionImage: File | null = null;
  selectedMissionImage: File | null = null;

  private defaultAboutUs: AboutUs = {
    id: '',
    history: '',
    vision: '',
    visionImage: '',
    mission: '',
    missionImage: '',
    ownerName: '',
    ownerDesignation: '',
    ownerSpeech: '',
    ownerImage: '',
    facebook: '',
    twitter: '',
    linkedIn: ''
  };

  _aboutUs: AboutUs = { ...this.defaultAboutUs };

  constructor(private aboutUsService: AboutUsService) {}

  onOwnerImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedOwnerImage = input.files[0];
    }
  }

  onVisionImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedVisionImage = input.files[0];
    }
  }

  onMissionImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedMissionImage = input.files[0];
    }
  }

  saveAboutUs() {
    const formData = new FormData();
    formData.append('history', this._aboutUs.history || '');
    formData.append('vision', this._aboutUs.vision || '');
    formData.append('mission', this._aboutUs.mission || '');
    formData.append('facebook', this._aboutUs.facebook || '');
    formData.append('twitter', this._aboutUs.twitter || '');
    formData.append('linkedIn', this._aboutUs.linkedIn || '');
    formData.append('ownerName', this._aboutUs.ownerName || '');
    formData.append('ownerDesignation', this._aboutUs.ownerDesignation || '');
    formData.append('ownerSpeech', this._aboutUs.ownerSpeech || '');
    if (this.selectedOwnerImage) {
      formData.append('ownerImage', this.selectedOwnerImage);
    }
    if (this.selectedVisionImage) {
      formData.append('visionImage', this.selectedVisionImage);
    }
    if (this.selectedMissionImage) {
      formData.append('missionImage', this.selectedMissionImage);
    }
    if (this.mode === 'edit') {
      formData.append('id', this._aboutUs.id || '');
    }

    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    const serviceMethod =
      this.mode === 'create'
        ? this.aboutUsService.createAboutUs(formData)
        : this.aboutUsService.editAboutUs(formData);
    serviceMethod.subscribe({
      next: (response) => {
        this.aboutUsService.showSuccess(
          response ||
            `About Us ${
              this.mode === 'create' ? 'created' : 'updated'
            } successfully`
        );
        this.saved.emit();
      },
      error: (error) => {
        this.aboutUsService.showError(
          `Failed to ${
            this.mode === 'create' ? 'create' : 'update'
          } About Us: ${error.message || 'Unknown error'}`
        );
        console.error('API error:', error);
      },
    });
  }

  closeModal() {
    this.close.emit();
  }
}
