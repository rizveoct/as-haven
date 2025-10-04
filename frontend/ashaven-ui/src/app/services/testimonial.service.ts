import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { Testimonial } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  private apiBaseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiBaseUrl}/api/testimonial`);
  }

  getActiveTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiBaseUrl}/api/testimonial/active`);
  }

  createTestimonial(formData: FormData): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/testimonial/create`,
      formData,
      { responseType: 'text' }
    );
  }

  editTestimonial(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/api/testimonial/edit`, formData, {
      responseType: 'text',
    });
  }

  toggleActiveStatus(id: string, isActive: boolean): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/testimonial/itemactiveinactive?id=${id}&value=${isActive}`,
      {},
      { responseType: 'text' }
    );
  }

  deleteTestimonial(id: string): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/testimonial/delete?id=${id}`,
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
