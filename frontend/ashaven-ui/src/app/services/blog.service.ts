import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { Blog, BlogSummary } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiBaseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiBaseUrl}/api/blog`);
  }

  createBlog(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/api/blog/create`, formData, {
      responseType: 'text',
    });
  }

  editBlog(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/api/blog/edit`, formData, {
      responseType: 'text',
    });
  }

  deleteBlog(id: string): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/blog/delete?id=${id}`,
      {},
      { responseType: 'text' }
    );
  }

  toggleBlogActive(id: string, value: boolean): Observable<string> {
    return this.http.post(
      `${this.apiBaseUrl}/api/blog/itemactiveinactive?id=${id}&value=${value}`,
      {},
      { responseType: 'text' }
    );
  }

  getActiveBlogs(): Observable<BlogSummary[]> {
    return this.http.get<BlogSummary[]>(`${this.apiBaseUrl}/api/website/getblogs`);
  }

  getBlogDetails(id: string): Observable<BlogSummary> {
    return this.http.get<BlogSummary>(
      `${this.apiBaseUrl}/api/website/getsingleblog?blogId=${id}`
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
