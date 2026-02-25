// ============================================
// BACKEND - ARQUIVO 1 (NOVO)
// src/events/events.gateway.ts
// ============================================

import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface EventNotification {
  type: 'event-created' | 'event-deleted' | 'events-changed';
  eventId?: string;
  timestamp: number;
}

@Injectable()
export class EventsGateway {
  // Subject para emitir notificações SSE
  private notificationSubject = new Subject<EventNotification>();

  // Observable que o controller vai usar no @Sse()
  get notifications$() {
    return this.notificationSubject.asObservable();
  }

  // Método para notificar todos os clientes conectados
  notifyChange(notification: EventNotification) {
    console.log('Emitindo notificação SSE:', notification);
    this.notificationSubject.next(notification);
  }

  // Atalhos para tipos específicos
  notifyEventCreated(eventId: string) {
    this.notifyChange({
      type: 'event-created',
      eventId,
      timestamp: Date.now()
    });
  }

  notifyEventDeleted(eventId: string) {
    this.notifyChange({
      type: 'event-deleted',
      eventId,
      timestamp: Date.now()
    });
  }
}