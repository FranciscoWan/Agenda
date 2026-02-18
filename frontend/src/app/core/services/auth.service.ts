import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface RegisterDto {
  username: string;
  password: string;
  telefone: string;
}

interface JwtPayload {
  username: string;
  sub: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/auth';

  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  /* ===================== REGISTER ===================== */

  register(data: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  /* ===================== LOGIN ===================== */

  login(data: { username: string; password: string }) {
    return this.http.post<{ access_token: string }>(
      `${this.apiUrl}/login`,
      data
    ).pipe(
      tap(response => {
        this.saveToken(response.access_token);
      })
    );
  }

  /* ===================== TOKEN ===================== */

  private saveToken(token: string) {
    localStorage.setItem('token', token);
    this.decodeAndSetUser(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /* ===================== LOGOUT ===================== */

  logout() {
    localStorage.removeItem('token');
    this.usernameSubject.next(null);
  }

  /* ===================== SESSION ===================== */

  private restoreSession() {
    const token = this.getToken();

    if (!token) return;

    if (this.isTokenExpired(token)) {
      this.logout();
      return;
    }

    this.decodeAndSetUser(token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  /* ===================== JWT ===================== */

  private decodeAndSetUser(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      this.usernameSubject.next(decoded.username);
    } catch {
      this.usernameSubject.next(null);
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }
}
