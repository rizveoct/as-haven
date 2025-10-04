import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { Team } from '../models/model';


@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiBaseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiBaseUrl}/api/team`);
  }

  getActiveTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiBaseUrl}/api/team/active`);
  }

  createTeam(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/api/team/create`, formData, {
      responseType: 'text',
    });
  }

  editTeam(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/api/team/edit`, formData, {
      responseType: 'text',
    });
  }

  toggleActiveStatus(id: string, isActive: boolean): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/team/itemactiveinactive?id=${id}&value=${isActive}`,
      {},
      { responseType: 'text' }
    );
  }

  deleteTeam(id: string): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/team/delete?id=${id}`,
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
