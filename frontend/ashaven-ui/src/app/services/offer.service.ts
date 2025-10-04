import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { Offer } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private apiBaseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiBaseUrl}/api/offer`);
  }
  

  createOffer(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/api/offer/create`, formData, {
      responseType: 'text',
    });
  }

  editOffer(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/api/offer/edit`, formData, {
      responseType: 'text',
    });
  }

  getActiveOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiBaseUrl}/api/offer/active`);
  }

  toggleActiveStatus(id: string, isActive: boolean): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/offer/itemactiveinactive?id=${id}&value=${isActive}`,
      {},
      { responseType: 'text' }
    );
  }

  deleteOffer(id: string): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/offer/delete?id=${id}`,
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
