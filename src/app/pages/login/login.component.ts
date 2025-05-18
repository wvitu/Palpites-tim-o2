import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { signInWithCustomToken, getAuth } from 'firebase/auth';

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
    private http: HttpClient,
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
        // Verifica se o clube já existe
        const clubeSnap = await getDoc(clubeRef);
        if (clubeSnap.exists()) {
          this.erro = 'Este ID de clube já existe. Escolha outro.';
          this.carregando = false;
          return;
        }

        // Cria novo clube e primeiro membro como admin
        await setDoc(clubeRef, { criadoEm: new Date() });
        await setDoc(membroRef, { senha: this.senha, admin: true });

        await this.loginComToken(true); // Admin
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

        await this.loginComToken(data['admin'] === true);
      }
    } catch (e) {
      console.error('Erro na autenticação:', e);
      this.erro = 'Erro ao conectar. Tente novamente.';
    }

    this.carregando = false;
  }

  async loginComToken(isAdmin: boolean) {
    try {
      // 🔐 Solicita token personalizado do backend
      const resposta: any = await this.http
        .post('http://localhost:3000/gerar-token', {
          nome: this.nome,
          admin: isAdmin
        })
        .toPromise();

      const auth = getAuth();
      const credenciais = await signInWithCustomToken(auth, resposta.token);

      // 🧠 Recupera claims do token
      const tokenInfo = await credenciais.user.getIdTokenResult();
      const adminViaClaim = tokenInfo.claims['admin'] === true;


      // ✅ Seta usuário no serviço de autenticação
      this.auth.setUsuario(this.nome, adminViaClaim, this.grupoId);
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Erro ao fazer login com token:', err);
      this.erro = 'Falha ao autenticar com o servidor.';
    }
  }

  alternarModo() {
    this.modo = this.modo === 'login' ? 'cadastro' : 'login';
    this.erro = '';
  }
}
