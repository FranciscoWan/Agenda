import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { SuccessPopupComponent } from '../../shared/success-popup/success-popup';
import { signal } from '@angular/core';



@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, RouterModule, SuccessPopupComponent],
  standalone: true,
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  username = '';
  password = '';
  telefone = '';

  showSuccessPopup = signal(false);

  constructor(private authService: AuthService) { }

  onSubmit() {
    const data = {
      username: this.username,
      password: this.password,
      telefone: this.telefone
    };

    this.authService.register(data).subscribe({
      next: (response) => {
        this.showSuccessPopup.set(true);
        console.log('Usuário criado:', response);
      },
      error: (error) => {
        console.error('Erro ao registrar:', error);
      }
    });
  }

  closePopup() {
    this.showSuccessPopup.set(false);
  }
}
