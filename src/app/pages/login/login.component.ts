import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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
    private router: Router,
    private firestore: Firestore,
    private auth: AuthService
  ) {}

  async autenticar() {
    this.erro = '';
    this.carregando = true;

    const auth = getAuth();

    if (!this.email || !this.senha) {
      this.erro = 'Preencha e-mail e senha.';
      this.carregando = false;
      return;
    }

    try {
      const credenciais = await signInWithEmailAndPassword(auth, this.email, this.senha);
      const uid = credenciais.user.uid;

      // Tenta localizar o membro em algum grupo
      const grupoId = await this.auth.encontrarGrupoPorUid(uid, this.firestore);
      if (!grupoId) throw new Error('Usuário não pertence a nenhum clube.');

      const membroRef = doc(this.firestore, `grupos/${grupoId}/membros/${uid}`);
      const membroSnap = await getDoc(membroRef);

      if (!membroSnap.exists()) throw new Error('Usuário não encontrado no grupo.');

      const membro = membroSnap.data();
      this.auth.setUsuario(uid, membro['nome'], grupoId, membro['admin'] === true);

      this.router.navigate(['/']);
    } catch (e: any) {
      console.error('Erro na autenticação:', e);
      this.erro = e.message || 'Erro ao autenticar. Tente novamente.';
    }

    this.carregando = false;
  }
}
