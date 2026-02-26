import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface CRUDCreateEventPayload {
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  cor: string;
}

@Injectable({
  providedIn: 'root'
})
export class CRUDEventService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/events`;

  public createEvent(payload: CRUDCreateEventPayload): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      payload,
      { withCredentials: true }
    );
  }

  public deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { withCredentials: true }
    );
  }
}