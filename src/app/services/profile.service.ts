import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './auth.service';

export interface ProfileResponse {
  success: boolean;
  message?: string;
  data: User;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/profile
   * Get authenticated user's profile
   */
  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/profile`);
  }

  /**
   * PUT /api/profile
   * Update authenticated user's profile
   */
  updateProfile(data: {
    name?: string;
    email?: string;
    username?: string;
    password?: string;
  }): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.apiUrl}/profile`, data);
  }

  /**
   * DELETE /api/profile
   * Delete authenticated user account
   */
  deleteProfile(): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/profile`);
  }
}
