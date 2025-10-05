import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-at-glance',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './at-glance.component.html',
  styleUrls: ['./at-glance.component.css'],
})
export class AtGlanceComponent {
  @Input() project: any = null;
  @Input() baseUrl: string = '';
  @Output() imageError = new EventEmitter<Event>();
  @Output() registerNowClicked = new EventEmitter<void>();

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  onImageError(event: Event): void {
    this.imageError.emit(event);
  }
  onRegisterNowClick() {
    this.registerNowClicked.emit(); // Emit event when button is clicked
  }

  downloadPdf(fileName: string): void {
    if (!fileName) {
      this.toastr.error('No PDF available for this project.', 'Error');
      return;
    }

    const url = `${this.baseUrl}/api/project/downloadpdf/${fileName}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
        this.toastr.success('PDF downloaded successfully!', 'Success');
      },
      error: (err) => {
        console.error('PDF download error:', err);
        this.toastr.error('Failed to download PDF.', 'Error');
      },
    });
  }

  get quickFacts(): { label: string; value: string }[] {
    const facts: { label: string; value: unknown }[] = [
      { label: 'Land Area', value: this.project?.landArea },
      { label: 'Floors', value: this.project?.height },
      { label: 'Apartments', value: this.project?.numberOfApartments },
      { label: 'Car Parking', value: this.project?.numberOfParking },
      { label: 'Units / Floor', value: this.project?.unitPerFloors },
    ];

    return facts
      .filter((fact) => {
        if (fact.value === null || fact.value === undefined) {
          return false;
        }
        return `${fact.value}`.trim().length > 0;
      })
      .slice(0, 4)
      .map((fact) => ({ label: fact.label, value: `${fact.value}` }));
  }

  get detailRows(): { label: string; value: string }[] {
    const rows: { label: string; value: string | null | undefined }[] = [
      { label: 'Address', value: this.project?.address },
      { label: 'Land Area', value: this.project?.landArea },
      { label: 'Building Height', value: this.project?.height },
      { label: 'Building Type', value: this.project?.type },
      { label: 'Apartments', value: this.project?.numberOfApartments },
      { label: 'Car Parking', value: this.project?.numberOfParking },
      { label: 'Motorbike Parking', value: this.project?.noOfMotorParking },
      { label: 'Units per Floor', value: this.project?.unitPerFloors },
      { label: 'Apartment Size', value: this.project?.sizeOfEachApartment },
    ];

    return rows.map((row) => ({
      label: row.label,
      value: row.value && `${row.value}`.trim().length > 0 ? `${row.value}` : '—',
    }));
  }
}
