import { Component } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  nome: string = '';
  email: string = '';
  senha: string = '';
  mensagem: string = '';
  carregando: boolean = false;

  constructor(private firestore: Firestore, private auth: Auth) {}

  async criarPalpiteiro() {
    this.mensagem = '';
    this.carregando = true;

    try {
      const cred = await createUserWithEmailAndPassword(this.auth, this.email, this.senha);
      const uid = cred.user.uid;

      await setDoc(doc(this.firestore, `usuarios/${uid}`), {
        nome: this.nome,
        email: this.email,
        grupoId: 'default',
        admin: false
      });

      this.mensagem = '✅ Palpiteiro criado com sucesso!';
      this.nome = '';
      this.email = '';
      this.senha = '';
    } catch (e: any) {
      console.error('Erro ao criar palpiteiro:', e);
      this.mensagem = '❌ Erro ao criar palpiteiro. ' + (e.message || '');
    }

    this.carregando = false;
  }
}
