import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CustomButton } from "../../shared/buttons/custom-button/custom-button";

@Component({
  selector: 'app-login',
  imports: [FormsModule, CustomButton],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    const data = {
      username: this.username,
      password: this.password
    };

    this.authService.login(data).subscribe({
      next: () => {

        // O token já foi salvo automaticamente pelo AuthService
        console.log('Login realizado com sucesso');

        // Redireciona para agenda
        this.router.navigate(['/agenda']);
      },
      error: (error) => {
        console.error('Erro no login:', error);
      }
    });
  }
}