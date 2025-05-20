import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } from '@angular/fire/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

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

    try {
      if (this.modo === 'cadastro') {
        const cred = await createUserWithEmailAndPassword(this.afAuth, this.email, this.senha);
        const uid = cred.user.uid;

        await setDoc(doc(this.firestore, `grupos/lista/${uid}`), {
          email: this.email,
          nome: this.email,
          grupoId: 'default',
          admin: true
        });

        this.authService.setUsuario(uid, this.email, 'default', true);
        this.router.navigate(['/']);

      } else {
        const cred = await signInWithEmailAndPassword(this.afAuth, this.email, this.senha);
        const uid = cred.user.uid;

        const docRef = doc(this.firestore, `grupos/lista/${uid}`);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          this.erro = 'Usuário sem dados no Firestore';
          return;
        }

        const usuarioData = snap.data();
        const grupoId = usuarioData?.['grupoId'] || 'default';
        const nome = usuarioData?.['nome'] || this.email;
        const admin = usuarioData?.['admin'] === true;

        this.authService.setUsuario(uid, nome, grupoId, admin);
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
}
