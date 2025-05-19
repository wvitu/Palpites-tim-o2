import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  nome: string = '';
  grupoId: string = '';
  modo: 'login' | 'cadastro' = 'login';
  erro: string = '';
  carregando: boolean = false;

  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private router: Router
  ) {}

  async autenticar() {
    this.erro = '';
    this.carregando = true;

    try {
      const auth = getAuth();

      if (this.modo === 'cadastro') {
        const cred = await createUserWithEmailAndPassword(auth, this.email, this.senha);

        // Salva displayName do usuário
        await updateProfile(cred.user, { displayName: this.nome });

        // Salva no Firestore: grupo + admin
        await setDoc(doc(this.firestore, `usuarios/${cred.user.uid}`), {
          grupoId: this.grupoId,
          admin: true,
          nome: this.nome,
        });

        this.authService.setUsuario(cred.user.uid, this.nome, this.grupoId, true);
      } else {
        const cred = await signInWithEmailAndPassword(auth, this.email, this.senha);
        const uid = cred.user.uid;

        const userDoc = await getDoc(doc(this.firestore, `usuarios/${uid}`));
        if (!userDoc.exists()) {
          this.erro = 'Usuário sem dados de grupo.';
          this.carregando = false;
          return;
        }

        const data = userDoc.data();
        this.authService.setUsuario(uid, data['nome'], data['grupoId'], data['admin']);
      }

      this.router.navigate(['/']);
    } catch (e: any) {
      console.error('Erro na autenticação:', e);
      this.erro = e?.message || 'Erro ao autenticar.';
    }

    this.carregando = false;
  }

  alternarModo() {
    this.modo = this.modo === 'login' ? 'cadastro' : 'login';
    this.erro = '';
  }
}
