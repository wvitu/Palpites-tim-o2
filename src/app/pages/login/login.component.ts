import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { environment } from 'src/environments/environment';

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

  constructor(private router: Router) {}

  async autenticar() {
    this.erro = '';
    this.carregando = true;

    try {
      const auth = getAuth();
      const cred = await signInWithEmailAndPassword(auth, this.email, this.senha);

      const uid = cred.user.uid;
      const db = getFirestore();
      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        this.erro = 'Usuário sem dados no Firestore.';
        return;
      }

      const dados = docSnap.data();
      console.log('Usuário logado:', dados);

      this.router.navigate(['/']);
    } catch (e) {
      console.error('Erro na autenticação:', e);
      this.erro = 'Erro ao conectar. Tente novamente.';
    }

    this.carregando = false;
  }

  async enviarResetSenha() {
    if (!this.email) {
      this.erro = 'Informe um e-mail válido para redefinir a senha.';
      return;
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, this.email);
      alert('E-mail de recuperação enviado com sucesso.');
    } catch (e) {
      console.error('Erro ao enviar redefinição:', e);
      this.erro = 'Erro ao enviar e-mail de recuperação.';
    }
  }
}
