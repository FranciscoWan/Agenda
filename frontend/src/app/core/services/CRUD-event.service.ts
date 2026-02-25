import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { EventStateService } from './event-state.service';

export interface CreateEventPayload {
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
  private stateService = inject(EventStateService);
  
  private apiUrl = `${environment.apiUrl}`;

  // Expõe o computed do state service
  public readonly upcomingEvents = this.stateService.upcomingEvents;
  
  
  createEvent(payload: CreateEventPayload): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, payload)
      .pipe(
        tap((event: any) => {
          this.stateService.addEvent(event);
        })
      );
  }

  deleteEvent(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.stateService.removeEvent(id);
        })
      );
  }
}