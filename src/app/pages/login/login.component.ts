import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore,
  doc,
  getDoc,
  setDoc
} from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth.service';

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
    private authService: AuthService,
    private router: Router,
    public afAuth: Auth
  ) {}

  async autenticar() {
    this.erro = '';
    this.carregando = true;
    console.log('🔐 Iniciando autenticação...');

    try {
      if (this.modo === 'cadastro') {
        console.log('👤 Criando nova conta...');
        const cred = await createUserWithEmailAndPassword(
          this.afAuth,
          this.email,
          this.senha
        );

        const uid = cred.user.uid;
        const ref = doc(this.firestore, `usuarios/${uid}`);
        await setDoc(ref, {
          email: this.email,
          admin: true // padrão: não admin
        });

        this.authService.setUsuario(uid, this.email, 'default', false);
        this.router.navigate(['/']);
      } else {
        console.log('🔑 Logando usuário...');
        const cred = await signInWithEmailAndPassword(
          this.afAuth,
          this.email,
          this.senha
        );

        console.log('✅ Usuário autenticado:', cred.user);
        const uid = cred.user.uid;
        const ref = doc(this.firestore, `usuarios/${uid}`);
        const usuarioDoc = await getDoc(ref);

        if (!usuarioDoc.exists()) {
          this.erro = 'Usuário sem dados no sistema.';
          this.carregando = false;
          return;
        }

        const usuarioData = usuarioDoc.data();
        const grupoId = usuarioData?.['grupoId'] || 'default';
        const nome = usuarioData?.['nome'] || this.email;
        const admin = usuarioData?.['admin'] === true;

        this.authService.setUsuario(uid, nome, grupoId, admin);
        this.router.navigate(['/']);
      }
    } catch (e: any) {
      console.error('Erro na autenticação:', e);

      if (e.code === 'auth/email-already-in-use') {
        this.erro = 'Este e-mail já está em uso. Tente fazer login.';
      } else if (e.code === 'auth/invalid-email') {
        this.erro = 'E-mail inválido.';
      } else if (e.code === 'auth/weak-password') {
        this.erro = 'A senha deve ter pelo menos 6 caracteres.';
      } else {
        this.erro = 'Erro ao conectar. Tente novamente.';
      }
    } finally {
      this.carregando = false;
    }
  }

  alternarModo() {
    this.modo = this.modo === 'login' ? 'cadastro' : 'login';
    this.erro = '';
  }

  async enviarResetSenha() {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, this.email);
      alert('Email de redefinição de senha enviado.');
    } catch (e: any) {
      console.error('Erro ao enviar redefinição:', e);
      this.erro = 'Não foi possível enviar o email de redefinição.';
    }
  }
}
