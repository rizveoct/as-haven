import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Consultant } from '../../../models/model';
import { ConsultantService } from '../../../services/consultant.service';

@Component({
  selector: 'app-consultant-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './consultant-form.component.html',
  styleUrls: ['./consultant-form.component.css'],
})
export class ConsultantFormComponent implements OnInit {
  private defaultConsultant: Consultant = {
    id: '',
    name: '',
    location: '',
    image: '',
    isInterior: 0,
  };

  _consultant: Consultant = this.defaultConsultant;

  @Input() set consultant(value: Consultant | null) {
    this._consultant = value ? { ...value } : { ...this.defaultConsultant };
  }
  @Input() mode: 'create' | 'edit' = 'create';

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  selectedFile: File | null = null;

  constructor(private consultantService: ConsultantService) {}

  ngOnInit() {
    if (!this._consultant) {
      this._consultant = { ...this.defaultConsultant };
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Add this method inside ConsultantFormComponent
  setInterior(val: string) {
    this._consultant.isInterior = +val; // cast to number (0 or 1)
  }

  saveConsultant() {
    const formData = new FormData();
    formData.append('name', this._consultant.name || '');
    formData.append('location', this._consultant.location || '');
    formData.append('isInterior', this._consultant.isInterior.toString() || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.mode === 'edit') {
      formData.append('id', this._consultant.id || '');
    }

    const serviceMethod =
      this.mode === 'create'
        ? this.consultantService.createConsultant(formData)
        : this.consultantService.editConsultant(formData);

    serviceMethod.subscribe({
      next: (response) => {
        this.consultantService.showSuccess(
          response ||
            `Consultant ${
              this.mode === 'create' ? 'created' : 'updated'
            } successfully`
        );
        this.saved.emit();
      },
      error: (error) => {
        this.consultantService.showError(
          `Failed to ${
            this.mode === 'create' ? 'create' : 'update'
          } consultant: ${error.message || 'Unknown error'}`
        );
        console.error(error);
      },
    });
  }
}
