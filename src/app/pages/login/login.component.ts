import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  nome: string = '';
  grupoId: string = '';
  erro: string = '';
  carregando: boolean = false;

  modo: 'login' | 'cadastro' = 'login';

  constructor(
    private router: Router,
    private firestore: Firestore,
    private auth: AuthService
  ) {}

  async autenticar() {
    this.erro = '';
    this.carregando = true;

    const auth = getAuth();

    if (!this.email || !this.senha || !this.grupoId || !this.nome) {
      this.erro = 'Preencha todos os campos.';
      this.carregando = false;
      return;
    }

    try {
      const uidGrupo = `grupo-${this.grupoId}`;

      if (this.modo === 'cadastro') {
        const credenciais = await createUserWithEmailAndPassword(auth, this.email, this.senha);
        const uid = credenciais.user.uid;

        // Cria o grupo e o membro admin
        await setDoc(doc(this.firestore, `grupos/${uidGrupo}`), { criadoEm: new Date() });
        await setDoc(doc(this.firestore, `grupos/${uidGrupo}/membros/${uid}`), {
          nome: this.nome,
          admin: true
        });

        this.auth.setUsuario(uid, this.nome, uidGrupo, true);
        this.router.navigate(['/']);
      } else {
        const credenciais = await signInWithEmailAndPassword(auth, this.email, this.senha);
        const uid = credenciais.user.uid;

        const membroRef = doc(this.firestore, `grupos/${uidGrupo}/membros/${uid}`);
        const membroSnap = await getDoc(membroRef);

        if (!membroSnap.exists()) {
          this.erro = 'Usuário não encontrado no grupo.';
          this.carregando = false;
          return;
        }

        const membro = membroSnap.data();
        this.auth.setUsuario(uid, membro['nome'], uidGrupo, membro['admin'] === true);
        this.router.navigate(['/']);
      }
    } catch (e: any) {
      console.error('Erro:', e);
      this.erro = e.message || 'Erro ao autenticar. Tente novamente.';
    }

    this.carregando = false;
  }

  alternarModo() {
    this.modo = this.modo === 'login' ? 'cadastro' : 'login';
    this.erro = '';
  }
}
