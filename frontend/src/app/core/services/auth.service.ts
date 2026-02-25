import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environment/environment';

interface RegisterDto {
  username: string;
  password: string;
  telefone: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) { }

  /* ===================== REGISTER ===================== */

  register(data: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  /* ===================== LOGIN ===================== */

  login(data: { username: string; password: string }) {
    return this.http.post(
      `${this.apiUrl}/login`,
      data,
      { withCredentials: true }
    ).pipe(
      tap(() => {
        // Após login bem-sucedido, buscar usuário autenticado
        this.fetchCurrentUser().subscribe();
      })
    );
  }

  /* ===================== LOGOUT ===================== */

  logout(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.usernameSubject.next(null);
      })
    );
  }

  /* ===================== AUTH STATUS ===================== */

  isAuthenticated(): Observable<boolean> {
    return this.http.get<any>(
      `${this.apiUrl}/me`,
      { withCredentials: true }
    ).pipe(
      map((user) => {
        this.usernameSubject.next(user.username); // atualiza username$
        return true; // retorna boolean pro guard
      }),
      catchError(() => {
        this.usernameSubject.next(null); // limpa username$
        return of(false);
      })
    );
  }

  /* ===================== GET CURRENT USER ===================== */

  fetchCurrentUser() {
    return this.http.get(
      `${this.apiUrl}/me`,
      { withCredentials: true }
    ).pipe(
      tap((user: any) => {
        this.usernameSubject.next(user.username);
      }),
      catchError(() => {
        this.usernameSubject.next(null);
        return of(null);
      })
    );
  }
}