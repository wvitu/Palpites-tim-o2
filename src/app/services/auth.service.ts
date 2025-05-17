import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usuario: string = '';
  admin: boolean = false;
  grupoId: string = '';

  constructor() {
    this.carregarSessao(); // Carrega ao inicializar
  }

  setUsuario(usuario: string, admin: boolean, grupoId: string) {
    this.usuario = usuario;
    this.admin = admin;
    this.grupoId = grupoId;

    // Salvar no localStorage
    localStorage.setItem('sessao', JSON.stringify({ usuario, admin, grupoId }));
  }

  carregarSessao() {
    const dados = localStorage.getItem('sessao');
    if (dados) {
      try {
        const parsed = JSON.parse(dados);
        this.usuario = parsed.usuario;
        this.admin = parsed.admin;
        this.grupoId = parsed.grupoId;
      } catch {
        console.warn('Erro ao carregar sessão do localStorage.');
        this.logout(); // limpar se inválido
      }
    }
  }

  isAdmin(): boolean {
    return this.admin;
  }

  getGrupoId(): string {
    return this.grupoId;
  }

  getUsuario(): string {
    return this.usuario;
  }

  logout() {
    this.usuario = '';
    this.admin = false;
    this.grupoId = '';
    localStorage.removeItem('sessao');
  }

  estaLogado(): boolean {
    return !!this.usuario && !!this.grupoId;
  }
}
