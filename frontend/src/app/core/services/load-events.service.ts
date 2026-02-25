import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, of, switchMap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CalendarEvent, EventStateService } from './event-state.service';

@Injectable({
  providedIn: 'root'
})
export class LoadEventsService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(
    private http: HttpClient,
    private stateService: EventStateService
  ) {}

  private handleLoad(url: string) {
    return this.http.get<CalendarEvent[]>(url)
    .pipe(
      filter((eventos: CalendarEvent[]) => eventos.length > 0),
      switchMap((eventos: CalendarEvent[]) => {
        this.stateService.resetVisibleCount();
        this.stateService.setEvents(eventos);
        return of(undefined);
      }),
      catchError((err) => {
        throw err;
      }),
    );
  }

  loadEventsByMonth(year: number, month: number) {
    const url = `${this.apiUrl}?view=month&year=${year}&month=${month}`;
    return this.handleLoad(url);
  }

  loadEventsByWeek(year: number, week: number) {
    const url = `${this.apiUrl}?view=week&year=${year}&week=${week}`;
    return this.handleLoad(url);
  }

  loadEventsByDay(year: number, month: number, day: number) {
    const url = `${this.apiUrl}?view=day&year=${year}&month=${month}&day=${day}`;
    return this.handleLoad(url);
  }
}