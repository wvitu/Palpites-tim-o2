import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  erro: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  async entrar() {
    try {
      await this.auth.login(this.email, this.senha);
      this.router.navigate(['/']);
    } catch (error) {
      this.erro = 'Login falhou. Verifique e-mail e senha.';
    }
  }

  async registrar() {
    try {
      await this.auth.registrar(this.email, this.senha);
      this.router.navigate(['/']);
    } catch (error) {
      this.erro = 'Erro ao registrar. Talvez o e-mail já esteja em uso.';
    }
  }
}
