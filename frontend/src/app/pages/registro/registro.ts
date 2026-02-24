import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

import { RouterModule } from '@angular/router';

import { CustomButton } from "../../shared/buttons/custom-button/custom-button";
import { PopupService } from '../../shared/popup-modal/popup-modal.service';



@Component({
  selector: 'app-registro',
  imports: [CommonModule,
    FormsModule,
    RouterModule,
    CustomButton],
  standalone: true,
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  username = '';
  password = '';
  telefone = '';

  constructor(private authService: AuthService
  ) { }

  popup = inject(PopupService);
  
  onSubmit() {
    const data = {
      username: this.username,
      password: this.password,
      telefone: this.telefone
    };

    this.authService.register(data).subscribe({
      next: (response) => {
        this.popup.showSuccess(response?.response?.message || 'Usuário criado com sucesso!');
        this.resetForm()
      },
      error: (error) => {
        this.popup.showError(error?.error?.message);
      }

    });
  }

  resetForm() {
    this.username = '';
    this.password = '';
    this.telefone = '';
  }
}
