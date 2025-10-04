import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { Project, ProjectFeature, ProjectGallery } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiBaseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  // Project APIs
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiBaseUrl}/api/project`);
  }

  getActiveProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiBaseUrl}/api/project/active`);
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiBaseUrl}/api/project/${id}`);
  }

  createProject(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/api/project/create`, formData, {
      responseType: 'text',
    });
  }

  editProject(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/api/project/edit`, formData, {
      responseType: 'text',
    });
  }

  deleteProject(id: string): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/project/delete?id=${id}`,
      {},
      { responseType: 'text' }
    );
  }

  toggleProjectActive(id: string, value: boolean): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/project/itemactiveinactive?id=${id}&value=${value}`,
      {},
      { responseType: 'text' }
    );
  }

  // Feature APIs
  getFeatures(projectId: string): Observable<ProjectFeature[]> {
    return this.http.get<ProjectFeature[]>(
      `${this.apiBaseUrl}/api/project/getfeature?projectId=${projectId}`
    );
  }

  createFeature(formData: FormData): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/project/featurecreate`,
      formData,
      { responseType: 'text' }
    );
  }

  deleteFeature(id: string): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/project/featuredelete?id=${id}`,
      {},
      { responseType: 'text' }
    );
  }

  toggleFeatureActive(id: string, value: boolean): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/project/featureactiveinactive?id=${id}&value=${value}`,
      {},
      { responseType: 'text' }
    );
  }

  // Gallery APIs
  getGallery(projectId: string): Observable<ProjectGallery[]> {
    return this.http.get<ProjectGallery[]>(
      `${this.apiBaseUrl}/api/project/getgallery?projectId=${projectId}`
    );
  }

  createGallery(formData: FormData): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/project/gallerycreate`,
      formData,
      { responseType: 'text' }
    );
  }

  deleteGallery(id: string): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/project/gallerydelete?id=${id}`,
      {},
      { responseType: 'text' }
    );
  }

  toggleGalleryActive(id: string, value: boolean): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/project/galleryactiveinactive?id=${id}&value=${value}`,
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
