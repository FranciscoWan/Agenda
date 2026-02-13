import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
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
      next: (response) => {

        // Salvar JWT
        console.log('Token salvo:', response.access_token);
        this.authService.saveToken(response.access_token);
        // Redireciona para agenda
        this.router.navigate(['/agenda']);

      },
      error: (error) => {
        console.error('Erro no login:', error);
      }
    });
  }
}