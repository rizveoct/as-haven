// src/app/services/contactus.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Contactus } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class ContactusService {
  private apiUrl = `${environment.baseUrl}/api/Contactus`;

  constructor(private http: HttpClient) {}

  // Get all contact submissions with pagination
  getAll(page: number = 1, pageSize: number = 10): Observable<Contactus[]> {
    return this.http
      .get<Contactus[]>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`)
      .pipe(
        map((data: Contactus[]) =>
          data.map((item) => ({
            ...item,
            date: item.date ? new Date(item.date) : undefined,
          }))
        ),
        catchError(this.handleError)
      );
  }

  // Create a new contact submission
  create(contact: Contactus): Observable<string> {
    return this.http
      .post<{ text: string }>(`${this.apiUrl}/create`, contact) // Expect JSON with 'text' property
      .pipe(
        map((response) => response.text), // Extract the 'text' property
        catchError(this.handleError)
      );
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && typeof error.error === 'object') {
        errorMessage += `\nDetails: ${JSON.stringify(error.error)}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
