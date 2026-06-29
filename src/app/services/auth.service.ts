import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  private redirectUrlSubject = new BehaviorSubject<string>('/dashboard');

  constructor(private http: HttpClient) {}

  register(data: {
    username: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((response: AuthResponse) => {
        if (response.data?.token && response.data?.user) {
          sessionStorage.setItem('auth_token', response.data.token);
          sessionStorage.setItem('current_user', JSON.stringify(response.data.user));
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  login(data: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response: AuthResponse) => {
        if (response.data?.token && response.data?.user) {
          sessionStorage.setItem('auth_token', response.data.token);
          sessionStorage.setItem('current_user', JSON.stringify(response.data.user));
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('current_user');
        this.currentUserSubject.next(null);
      })
    );
  }

  updateCurrentUser(user: User): void {
    sessionStorage.setItem('current_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  private loadUser(): User | null {
    const token = this.getToken();
    if (!token) return null;

    const userJson = sessionStorage.getItem('current_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  setRedirectUrl(url: string): void {
    this.redirectUrlSubject.next(url);
  }

  getRedirectUrl(): string {
    return this.redirectUrlSubject.value;
  }
}