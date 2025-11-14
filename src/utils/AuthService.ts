import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) { }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp > currentTime) {
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (e) {
      this.logout();
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const body = { username, password };

    return this.http.post<LoginResponse>(`${this.BASE_URL}/login`, body)
      .pipe(
        tap(response => {
          // Store the token in localStorage on success
          localStorage.setItem('access_token', response.access_token);
        })
      );
  }
}
