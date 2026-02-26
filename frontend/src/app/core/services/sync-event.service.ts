import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface EventNotification {
  type: 'event-created' | 'event-deleted' | 'events-changed';
  eventId?: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class SyncEventService implements OnDestroy {

  private sseConnection?: EventSource;

  private notificationSubject = new Subject<EventNotification>();

  public readonly notifications$ = this.notificationSubject.asObservable();

  constructor() { }

  /* ===================== CONNECT ===================== */

  connectToSSE() {

    // Evita duplicação
    if (this.sseConnection) {
      console.log('⚠️ SSE já está conectado');
      return;
    }

    try {
      this.sseConnection = new EventSource(
        `${environment.apiUrl}/events/stream`,
        { withCredentials: true }
      );

      this.sseConnection.onopen = () => {
        console.log('✅ SSE conectado');
      };

      this.sseConnection.onmessage = (event) => {
        try {
          const notification: EventNotification = JSON.parse(event.data);
          console.log('📨 Notificação SSE recebida:', notification);
          this.notificationSubject.next(notification);
        } catch (error) {
          console.error('❌ Erro ao parsear notificação SSE:', error);
        }
      };

      this.sseConnection.onerror = (error) => {
        console.error('❌ Erro SSE, tentando reconectar em 5s...', error);

        this.disconnect();

        // Reconecta apenas se não houver conexão ativa
        setTimeout(() => {
          if (!this.sseConnection) {
            this.connectToSSE();
          }
        }, 5000);
      };

    } catch (error) {
      console.error('❌ Erro ao criar conexão SSE:', error);
    }
  }

  /* ===================== DISCONNECT ===================== */

  private disconnect() {
    if (this.sseConnection) {
      this.sseConnection.close();
      this.sseConnection = undefined;
      console.log('🔌 SSE desconectado');
    }
  }

  /* ===================== RECONNECT ===================== */

  private reconnect() {
    this.disconnect();
    this.connectToSSE();
  }

  ngOnDestroy() {
    this.disconnect();
    this.notificationSubject.complete();
  }
}