import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { Consultant } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class ConsultantService {
  private apiBaseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getConsultant(): Observable<Consultant[]> {
    return this.http.get<Consultant[]>(`${this.apiBaseUrl}/api/consultant`);
  }


  createConsultant(formData: FormData): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/consultant/create`,
      formData,
      {
        responseType: 'text',
      }
    );
  }

  editConsultant(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/api/consultant/edit`, formData, {
      responseType: 'text',
    });
  }

  deleteConsultant(id: string | number): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/consultant/delete?id=${id}`,
      {},
      { responseType: 'text' }
    );
  }

  showSuccess(message: string) {
    this.toastr.success(message);
  }

  showError(message: string) {
    this.toastr.error(message);
  }
}
