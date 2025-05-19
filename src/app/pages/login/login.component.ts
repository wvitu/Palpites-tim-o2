import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  erro: string = '';
  carregando: boolean = false;

  constructor(
    private afAuth: Auth,
    private firestore: Firestore,
    private auth: AuthService,
    private router: Router
  ) {}

  async autenticar() {
    this.erro = '';
    this.carregando = true;

    if (!this.email || !this.senha) {
      this.erro = 'Preencha todos os campos.';
      this.carregando = false;
      return;
    }

    try {
      const credenciais = await signInWithEmailAndPassword(this.afAuth, this.email, this.senha);
      const uid = credenciais.user.uid;

      const grupoId = await this.auth.encontrarGrupoPorUid(uid, this.firestore);

      if (!grupoId) {
        this.erro = 'Grupo não encontrado para este usuário.';
        this.carregando = false;
        return;
      }

      const membroRef = doc(this.firestore, `grupos/${grupoId}/membros/${uid}`);
      const membroSnap = await getDoc(membroRef);

      if (!membroSnap.exists()) {
        this.erro = 'Membro não encontrado.';
        this.carregando = false;
        return;
      }

      const membro = membroSnap.data();

      this.auth.setUsuario(uid, membro['nome'], grupoId, membro['admin'] === true);
      this.router.navigate(['/']);
    } catch (e) {
      console.error('Erro na autenticação:', e);
      this.erro = 'Erro ao conectar. Tente novamente.';
    }

    this.carregando = false;
  }
}
