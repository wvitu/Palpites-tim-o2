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
  carregando: boolean = false;

  modo: 'login' | 'cadastro' = 'login'; // Alterna entre login e criação

  constructor(
    private firestore: Firestore,
    private auth: AuthService,
    private router: Router
  ) {}

  async autenticar() {
    this.erro = '';
    this.carregando = true;

    if (!this.grupoId || !this.nome || !this.senha) {
      this.erro = 'Preencha todos os campos.';
      this.carregando = false;
      return;
    }

    try {
      const clubeRef = doc(this.firestore, `grupos/${this.grupoId}`);
      const membroRef = doc(this.firestore, `grupos/${this.grupoId}/membros/${this.nome}`);

      if (this.modo === 'cadastro') {
        // Criação do novo clube e primeiro admin
        const clubeSnap = await getDoc(clubeRef);
        if (clubeSnap.exists()) {
          this.erro = 'Este ID de clube já existe. Escolha outro.';
          this.carregando = false;
          return;
        }

        await setDoc(clubeRef, { criadoEm: new Date() });
        await setDoc(membroRef, {
          senha: this.senha,
          admin: true
        });

        this.auth.setUsuario(this.nome, true, this.grupoId);
        this.router.navigate(['/']);
      } else {
        // Login em clube existente
        const membroSnap = await getDoc(membroRef);

        if (!membroSnap.exists()) {
          this.erro = 'Usuário não encontrado.';
          this.carregando = false;
          return;
        }

        const data = membroSnap.data();
        if (data['senha'] !== this.senha) {
          this.erro = 'Senha incorreta.';
          this.carregando = false;
          return;
        }

        this.auth.setUsuario(this.nome, data['admin'] === true, this.grupoId);
        this.router.navigate(['/']);
      }
    } catch (e) {
      console.error('Erro na autenticação:', e);
      this.erro = 'Erro ao conectar. Tente novamente.';
    }

    this.carregando = false;
  }

  alternarModo() {
    this.modo = this.modo === 'login' ? 'cadastro' : 'login';
    this.erro = '';
  }
}
