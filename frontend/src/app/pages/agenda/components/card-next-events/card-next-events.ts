import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconButton } from '../../../../shared/buttons/fa-icon-button/fa-icon-button';
import { CRUDEventService } from '../../../../core/services/CRUD-event.service';
import { PopupService } from '../../../../shared/popup-modal/popup-modal.service';

@Component({
  selector: 'app-card-next-events',
  imports: [CommonModule, FaIconButton],
  templateUrl: './card-next-events.html',
})
export class CardNextEvents {

  private eventService = inject(CRUDEventService)
  private popupService = inject(PopupService)

  deleted = output<void>();

  id = input.required<string>();
  titulo = input.required<string>();
  descricao = input.required<string>();
  dataInicio = input.required<string>();
  dataFim = input.required<string>();
  cor = input.required<string>();


  get formattedDate(): string {
    const start = new Date(this.dataInicio());
    const end = new Date(this.dataFim());


    const data = start.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });

    const datFim = end.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });

    const startTime = start.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const endTime = end.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${data} - ${startTime} / ${datFim} - ${endTime}`;
  }

  async onDelete() {
    try {
      // Abre o popup de confirmação e espera a resposta do usuário
      const confirmed = await this.popupService.confirm(
        'Tem certeza que deseja excluir este evento?'
      );

      if (!confirmed) return; // Usuário cancelou
      
      // Se confirmado, deleta o evento
      this.eventService.deleteEvent(this.id()).subscribe({
        next: () => {
          this.deleted.emit();

          // Mostra popup de sucesso (irá empilhar corretamente)
          this.popupService.show('Evento excluído com sucesso!', 'success');
        },
        error: (err) => {
          this.popupService.show('Erro ao excluir evento: ' + err, 'error');
        }
      });
    } catch (err) {
      console.error('Erro no onDelete:', err);
    }
  }
}
