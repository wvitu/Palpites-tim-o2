import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { sendPasswordResetEmail } from 'firebase/auth';

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
  modo: 'login' | 'cadastro' = 'login';

  constructor(
    private authService: AuthService,
    private afAuth: Auth,
    private firestore: Firestore,
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
      if (this.modo === 'cadastro') {
        // Cria usuário com Firebase Auth
        const credenciais = await createUserWithEmailAndPassword(this.afAuth, this.email, this.senha);

        // Exemplo de criação de dados no Firestore
        const uid = credenciais.user.uid;
        const grupoId = `grupo-${uid.substring(0, 5)}`; // exemplo de grupo automático
        const membroRef = doc(this.firestore, `grupos/${grupoId}/membros/${uid}`);

        await setDoc(membroRef, {
          nome: this.email.split('@')[0],
          admin: true,
          criadoEm: new Date()
        });

        this.authService.setUsuario(uid, this.email.split('@')[0], grupoId, true);
        this.router.navigate(['/']);
      } else {
        // Login
        const credenciais = await signInWithEmailAndPassword(this.afAuth, this.email, this.senha);
        const uid = credenciais.user.uid;

        const grupoId = await this.authService.encontrarGrupoPorUid(uid, this.firestore);
        if (!grupoId) {
          this.erro = 'Grupo não encontrado.';
          this.carregando = false;
          return;
        }

        const membroRef = doc(this.firestore, `grupos/${grupoId}/membros/${uid}`);
        const membroSnap = await getDoc(membroRef);

        if (!membroSnap.exists()) {
          this.erro = 'Usuário não encontrado no grupo.';
          this.carregando = false;
          return;
        }

        const membro = membroSnap.data();
        this.authService.setUsuario(uid, membro['nome'], grupoId, membro['admin'] === true);
        this.router.navigate(['/']);
      }
    } catch (e: any) {
      console.error('Erro na autenticação:', e);
      this.erro = e.message || 'Erro ao conectar. Tente novamente.';
    }

    this.carregando = false;
  }

  alternarModo() {
    this.modo = this.modo === 'login' ? 'cadastro' : 'login';
    this.erro = '';
  }

  async enviarResetSenha() {
  if (!this.email) {
    this.erro = 'Digite seu e-mail para redefinir a senha.';
    return;
  }

  try {
    await sendPasswordResetEmail(getAuth(), this.email);
    alert('Enviamos um link para redefinir sua senha no e-mail informado.');
  } catch (e) {
    console.error('Erro ao enviar e-mail de redefinição:', e);
    this.erro = 'Erro ao enviar e-mail de redefinição.';
  }
}
}
