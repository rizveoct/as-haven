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
}
