import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconButton } from '../../../../shared/buttons/fa-icon-button/fa-icon-button';
import { EventService } from '../../../../core/services/event.service';
import { PopupService } from '../../../../shared/popup-modal/popup-modal.service';

@Component({
  selector: 'app-card-next-events',
  imports: [CommonModule, FaIconButton],
  templateUrl: './card-next-events.html',
})
export class CardNextEvents {

  private eventService = inject(EventService)
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

  onDelete() {
    this.popupService.showConfirm(
      'Tem certeza que deseja excluir este evento?',
      () => {
        this.eventService.deleteEvent(this.id())
          .subscribe({
            next: () => {
              this.deleted.emit();
              this.popupService.showSuccess('Evento excluído com sucesso!');
            },
            error: (err) => {
              this.popupService.showError('Erro ao excluir evento.' + err);
            }
          });
      }
    )
  }
}
