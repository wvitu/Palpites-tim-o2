import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioAtual = new BehaviorSubject<User | null>(null);

  usuario$ = this.usuarioAtual.asObservable();

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (usuario) => {
      this.usuarioAtual.next(usuario);
    });
  }

  login(email: string, senha: string) {
    return signInWithEmailAndPassword(this.auth, email, senha);
  }

  registrar(email: string, senha: string) {
    return createUserWithEmailAndPassword(this.auth, email, senha);
  }

  logout() {
    return signOut(this.auth);
  }

  getUsuarioAtual() {
    return this.usuarioAtual.getValue();
  }

  getUidGrupo(): string | null {
    return this.getUsuarioAtual()?.uid || null;
  }
}
