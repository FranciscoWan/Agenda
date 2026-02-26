import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CalendarEvent } from './state-event.service';

export type ViewMode = 'month' | 'week' | 'day';

type LoadParams =
  | { view: 'month'; year: number; month: number }
  | { view: 'week'; year: number; week: number }
  | { view: 'day'; year: number; month: number; day: number };

@Injectable({
  providedIn: 'root'
})
export class LoadEventsService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/events`;

  private lastLoadParams: LoadParams | null = null;

  /* ===================== CORE LOAD ===================== */

  private handleLoad(params: LoadParams): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(
      this.apiUrl,
      {
        params,
        withCredentials: true
      }
    ).pipe(
      catchError((err) => {
        console.error('❌ Erro ao carregar eventos:', err);
        throw err;
      })
    );
  }

  public reloadEvents() {
    if (!this.lastLoadParams) {
      console.log('⚠️ Nenhuma view carregada anteriormente');
      return of([]);
    }

    console.log('🔄 Recarregando view:', this.lastLoadParams.view);

    return this.handleLoad(this.lastLoadParams);
  }


  /* ===================== LOAD BY VIEW ===================== */

  public loadEventsByMonth(year: number, month: number) {
    this.lastLoadParams = { view: 'month', year, month };
    return this.handleLoad(this.lastLoadParams);
  }

  public loadEventsByWeek(year: number, week: number) {
    this.lastLoadParams = { view: 'week', year, week };
    return this.handleLoad(this.lastLoadParams);
  }

  public loadEventsByDay(year: number, month: number, day: number) {
    this.lastLoadParams = { view: 'day', year, month, day };
    return this.handleLoad(this.lastLoadParams);
  }
}