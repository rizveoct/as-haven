import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Consultant } from '../../../models/model';
import { ConsultantService } from '../../../services/consultant.service';
import { ConsultantFormComponent } from '../consultant-form/consultant-form.component';

@Component({
  selector: 'app-consultants-index',
  standalone: true,
  imports: [CommonModule, ConsultantFormComponent],
  templateUrl: './consultant-index.component.html',
  styleUrls: ['./consultant-index.component.css'],
})
export class ConsultantsIndexComponent implements OnInit {
  consultants: Consultant[] = [];
  showFormModal = false;
  selectedConsultant: Consultant | null = null;
  apiBaseUrl = environment.baseUrl;
  formMode: 'create' | 'edit' = 'create';

  constructor(private consultantService: ConsultantService) {}

  ngOnInit() {
    this.fetchConsultants();
  }

  fetchConsultants() {
    this.consultantService.getConsultant().subscribe({
      next: (data) => {
        this.consultants = data ?? [];
      },
      error: (error) => {
        this.consultantService.showError(
          'Failed to fetch consultants: ' + (error.message || 'Unknown error')
        );
        console.error(error);
      },
    });
  }

  openCreateModal() {
    this.selectedConsultant = null;
    this.formMode = 'create';
    this.showFormModal = true;
  }

  openEditModal(consultant: Consultant) {
    // Ensure numeric isInterior and preserve id
    const normalized: Consultant = {
      ...consultant,
      // Defensive: coerce to number (selects return strings sometimes)
      isInterior: Number(
        (consultant as any).isInterior ?? 0
      ),
      // id might be number in API and string in UI — keep whatever came
      id: (consultant as any).id,
    };

    this.selectedConsultant = normalized;
    this.formMode = 'edit';
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
    this.selectedConsultant = null;
  }

  onConsultantSaved() {
    this.fetchConsultants();
    this.closeFormModal();
  }

  deleteConsultant(id: string | number) {
    this.consultantService.deleteConsultant(id as any).subscribe({
      next: (response) => {
        this.consultantService.showSuccess(
          response || 'Consultant deleted successfully'
        );
        this.fetchConsultants();
      },
      error: (error) => {
        this.consultantService.showError(
          `Failed to delete consultant: ${error.message || 'Unknown error'}`
        );
        console.error(error);
      },
    });
  }

  /** Optional: build full image URL for preview in the list or modal */
  imageUrl(fileName?: string) {
    if (!fileName) return '';
    return `${this.apiBaseUrl}/assets/images/${fileName}`;
  }
}
