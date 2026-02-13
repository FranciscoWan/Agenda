import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RegisterDto {
    username: string;
    password: string;
    telefone: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'http://localhost:3000/auth';

    constructor(private http: HttpClient) { }

    register(data: RegisterDto): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, data);
    }

    login(data: { username: string; password: string }) {
        return this.http.post<{ access_token: string }>(
            `${this.apiUrl}/login`,
            data
        );
    }

    saveToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    logout() {
        localStorage.removeItem('token');
    }
}
