import { Injectable } from '@angular/core';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  nome: string = '';
  grupoId: string = '';
  isAdmin: boolean = false;

  constructor(private http: HttpClient) {
    this.carregarSessao();
  }

  async loginComBackend(nome: string, grupoId: string, admin: boolean): Promise<boolean> {
    try {
      const response: any = await this.http
        .post('http://localhost:3000/gerar-token', { nome, admin })
        .toPromise();

      const token = response.token;
      const auth = getAuth();
      await signInWithCustomToken(auth, token);

      this.setUsuario(nome, admin, grupoId);
      return true;
    } catch (err) {
      console.error('Erro ao logar com token:', err);
      return false;
    }
  }

  setUsuario(nome: string, admin: boolean, grupoId: string) {
    this.nome = nome;
    this.isAdmin = admin;
    this.grupoId = grupoId;

    localStorage.setItem('usuario', JSON.stringify({
      nome,
      isAdmin: admin,
      grupoId
    }));
  }

  carregarSessao() {
    const dados = localStorage.getItem('usuario');
    if (dados) {
      const user = JSON.parse(dados);
      this.nome = user.nome;
      this.grupoId = user.grupoId;
      this.isAdmin = user.isAdmin;
    }
  }

  logout() {
    getAuth().signOut();
    localStorage.clear();
  }

  estaLogado(): boolean {
    return !!this.nome && !!this.grupoId;
  }

  getUsuario(): string {
    return this.nome;
  }

  getGrupoId(): string {
    return this.grupoId;
  }

  isAdminUser(): boolean {
    return this.isAdmin;
  }
}
