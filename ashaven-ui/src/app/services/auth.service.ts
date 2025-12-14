import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

export interface LoginResponse {
  token: string;
  expiration: string;
  id: string;
  email: string;
}

export interface ChangeCredentialsModel {
  newUsername?: string;
  newPassword?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.baseUrl;
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private loggedInSubject = new BehaviorSubject<boolean>(false);

  token$ = this.tokenSubject.asObservable();
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.tokenSubject.next(token);
      this.loggedInSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/api/authentication/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          this.setSession(res);
        })
      );
  }

  logout() {
    localStorage.clear();
    this.tokenSubject.next(null);
    this.loggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<{ token: string; expiration: string }> {
    const token = this.getToken();
    if (!token) throw new Error('No token available');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .post<{ token: string; expiration: string }>(
        `${this.baseUrl}/api/authentication/refreshtoken`,
        {},
        { headers }
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('tokenExpiration', res.expiration);
          this.tokenSubject.next(res.token);
        })
      );
  }

  changeCredentials(model: ChangeCredentialsModel): Observable<any> {
    const token = this.getToken();
    if (!token) throw new Error('No token available');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(
      `${this.baseUrl}/api/authentication/changecredentials`,
      model,
      { headers }
    );
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  private setSession(res: LoginResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('tokenExpiration', res.expiration);
    localStorage.setItem('userId', res.id);
    localStorage.setItem('email', res.email);
    this.tokenSubject.next(res.token);
    this.loggedInSubject.next(true);
  }
}
