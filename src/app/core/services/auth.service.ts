import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private tokenKey = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private roleSubject = new BehaviorSubject<string | null>(null);
  private idSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkAuthStatus();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.isAuthenticatedSubject.next(true);
          this.decodeAndStoreClaims(response.token);
        }),
        catchError(error => {
          console.error('Error en login:', error);
          throw error;
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.isAuthenticatedSubject.next(false);
    this.roleSubject.next(null);
    this.idSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const isValid = !!token;
    this.isAuthenticatedSubject.next(isValid);
    if (token) {
      this.decodeAndStoreClaims(token);
    }
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get role$(): Observable<string | null> {
    return this.roleSubject.asObservable();
  }

  get id$(): Observable<string | null> {
    return this.idSubject.asObservable();
  }

  get role(): string | null {
    return this.roleSubject.value;
  }

  get id(): string | null {
    return this.idSubject.value;
  }

  private decodeAndStoreClaims(token: string): void {
    try {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      const base64 = token.split('.')[1] || '';
      const json = atob(base64);
      const payload = JSON.parse(json);
      const role = payload?.role ?? null;
      const id = payload?.id ?? null;
      this.roleSubject.next(role);
      this.idSubject.next(id);
    } catch {
      this.roleSubject.next(null);
      this.idSubject.next(null);
    }
  }
}
