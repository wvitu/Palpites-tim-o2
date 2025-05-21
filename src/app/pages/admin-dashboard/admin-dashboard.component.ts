import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  email: string = '';
  senha: string = '';
  nome: string = '';
  mensagem: string = '';
  erro: string = '';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  async criarPalpiteiro() {
    this.erro = '';
    this.mensagem = '';

    if (!this.email || !this.senha || !this.nome) {
      this.erro = 'Preencha todos os campos';
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(this.auth, this.email, this.senha);
      const uid = cred.user.uid;
      const ref = doc(this.firestore, `usuarios/${uid}`);

      await setDoc(ref, {
        email: this.email,
        nome: this.nome,
        admin: false,
        grupoId: this.authService.getGrupoId()
      });

      this.mensagem = `Palpiteiro ${this.nome} criado com sucesso!`;
      this.email = '';
      this.senha = '';
      this.nome = '';
    } catch (e: any) {
      console.error('Erro ao criar palpiteiro:', e);
      this.erro = 'Erro ao criar palpiteiro. Tente novamente.';
    }
  }
}
