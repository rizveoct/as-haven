import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { AboutUs } from '../../../models/model';

@Injectable({
  providedIn: 'root',
})
export class AboutUsService {
  private apiBaseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getAboutUs(): Observable<AboutUs[]> {
    return this.http.get<AboutUs[]>(`${this.apiBaseUrl}/api/aboutus`);
  }

  createAboutUs(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/api/aboutus/create`, formData, {
      responseType: 'text',
    });
  }

  editAboutUs(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/api/aboutus/edit`, formData, {
      responseType: 'text',
    });
  }

  deleteAboutUs(id: string): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/aboutus/delete?id=${id}`,
      {},
      { responseType: 'text' }
    );
  }

  showSuccess(message: string) {
    this.toastr.success(message, '', {
      positionClass: 'toast-top-right',
      timeOut: 5000,
      closeButton: true,
    });
  }

  showError(message: string) {
    this.toastr.error(message, '', {
      positionClass: 'toast-top-right',
      timeOut: 5000,
      closeButton: true,
    });
  }
}
