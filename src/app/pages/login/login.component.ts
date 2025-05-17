import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
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
      this.router.navigate(['/']);
    } catch (e) {
      console.error(e);
      this.erro = 'Erro ao autenticar. Tente novamente.';
    }
  }

  async cadastrarNovoClube() {
    if (!this.grupoId || !this.nome || !this.senha) {
      this.erro = 'Preencha todos os campos para criar o clube.';
      return;
    }

    try {
      const clubeRef = doc(this.firestore, `grupos/${this.grupoId}`);
      const membroRef = doc(this.firestore, `grupos/${this.grupoId}/membros/${this.nome}`);

      await setDoc(clubeRef, { criadoEm: new Date() });
      await setDoc(membroRef, {
        senha: this.senha,
        admin: true,
      });

      this.auth.setUsuario(this.nome, true, this.grupoId);
      this.router.navigate(['/']);
    } catch (e) {
      console.error(e);
      this.erro = 'Erro ao cadastrar o clube.';
    }
  }
}
