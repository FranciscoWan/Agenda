import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { DateTimePicker } from '../../../../shared/date-time-picker/date-time-picker';
import { EventService } from '../../../../core/services/event.service'


@Component({
  selector: 'app-new-event',
  standalone: true,
  imports: [FormsModule, CommonModule, DateTimePicker],
  templateUrl: './modal-new-event.html',
  styleUrl: './modal-new-event.css',
})
export class NewEvent {

  titulo = '';
  descricao = '';
  dataInicio = '';
  dataFim = '';
  cor = 'var(--color-green)';

  cores = [
    { nome: 'Laranja', valor: 'var(--color-orange)' },
    { nome: 'Azul', valor: 'var(--color-cyan)' },
    { nome: 'Roxo', valor: 'var(--color-purple)' },
    { nome: 'Verde', valor: 'var(--color-green)' }
  ];

  constructor(
    private authService: AuthService,
    private eventService: EventService
  ) { }

  onSubmit() {
    const token = this.authService.getToken();

    if (!token) {
      alert('Usuário não autenticado');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      titulo: this.titulo,
      descricao: this.descricao,
      dataInicio: this.dataInicio,
      dataFim: this.dataFim,
      cor: this.cor
    };

    this.eventService.createEvent(payload)
      .subscribe({
        next: () => {
          alert('Evento criado com sucesso!');
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao criar evento');
        }
      });
      this.resetForm()
  }

  resetForm() {
    this.titulo = '';
    this.descricao = '';
    this.dataInicio = '';
    this.dataFim = '';
    this.cor = 'var(--color-green)';
  }
}
