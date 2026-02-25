import { Injectable, inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, of, switchMap, Subscription } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CalendarEvent, EventStateService } from './event-state.service';

@Injectable({
  providedIn: 'root'
})
export class LoadEventsService implements OnDestroy {

  private http = inject(HttpClient);
  private stateService = inject(EventStateService);

  private apiUrl = `${environment.apiUrl}/events`;

  // Armazena última requisição para poder repetir
  private lastLoadParams: {
    type: 'month' | 'week' | 'day';
    params: any;
  } | null = null;

  // Subscription para cleanup
  private reloadSubscription?: Subscription;

  constructor() {
    this.reloadSubscription = this.stateService.reloadNeeded$.subscribe({
      next: () => {
        console.log('🔄 Reload necessário, recarregando última view...');
        this.reloadLast().subscribe({
          next: () => console.log('✅ Eventos recarregados com sucesso'),
          error: (err) => console.error('❌ Erro ao recarregar eventos:', err)
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  /* ===================== CORE LOAD ===================== */

  private handleLoad(params: any) {
    return this.http.get<CalendarEvent[]>(
      this.apiUrl,
      {
        params,
        withCredentials: true
      }
    ).pipe(
      filter((eventos: CalendarEvent[]) => eventos.length >= 0),
      switchMap((eventos: CalendarEvent[]) => {
        this.stateService.resetVisibleCount();
        this.stateService.setEvents(eventos);
        return of(undefined);
      }),
      catchError((err) => {
        console.error('❌ Erro ao carregar eventos:', err);
        throw err;
      }),
    );
  }

  /* ===================== LOAD BY VIEW ===================== */

  loadEventsByMonth(year: number, month: number) {
    this.lastLoadParams = { type: 'month', params: { view: 'month', year, month } };
    return this.handleLoad(this.lastLoadParams.params);
  }

  loadEventsByWeek(year: number, week: number) {
    this.lastLoadParams = { type: 'week', params: { view: 'week', year, week } };
    return this.handleLoad(this.lastLoadParams.params);
  }

  loadEventsByDay(year: number, month: number, day: number) {
    this.lastLoadParams = { type: 'day', params: { view: 'day', year, month, day } };
    return this.handleLoad(this.lastLoadParams.params);
  }

  /* ===================== RELOAD LAST ===================== */

  private reloadLast() {
    if (!this.lastLoadParams) {
      console.log('⚠️ Nenhuma view carregada anteriormente');
      return of(undefined);
    }

    console.log('🔄 Recarregando view:', this.lastLoadParams.type);

    return this.handleLoad(this.lastLoadParams.params);
  }
}