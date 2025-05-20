import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from '@angular/fire/auth';

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
    private firestore: Firestore,
    private router: Router,
    private authService: AuthService,
    private afAuth: Auth
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
      let credenciais;
      if (this.modo === 'cadastro') {
        credenciais = await createUserWithEmailAndPassword(this.afAuth, this.email, this.senha);
        const uid = credenciais.user.uid;
        await setDoc(doc(this.firestore, `usuarios/${uid}`), {
          nome: this.email,
          admin: true,
        });
      } else {
        credenciais = await signInWithEmailAndPassword(this.afAuth, this.email, this.senha);
      }

      const uid = credenciais.user.uid;
      const usuarioDoc = await getDoc(doc(this.firestore, `usuarios/${uid}`));
      const usuarioData = usuarioDoc.data();

      if (!usuarioDoc.exists()) {
        this.erro = 'Usuário sem dados no Firestore.';
        this.carregando = false;
        return;
      }

      const grupoId = usuarioData?.['grupoId'] || 'default';
      const nome = usuarioData?.['nome'] || this.email;
      const admin = usuarioData?.['admin'] === true;

      this.authService.setUsuario(uid, nome, grupoId, admin);
      this.router.navigate(['/']);
    } catch (e: any) {
      console.error('Erro na autenticação:', e);
      this.erro = 'Erro ao conectar. Tente novamente.';
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
      await sendPasswordResetEmail(this.afAuth, this.email);
      alert('Enviamos um link para redefinir sua senha no e-mail informado.');
    } catch (e) {
      console.error('Erro ao enviar e-mail de redefinição:', e);
      this.erro = 'Erro ao enviar e-mail de redefinição.';
    }
  }
}
