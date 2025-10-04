import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  contentType: string;
  contentName: string;
  isActive: boolean;
  order: number;
}

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private apiUrl = `${environment.baseUrl}/api/gallery`;

  constructor(private http: HttpClient) {}

  async getAll(): Promise<GalleryItem[]> {
    return firstValueFrom(this.http.get<GalleryItem[]>(this.apiUrl));
  }

  async create(formData: FormData): Promise<string> {
    return firstValueFrom(
      this.http.post<string>(`${this.apiUrl}/create`, formData)
    );
  }

  async edit(formData: FormData): Promise<string> {
    return firstValueFrom(
      this.http.post<string>(`${this.apiUrl}/edit`, formData)
    );
  }

  async setActiveInactive(id: string, value: boolean): Promise<string> {
    return firstValueFrom(
      this.http.post<string>(
        `${this.apiUrl}/itemactiveinactive?id=${id}&value=${value}`,
        {}
      )
    );
  }

  async delete(id: string): Promise<string> {
    return firstValueFrom(
      this.http.post<string>(`${this.apiUrl}/delete?id=${id}`, {})
    );
  }
}
