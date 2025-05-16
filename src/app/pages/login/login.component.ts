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
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.erro = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        this.erro = 'E-mail inválido.';
      } else if (error.code === 'auth/weak-password') {
        this.erro = 'Senha muito fraca. Use pelo menos 6 caracteres.';
      } else {
        this.erro = 'Erro ao registrar. Tente novamente.';
      }
    }
  }
}
