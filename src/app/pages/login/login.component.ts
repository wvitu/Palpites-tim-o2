import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  grupoId: string = '';
  nome: string = '';
  senha: string = '';
  erro: string = '';

  constructor(private firestore: Firestore, private auth: AuthService, private router: Router) {}

  async login() {
    try {
      const ref = doc(this.firestore, `grupos/${this.grupoId}/membros/${this.nome}`);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        this.erro = 'Usuário não encontrado.';
        return;
      }

      const data = snap.data();
      if (data['senha'] !== this.senha) {
        this.erro = 'Senha incorreta.';
        return;
      }

      this.auth.setUsuario(this.nome, data['admin'] === true, this.grupoId);
      this.router.navigate(['/']); // Redireciona para a tela inicial
    } catch (e) {
      console.error(e);
      this.erro = 'Erro ao autenticar. Tente novamente.';
    }
  }
}
