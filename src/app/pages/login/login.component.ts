import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

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

  modo: 'login' | 'cadastro' = 'login';

  constructor(
    private firestore: Firestore,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
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
        const clubeSnap = await getDoc(clubeRef);
        if (clubeSnap.exists()) {
          this.erro = 'Este ID de clube já existe.';
          this.carregando = false;
          return;
        }

        await setDoc(clubeRef, { criadoEm: new Date() });
        await setDoc(membroRef, { senha: this.senha, admin: true });

        const token = await this.gerarToken(this.nome, true);
        await signInWithCustomToken(getAuth(), token);
        await this.exibirClaims(); // 👈 debug
        this.auth.setUsuario(this.nome, true, this.grupoId);
        this.router.navigate(['/']);
      } else {
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

        const token = await this.gerarToken(this.nome, data['admin']);
        await signInWithCustomToken(getAuth(), token);
        await this.exibirClaims(); // 👈 debug
        this.auth.setUsuario(this.nome, data['admin'], this.grupoId);
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

  private async gerarToken(nome: string, admin: boolean): Promise<string> {
    const response = await this.http.post<{ token: string }>(
      'http://localhost:3000/gerar-token',
      { nome, admin }
    ).toPromise();

    return response?.token || '';
  }

  private async exibirClaims() {
    const user = getAuth().currentUser;
    if (user) {
      const tokenInfo = await user.getIdTokenResult();
      console.log('🔐 Claims do usuário:', tokenInfo.claims);
    }
  }
}
