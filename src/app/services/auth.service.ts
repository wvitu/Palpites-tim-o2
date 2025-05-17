import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuario: { nome: string; admin: boolean; uidGrupo: string } | null = null;

  constructor() {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      this.usuario = JSON.parse(usuarioSalvo);
    }
  }

  setUsuario(nome: string, admin: boolean, uidGrupo: string): void {
    this.usuario = { nome, admin, uidGrupo };
    localStorage.setItem('usuario', JSON.stringify(this.usuario));
  }

  getUsuario(): { nome: string; admin: boolean; uidGrupo: string } | null {
    if (!this.usuario) {
      const local = localStorage.getItem('usuario');
      this.usuario = local ? JSON.parse(local) : null;
    }
    return this.usuario;
  }

  getUidGrupo(): string | null {
    return this.getUsuario()?.uidGrupo || null;
  }

  getNome(): string | null {
    return this.getUsuario()?.nome || null;
  }

  isAdmin(): boolean {
    return this.getUsuario()?.admin === true;
  }

  isAutenticado(): boolean {
    return !!this.getUsuario();
  }

  logout(): void {
    this.usuario = null;
    localStorage.removeItem('usuario');
  }
}
